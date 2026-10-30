# Se Nos Fue de las Manos · Web "El programa"

Contexto para seguir desarrollando la web de SNFM. Leelo entero antes de tocar código.

## Qué es el proyecto

Web de **Se Nos Fue de las Manos (SNFM)**: el podcast, el **Marketing Fest** (el evento de marketing más grande de la FCE UBA, que SNFM organiza con Tomás Cazalá, el cuerpo docente de Marketing Digital, el CECE, la Secretaría de Graduados y la FCE UBA) y los servicios para marcas.

Hasta el 30/10/2026 esta web era la landing del Marketing Fest 2da edición ("La cuadra": una calle con anuncios que abrían paneles). El evento terminó y Ro pidió sacar la calle y pasar a una web de SNFM. La versión vieja queda en el historial de git.

La dueña del proyecto es **Ro (Rocío Vallbona)**, Responsable Comercial en DT Comunicación, cofundadora de Doble Dosis y docente de Marketing Digital en la FCE. Trabaja siempre en español rioplatense, con voseo.

**Objetivos de la web:**
1. Que la gente **descargue las presentaciones** del Marketing Fest 2026.
2. Que vaya a **YouTube** a ver los capítulos del podcast.
3. Que **las marcas contraten a SNFM**: contenido de marca en la calle y organización de eventos. El contacto es el WhatsApp de Ro.

## Concepto: "El programa"

La web es un capítulo de SNFM y **Manu, el vocero con IA de SNFM, es el conductor**. El look sale de las miniaturas del canal de YouTube: bloques planos amarillo `#F3DA00` y negro `#202020`, títulos enormes en Anton y el número de capítulo ("#01").

- **Hero (#00):** "Se nos fue de las manos" gigante, chips con números y la tarjeta de Manu con su burbuja de bienvenida.
- **Cada sección es un capítulo** con número, título y una línea de Manu (`.says`).
- **"Preguntale a Manu":** botón flotante que abre un `<dialog>` con preguntas y respuestas armadas (`QA` en el script). No es IA de verdad; si algún día se conecta a una IA, sería vía n8n.
- **Manu todavía no tiene material:** `MANU` en `data.js` tiene `video`, `poster` e `img` vacíos y se muestra su inicial "M" sobre amarillo. Cuando Ro pase el video o la imagen, completar esos campos (el video va vertical, muteado, con botón "Activar sonido").

### Secciones (en orden)

| # | id | Qué tiene |
|---|---|---|
| 00 | `inicio` | Hero con Manu |
| 01 | `podcast` | Dos destacados grandes (Con el Kora y McDonald's, `hot: true`), grilla de capítulos y botón al canal |
| 02 | `fest-2026` | Así fue la 2da edición, **presentaciones para descargar** (`#descargas`, con pestañas Martes 27 / Miércoles 28), fotos (`GAL2`, oculta mientras esté vacía) y marcas que acompañaron |
| 03 | `fest-2025` | La 1ra edición: video de la sala llena, números, fotos y sponsors |
| 04 | `calle` | Para marcas: contenido en la calle, con reels de Instagram |
| 05 | `eventos` | Para marcas: organización de eventos, con el Fest como caso |
| 06 | `hablemos` | WhatsApp de Ro |

Los links viejos de la landing (`#inscripcion`, `#speakers`, `#cronograma`, `#primera-edicion`, etc.) redirigen a la sección nueva que corresponde (`OLD` al final del script).

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

Sitio estático, sin build ni dependencias:

- **`index.html`:** HTML, CSS y JS (~160 KB, casi todo es el SVG del logo SNFM).
- **`data.js`:** todos los datos. **Para sumar contenido se edita este archivo**, no el HTML.
- **`assets/img/`:** `speakers/` (fotos por slug), `ed1/` (fotos de la 1ra edición y del equipo), `logos/`. Las fotos de la 2da edición van en `assets/img/ed2/`.
- **`assets/presentaciones/`:** los PDF de las charlas del Fest 2026, con nombre `dia-hora-speaker.pdf`.
- **`assets/ed1-sala-llena.mp4` / `.webm` / `.jpg`:** video vertical de la sala vacía a la sala llena (1ra edición).

### Datos (`data.js`)

- **`CONFIG`:** `youtube`, `instagram` y `whatsapp` (wa.me al 11 5134-1115 de Ro, con mensaje precargado).
- **`MANU`:** material de Manu (ver arriba).
- **`EPISODES`:** capítulos del podcast, del más nuevo al más viejo: `{n, id, t, g, b, hot, fest}`. `id` es el código de YouTube; si está vacío, el capítulo lleva al canal y la miniatura se arma con el título (pasa con el #9 de Belu Fiora, que no tiene link todavía). Las miniaturas salen de `i.ytimg.com/vi/<id>/hqdefault.jpg`.
- **`REELS`:** códigos de los reels de Instagram; el primero (`DYiW6gNxA1m`) va grande como destacado. Se muestran con el embed oficial de IG, que se carga recién cuando la sección está cerca.
- **`DATA`:** cronograma del Fest 2026: `{d, t, n, c, tp, k, ph, pause, dl, pend, ep}`. `dl` es la ruta del PDF; `pend: true` muestra "La presentación llega pronto"; `ep` son los números de capítulos del podcast relacionados (botón "Podcast #N"). Los paneles no tienen presentación.
- **`PH`:** fotos de speakers por slug.
- **`GAL2`:** fotos de la 2da edición (`{src, alt}`), vacía por ahora.
- **`GAL` / `TEAM`:** fotos de la 1ra edición y del equipo.
- **`MF_LOGO`, `MAIN_SPONSORS`** (Heineken 0.0 y CCU), **`SPONSORS`, `MEDIA`, `LOGOS`** (apoyo institucional), **`SPONSORS_ED1`.** Si un logo no tiene `src`, se muestra el nombre en Anton.

**Google Tag Manager:** contenedor `GTM-5Z65GSRG`, arriba de todo en el `<head>` y `<noscript>` al abrir el `<body>`. Los eventos se configuran desde GTM; los links útiles para medir tienen `data-dl` (descargas), `data-ep` (capítulos) y `data-wa` (WhatsApp).

**Favicon:** `favicon.png` y `apple-touch-icon.png` en la raíz.

## Pendientes

1. **Presentaciones que faltan:** Sabrina Kolod (martes) y del miércoles Fernanda Rivera, Aldana Abadi, Carolina Geler, ABN, Meta y Rappi (`pend: true`). Cuando llegue cada una: copiarla a `assets/presentaciones/`, poner `dl` y sacar `pend`. Antes de publicar, que Ro confirme el OK de cada speaker.
2. **Fotos de la 2da edición:** Ro las va a pasar. Van a `assets/img/ed2/` y a `GAL2`.
3. **Material de Manu:** video o imagen.
4. **Link del capítulo #9** (Belu Fiora, Hacks Digital).
5. **Números reales de la 2da edición** (asistentes).
6. **Logo de Mikhuna Nikkei** (sponsor de la 1ra edición), hoy como texto.
7. **Precios:** no se muestran en la web salvo que Ro lo pida.

## Checklist antes de cada entrega

- Probar desktop 1440×900 y mobile 390×844, en modo claro y oscuro.
- Que cada "Descargar PDF" baje el archivo correcto y que los capítulos abran el video correcto en YouTube.
- Que los botones de WhatsApp abran el chat con Ro.
- Que no aparezca ninguna marca no confirmada y que todo el copy esté en voseo.
