# Numet para Residencias — landing

Landing estática (HTML) con calculadora y formulario. El formulario envía los datos a `/api/lead`, una función de Vercel que los reenvía a tu webhook (GoHighLevel o n8n).

## Estructura

```
index.html          La landing completa
assets/             Logo, favicon e imagen para compartir
api/lead.js         Recibe el formulario y lo reenvía al webhook
vercel.json         Configuración de Vercel
```

## 1. Subir a GitHub

1. Entrá a github.com → **New repository** → nombre `numet-residencias` → **Create repository**.
2. Tocá **uploading an existing file** y arrastrá todo el contenido de esta carpeta (incluidas las carpetas `assets` y `api`).
3. **Commit changes**.

## 2. Publicar en Vercel

1. Entrá a vercel.com e iniciá sesión con tu cuenta de GitHub.
2. **Add New → Project** → elegí el repositorio `numet-residencias` → **Import**.
3. En *Framework Preset* dejá **Other**. No hace falta tocar nada más → **Deploy**.
4. Queda publicada en una dirección del tipo `https://numet-residencias.vercel.app`.

Cada vez que cambies un archivo en GitHub, Vercel la actualiza sola.

## 3. Conectar el formulario a tu CRM

Hasta que hagas este paso, el formulario igual funciona: al enviarlo, le pide a la persona que te mande los datos por WhatsApp con el mensaje ya escrito.

**Con GoHighLevel**
1. Automation → Workflows → **Create Workflow** → trigger **Inbound Webhook**.
2. Copiá la URL del webhook. Enviá una vez el formulario de prueba para que GHL reconozca los campos.
3. Agregá la acción **Create/Update Contact** y asigná los campos (nombre, whatsapp → teléfono, email, residencia → empresa, etc.). Podés sumar una notificación a tu WhatsApp o mail.
4. El trigger Inbound Webhook puede tener costo por uso según tu plan de GHL.

**Con n8n**: creá un flujo con el nodo **Webhook** (método POST) y usá su URL de producción.

**En Vercel**: Project → **Settings → Environment Variables** → agregá `WEBHOOK_URL` con la URL del paso anterior → **Save** → Deployments → **Redeploy**.

### Campos que llegan

`residencia`, `localidad`, `plazas_total`, `plazas_libres`, `cuota`, `casos`, `origen`, `publicidad`, `nombre`, `cargo`, `whatsapp`, `email`, `horario`, `pagina`, `origen` = `landing-residencias`, `fecha`.

## 4. Link personalizado para cada residencia

Agregá `?r=` y el nombre con guiones al final del link:

`https://numet-residencias.vercel.app/?r=residencia-del-arce`

La portada muestra "Propuesta preparada para Residencia del Arce" y el formulario ya trae el nombre cargado.

## 5. Vista previa al compartir por WhatsApp

Cuando tengas la dirección definitiva, cambiá en `index.html` la línea:

```html
<meta property="og:image" content="assets/og-numet.png">
```

por la dirección completa, por ejemplo `https://numet-residencias.vercel.app/assets/og-numet.png`, para que WhatsApp muestre el logo al compartir el link.

## Cambios frecuentes

- **Porcentajes (15% y 120%)**: están en el texto de la sección "Costos" y en la función `sim()` del script (`0.15` y `1.2`).
- **Teléfono de WhatsApp**: variable `WA` en el script y textos de contacto.
