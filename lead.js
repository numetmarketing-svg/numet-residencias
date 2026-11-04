// Recibe el formulario de la landing y lo reenvía al webhook configurado
// (GoHighLevel, n8n, Make, etc.) en la variable de entorno WEBHOOK_URL de Vercel.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  // Campo trampa contra spam: si viene completo, se ignora en silencio.
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

  const payload = {
    ...body,
    origen: "landing-residencias",
    fecha: new Date().toISOString(),
  };
  delete payload.website;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    res.status(502).json({ ok: false, error: "webhook_failed" });
  }
};
