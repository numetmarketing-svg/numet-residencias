// Recibe el formulario de la landing y lo reenvía al webhook configurado
// en la variable de entorno WEBHOOK_URL de Vercel.

function phoneAR(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("549")) return "+" + d;
  if (d.startsWith("54")) return "+549" + d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length === 12 && d.slice(2, 4) === "15") d = d.slice(0, 2) + d.slice(4);
  if (d.length === 10) return "+549" + d;
  return "+" + d;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  if (body.website) {
    res.status(200).json({ ok: true });
    return;
  }

  const required = ["residencia", "localidad", "nombre", "whatsapp"];
  const missing = required.filter((k) => !String(body[k] || "").trim());
  if (missing.length) {
    res.status(400).json({ ok: false, error: "missing_fields", fields: missing });
    return;
  }

  const url = process.env.WEBHOOK_URL;
  if (!url) {
    res.status(503).json({ ok: false, error: "webhook_not_configured" });
    return;
  }

  const full = String(body.nombre).trim().replace(/\s+/g, " ");
  const parts = full.split(" ");
  const payload = {
    ...body,
    nombre_completo: full,
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
    phone: phoneAR(body.whatsapp),
    origen: "landing-residencias",
    fecha: new Date().toISOString(),
  };
  delete payload.website;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      redirect: "follow",
    body: JSON.stringify(payload),
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    res.status(502).json({ ok: false, error: "webhook_failed" });
  }
};
