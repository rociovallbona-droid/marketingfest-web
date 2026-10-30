# Se Nos Fue de las Manos · Web "El programa"

Contexto para seguir desarrollando la web de SNFM. Leelo entero antes de tocar código.

## Qué es el proyecto

Web de **Se Nos Fue de las Manos (SNFM)**: el podcast, el **Marketing Fest** (el evento de marketing más grande de la FCE UBA, que SNFM organiza con Tomás Cazalá, el cuerpo docente de Marketing Digital, el CECE, la Secretaría de Graduados y la FCE UBA) y los servicios para marcas.

Hasta el 30/10/2026 esta web era la landing del Marketing Fest 2da edición ("La cuadra": una calle con anuncios que abrían paneles). El evento terminó y Ro pidió sacar la calle y pasar a una web de SNFM. La versión vieja queda en el historial de git.

La dueña del proyecto es **Ro (Rocío Vallbona)**, Responsable Comercial en DT Comunicación, cofundadora de Doble Dosis y docente de Marketing Digital en la FCE. Trabaja siempre en español rioplatense, con voseo.

**Objetivos de la web:**
1. Que la gente **descargue las presentaciones** del Marketing Fest 2026.
2. Que vaya a **YouTube** a ver los capítulos del podcast.
3. Que **las marcas contraten a SNFM**: contenido de marca en la calle, videos y UGC (con alguien de SNFM o de la empresa como cara) y organización de eventos. El contacto es el WhatsApp de Ro.

## Concepto: "El programa"

La web es un programa de SNFM y **Manu, el vocero con IA de SNFM, es el conductor**. El look sale de las miniaturas del canal de YouTube: bloques planos amarillo `#F3DA00` y negro `#202020`, títulos enormes en Anton y el número de capítulo ("#01").

- **Hero (#00):** "Se nos fue de las manos" gigante, chips con números y la tarjeta de Manu con su burbuja de bienvenida.
- **Cada página tiene una línea de Manu** (`.says`) que la presenta.
- **"Preguntale a Manu":** botón flotante que abre un `<dialog>` con preguntas y respuestas armadas (`QA` en el script). No es IA de verdad; si algún día se conecta a una IA, sería vía n8n.
- **Manu es una mano ilustrada** con gorra y zapatillas, que muestra un celular y señala (fondo amarillo propio `#FBE90B`). `MANU.img` (`assets/img/manu.webp`) va entera en la tarjeta del inicio y `MANU.avatar` (`assets/img/manu-cara.webp`, recorte de la cara) en los círculos chicos y en el botón "Preguntale a Manu". Si llega un video, va en `MANU.video` y reemplaza a la imagen en la tarjeta.

### Páginas

Cada botón del menú es una página propia, con su título, descripción, Open Graph y datos estructurados (JSON-LD) para SEO. Todas terminan con la banda "¿Tenés una marca? Hablemos." y tienen el botón de Manu.

| URL | Página | Qué tiene |
|---|---|---|
| `/` | Inicio | Hero con Manu, "Qué hacemos" (tarjetas a Podcast, Marketing Fest y Servicios) y los dos capítulos destacados |
| `/podcast/` | Podcast | Destacados (Con el Kora y McDonald's, `hot: true`) y todos los capítulos |
| `/marketing-fest/` | Marketing Fest | Qué es el Fest y una tarjeta por edición |
| `/marketing-fest/2026/` | 2da edición | Números, **presentaciones para descargar** (`#descargas`, pestañas por día), fotos (`GAL2`) y marcas |
| `/marketing-fest/2025/` | 1ra edición | Video, números, fotos por momento (descargables) y sponsors |
| `/servicios/` | Nuestros servicios | Cada servicio explicado en breve con "Ver más info" |
| `/servicios/contenido-en-la-calle/` | Contenido en la calle | Reels de Instagram |
| `/servicios/videos-y-ugc/` | Videos y UGC | UGC y producción de videos, con SNFM o alguien de la empresa como cara |
| `/servicios/eventos/` | Eventos | Qué hacemos al organizar un evento y marcas que confiaron en el Fest |

En el menú, "Marketing Fest" y "Servicios" tienen un desplegable (en desktop) con sus páginas internas. Los links viejos de la landing (`#inscripcion`, `#speakers`, `#cronograma`, `#primera-edicion`, `#organizan`, etc.) redirigen desde el inicio a la página nueva que corresponde.

## Marca

### SNFM (manual de marca de julio 2025, por Lila Sans)

- **Primarios:** `#F3DA00` amarillo · `#E4E4A8` crema · `#202020` oscuro · `#F2F2F2` claro.
- **Secundarios:** `#F9A900` naranja · `#EB462E` rojo · `#A68ADE` violeta · `#44BDDE` cian · `#2EA866` verde.
- **Tipografía:** **Anton** para títulos (siempre en mayúsculas) y **Quicksand** para el cuerpo (500 a 700), de Google Fonts.
- **Logo:** isologo SNFM inline como `<symbol id="snfm">`, se usa con `<use href="#snfm">`; en fondos oscuros, con la clase `.inv`. La flecha ↘ del manual es `<symbol id="arr">` y va en los CTA.

### Marketing Fest

- **Logo: siempre la versión con la bajada "SEGUNDA EDICIÓN"**: `assets/img/logos/marketing-fest-oscuro.png` (fondos claros) y `marketing-fest-blanco.png` (fondos oscuros). Son de 426 px; si llega una versión más grande o SVG, reemplazar.
- Las fotos de speakers son retratos en B&N sobre naranja `#E95D3A` (`--fest`).

## Tono y copy

- **Español rioplatense con voseo, siempre:** "Descargá", "Mirá", "Escribile a Ro", "Bajalas en PDF".
- **Directo, cercano y con humor de calle**, sin solemnidad institucional.
- **Los CTA dicen exactamente qué pasa:** "Descargar PDF", "Ver el capítulo", "Quiero contenido en la calle", "Escribile a Ro".
- **Sin anglicismos innecesarios**, salvo los propios del rubro (speaker, sponsor, break, reel).
- **Datos de speakers:** se respeta lo que viene de la planilla o del deck, solo con correcciones de tipeo. Nunca inventar títulos de charla.
- **Números:** no inventar. De la 2da edición todavía no hay cantidad de asistentes; se muestra "+30 speakers" y la cantidad de charlas sale de `DATA`.
- **No se anuncian marcas no confirmadas.** GenIA no se menciona.

### Reglas de diseño

- Una sola cosa audaz (el hero con los títulos gigantes); el resto, calmo.
- No usar eyebrows en mayúsculas sobre cada título (el "#01" es el recurso de las miniaturas, no un eyebrow), ni sombras grises genéricas tipo kit SaaS.
- Movimiento solo como respuesta a una acción del usuario, salvo el tipeo de la burbuja de Manu al cargar. `prefers-reduced-motion` respetado.
- Responsive hasta 390px. Dark mode con tokens (`:root`, `prefers-color-scheme`, `[data-theme]`): las secciones `.s-y` siguen amarillas, las `.s-ink` se oscurecen y las claras pasan a `#171717`. Foco visible amarillo (negro sobre amarillo). Safe areas de iOS.

## Arquitectura técnica

Sitio estático. Las páginas se **generan** con un script de Node sin dependencias:

- **`data.js`:** todos los datos. **Para sumar contenido se edita este archivo.**
- **`build.js`:** la plantilla común (head con SEO, menú, footer, chat de Manu) y el contenido de cada página. Correr `node build.js` después de cualquier cambio en `data.js` o `build.js`: regenera los `index.html` de cada carpeta, `robots.txt` y (si está `CONFIG.site`) `sitemap.xml`. **No editar los `index.html` a mano**: se pisan en cada build. Los HTML generados se commitean, así el sitio funciona en cualquier hosting sin paso de build.
- **`assets/site.css`** y **`assets/site.js`:** estilos y JS compartidos (pestañas, reels, chat). El contenido ya viene armado en el HTML, para que Google lo lea sin ejecutar JS.
- **`assets/icons.svg`:** sprite con el logo SNFM (`#snfm`), la flecha (`#arr`) y WhatsApp (`#wa`). Se usa con `<use href="…/assets/icons.svg#snfm">`; en fondos oscuros, con la clase `.inv`. Necesita servirse por http (no anda abriendo el archivo con doble clic).
- **Rutas relativas** en todos los links (`rel()` en `build.js`), así funciona en un dominio propio o en una subcarpeta.
- **`assets/img/`:** `speakers/`, `ed1/`, `logos/`. Las fotos de la 2da edición van en `assets/img/ed2/`.
- **`assets/presentaciones/`:** los PDF de las charlas del Fest 2026 (`dia-hora-speaker.pdf`). El peso que muestra el botón lo calcula el build.
- **`assets/ed1-sala-llena.mp4` / `.webm` / `.jpg`:** video vertical de la 1ra edición.

**SEO pendiente:** completar `CONFIG.site` con el dominio cuando esté definido y correr el build; eso agrega `canonical`, `og:url`, URLs absolutas en `og:image` y el `sitemap.xml`.

### Datos (`data.js`)

- **`CONFIG`:** `site` (dominio, para SEO), `youtube`, `instagram` y `whatsapp` (wa.me al 11 5134-1115 de Ro, con mensaje precargado).
- **`MANU`:** `img`, `avatar`, `video` y `poster` de Manu (ver arriba).
- **`EPISODES`:** capítulos del podcast, del más nuevo al más viejo: `{n, id, t, g, b, hot, fest}`. `id` es el código de YouTube; si está vacío, el capítulo lleva al canal y la miniatura se arma con el título (pasa con el #9 de Belu Fiora, que no tiene link todavía). Las miniaturas salen de `i.ytimg.com/vi/<id>/hqdefault.jpg`.
- **`REELS`:** códigos de los reels de Instagram; el primero (`DYiW6gNxA1m`) va grande como destacado. Se muestran con el embed oficial de IG, que se carga recién cuando la sección está cerca.
- **`DATA`:** cronograma del Fest 2026: `{d, t, n, c, tp, k, ph, pause, dl, pend, ep}`. `dl` es la ruta del PDF; `pend: true` muestra "La presentación llega pronto"; `ep` son los números de capítulos del podcast relacionados (botón "Podcast #N"). Los paneles no tienen presentación.
- **`PH`:** fotos de speakers por slug.
- **`GAL2`:** fotos de la 2da edición (`{src, alt}`), vacía por ahora.
- **`GAL` / `GAL_CATS` / `TEAM`:** fotos de la 1ra edición (agrupadas por momento en el orden de `GAL_CATS`) y del equipo.
- **`MF_LOGO`, `MAIN_SPONSORS`** (Heineken 0.0 y CCU), **`SPONSORS`, `MEDIA`, `LOGOS`** (apoyo institucional), **`SPONSORS_ED1`.** Si un logo no tiene `src`, se muestra el nombre en Anton.

**Google Tag Manager:** contenedor `GTM-5Z65GSRG`, en todas las páginas, arriba de todo en el `<head>` y `<noscript>` al abrir el `<body>`. Los eventos se configuran desde GTM; los links útiles para medir tienen `data-dl` (descargas), `data-ep` (capítulos) y `data-wa` (WhatsApp).

**Favicon:** `favicon.png` y `apple-touch-icon.png` en la raíz.

## Pendientes

1. **Presentaciones que faltan:** Sabrina Kolod (martes) y del miércoles Fernanda Rivera, ABN, Meta y Rappi (`pend: true`). Mariano Garibini y Tomás Cazalá no tienen presentación en la planilla. Cuando llegue cada una: copiarla a `assets/presentaciones/`, poner `dl` y sacar `pend`. Antes de publicar, que Ro confirme el OK de cada speaker.
2. **Fotos de la 2da edición:** Ro las va a pasar. Van a `assets/img/ed2/` y a `GAL2`.
4. **Link del capítulo #9** (Belu Fiora, Hacks Digital).
5. **Números reales de la 2da edición** (asistentes).
6. **Logo de Mikhuna Nikkei** (sponsor de la 1ra edición), hoy como texto.
7. **Precios:** no se muestran en la web salvo que Ro lo pida.

## Checklist antes de cada entrega

- Correr `node build.js` y probar con un servidor local (`python3 -m http.server`).
- Probar desktop 1440×900 y mobile 390×844, en modo claro y oscuro, todas las páginas.
- Que cada "Descargar PDF" baje el archivo correcto y que los capítulos abran el video correcto en YouTube.
- Que los botones de WhatsApp abran el chat con Ro.
- Que no aparezca ninguna marca no confirmada y que todo el copy esté en voseo.
