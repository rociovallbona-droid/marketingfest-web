# Se Nos Fue de las Manos · Web "El programa"

Contexto para seguir desarrollando la web de SNFM. Leelo entero antes de tocar código.

## Qué es el proyecto

Web de **Se Nos Fue de las Manos (SNFM)**: el podcast, el **Marketing Fest** (el evento de marketing más grande de la FCE UBA, que SNFM organiza con Tomás Cazalá, el cuerpo docente de Marketing Digital, el CECE, la Secretaría de Graduados y la FCE UBA) y los servicios para marcas.

Hasta el 30/10/2026 esta web era la landing del Marketing Fest 2da edición ("La cuadra": una calle con anuncios que abrían paneles). El evento terminó y Ro pidió sacar la calle y pasar a una web de SNFM. La versión vieja queda en el historial de git.

**Quiénes somos (en palabras de Ro):** en SNFM son docentes, ayudantes y estudiantes de la UBA con ganas de enseñar desde otro lado: salir del aula y ver la verdad de cada empresa, el verdadero detrás, la cocina del marketing. Para eso hacen el podcast con gerentes de marketing de marcas referentes y el Marketing Fest, un evento para todo el mundo que busca **democratizar el conocimiento**: que no tengas que pagar una fortuna para ver a los capos del rubro hacer lo que hacen bien y entender cómo escalar tu negocio o tu carrera profesional. Este es el mensaje central de la web (sección "Salimos del aula" del inicio).

La dueña del proyecto es **Ro (Rocío Vallbona)**, Responsable Comercial en DT Comunicación, cofundadora de Doble Dosis y docente de Marketing Digital en la FCE. Trabaja siempre en español rioplatense, con voseo.

**Objetivos de la web:**
1. Que la gente **descargue las presentaciones** del Marketing Fest 2026.
2. Que vaya a **YouTube** a ver los capítulos del podcast.
3. Que **las marcas contraten a SNFM**: contenido de marca en la calle, videos y UGC (con alguien de SNFM o de la empresa como cara) organización de eventos y **sponsoreo del podcast**. El contacto para servicios es el WhatsApp de **Juan Pedro** (+54 9 11 3478-4373).

## Concepto: "El programa"

La web es un programa de SNFM y **Manu, el vocero con IA de SNFM, es el conductor**. El look sale de las miniaturas del canal de YouTube: bloques planos amarillo `#F3DA00` y negro `#202020`, títulos enormes en Anton y el número de capítulo ("#01").

- **Hero (#00):** "Se nos fue de las manos" gigante, chips con números y la tarjeta de Manu con su burbuja de bienvenida.
- **Cada página tiene una línea de Manu** (`.says`) que la presenta.
- **"Preguntale a Manu":** botón flotante que abre un `<dialog>` con preguntas y respuestas armadas (`QA` en el script). No es IA de verdad; si algún día se conecta a una IA, sería vía n8n.
- **Manu es una mano ilustrada** con gorra y zapatillas, que muestra un celular y señala (fondo amarillo propio `#FBE90B`). `MANU.img` (`assets/img/manu.webp`) va entera en la tarjeta del inicio y `MANU.avatar` (`assets/img/manu-avatar.webp`, recorte de Manu de cuerpo casi entero) en los círculos chicos y en el botón "Preguntale a Manu". Si llega un video, va en `MANU.video` y reemplaza a la imagen en la tarjeta.

### Páginas

Cada botón del menú es una página propia, con su título, descripción, Open Graph y datos estructurados (JSON-LD) para SEO. Todas terminan con la banda "¿Tenés una marca? Hablemos." y tienen el botón de Manu.

| URL | Página | Qué tiene |
|---|---|---|
| `/` | Inicio | Hero con Manu, "Qué hacemos" (tarjetas a Podcast, Marketing Fest y Servicios) y los dos capítulos destacados |
| `/podcast/` | Podcast | Destacados (Con el Kora y McDonald's, `hot: true`) y todos los capítulos |
| `/marketing-fest/` | Marketing Fest | Qué es el Marketing Fest y una tarjeta por edición |
| `/marketing-fest/2026/` | 2da edición | Números, bloque "Las presentaciones" (`#descargas`) con el botón "Descargar las presentaciones", fotos (`GAL2`) y marcas |
| `/marketing-fest/2026/presentaciones/` | Presentaciones de la 2da edición | **La lista completa para descargar**, con pestañas por día. Pedido de Ro: en la página de la edición va solo el botón; el que quiere, entra. Los links viejos `#inscripcion`, `#speakers` y `#cronograma` y el botón del inicio llevan acá |
| `/marketing-fest/2025/` | 1ra edición | Video, números, una muestra de 4 fotos (`GAL_TEASER` en `build.js`), botón "Ver la galería" y sponsors |
| `/marketing-fest/2025/fotos/` | Galería de la 1ra edición | Todas las fotos por momento (`GAL_CATS`) y del equipo, descargables. Pedido de Ro: la página de la edición no tiene que ser larga; el que quiere, entra a la galería |
| `/servicios/` | Nuestros servicios | Cada servicio explicado en breve con "Ver más info" |
| `/servicios/contenido-en-la-calle/` | Contenido en la calle | Reels de Instagram |
| `/servicios/videos-y-ugc/` | Videos y UGC | UGC y producción de videos, con SNFM o alguien de la empresa como cara |
| `/servicios/eventos/` | Eventos | Qué hacemos al organizar un evento y marcas que confiaron en el Marketing Fest |
| `/servicios/sponsor-del-podcast/` | Sponsoreá el podcast | Tarjeta de precio "Sponsor del podcast · 2.000 USD" (solo podcast, `PODCAST_SPONSOR`), cómo aparece la marca (set, menciones, dónde se ve), marcas que pasaron por el podcast y capítulos de muestra. Todos los CTA van a `CONFIG.whatsappSponsor`: WhatsApp de Juan Pedro con mensaje de sponsoreo. También hay una franja "Tu marca en el podcast" al final de `/podcast/` |
| `/sumate/` | Sumate | Base de gente que quiere dar una mano (UGC, filmmakers, cámaras, edición, etc.). **No es remunerado: es por amor al marketing**, y se aclara arriba, en un recuadro y en una casilla obligatoria del formulario |

En el menú, "Marketing Fest" y "Servicios" tienen un desplegable (en desktop) con sus páginas internas. Los links viejos de la landing (`#inscripcion`, `#speakers`, `#cronograma`, `#primera-edicion`, `#organizan`, etc.) redirigen desde el inicio a la página nueva que corresponde.

### "Avisame cuando salga la 3ra"

Formulario (nombre y apellido, email, teléfono/WhatsApp) en el inicio, en `/marketing-fest/` y en las páginas de cada edición (`#tercera`); también hay botones "Avisame de la 3ra edición" en el hero del inicio y del Marketing Fest, y una respuesta en el chat de Manu. Hace POST a `CONFIG.avisoWebhook` con `{nombre, email, whatsapp, evento: 'Marketing Fest · 3ra edición', tipo: 'aviso-3ra-edicion', origen, fecha}` y empuja el evento `aviso_3ra_edicion` al `dataLayer` de GTM. Hoy usa el webhook de la pre-inscripción 2026 (`https://n8n.dtcomunicacion.com/webhook/preinscripcion-mkt-fest`, workflow `E6dF41wKNW31obCu`, data table `d7GBQXcVm9nlEQsh`). Ojo: ese workflow no duplica por email, así que quien ya estaba pre-inscripto en 2026 no se guarda de nuevo (igual ya está en la lista). Si se arma una tabla propia para la 3ra, cambiar solo `CONFIG.avisoWebhook`. En el navegador queda guardado con la clave `mktfest-aviso-3ra` para mostrar "¡Listo!" si vuelve.

### Formularios y avisos por mail

Todos los formularios avisan por mail a **Ro (rociovallbona@dtcomunicacion.com), Tomás (tomas@dtcomunicacion.com) y Sol (solciesc@gmail.com)**: hacen POST a `CONFIG.formsWebhook` (`https://n8n.dtcomunicacion.com/webhook/formularios-snfm`) con `{tipo, asunto, campos: [[etiqueta, valor]], datos, origen, fecha}`. El workflow está en **`n8n/formularios-web.json`** (webhook → arma el mail → Send Email por SMTP → responde a la web): hay que importarlo en n8n, elegir la credencial SMTP, completar `fromEmail` y activarlo. Si el webhook no responde (por ejemplo, porque todavía no se importó), el formulario muestra "¡Casi listo!" con un botón que manda lo mismo por WhatsApp a Juan Pedro, así no se pierde nada.

| Formulario | Dónde | `tipo` | Qué pide |
|---|---|---|---|
| Avisame de la 3ra (`#tercera`) | Inicio, Marketing Fest y cada edición | `aviso-3ra-edicion` | Nombre, email, teléfono. Además guarda en la tabla de la pre-inscripción (`CONFIG.avisoWebhook`) |
| Vení al podcast (`#invitado`) | `/podcast/` (y link desde el sponsor del podcast) | `capitulo-podcast` | Nombre, marca, cargo, email, teléfono y de qué quiere hablar. **Gratis, sin ser sponsor** |
| Sé speaker en el Marketing Fest (`#speaker`) | `/marketing-fest/` (y links desde cada edición) | `speaker-fest` | Nombre, marca, cargo, email, teléfono, **propuesta de valor para la gente** (mínimo 40 caracteres) y LinkedIn opcional. **Gratis** |
| Sumá tu marca como sponsor (`#sponsor-3ra`) | `/marketing-fest/` (y botón en "Gracias a las marcas" de 2026) | `sponsor-fest` | Nombre, marca, cargo, email, teléfono, qué le interesa (main sponsor, sponsor, stand, sorteo, todavía no sé) y mensaje opcional |
| Sumate (`#anotate`) | `/sumate/` | `sumate` | Nombre, email, teléfono, roles (`ROLES`), link y mensaje opcionales y la casilla "no es remunerado" |

**Todos los formularios arrancan plegados** (pedido de Ro: si no, la página es eterna): se ve la etiqueta, el título, el texto y un botón ("Quiero ser speaker", "Quiero ser sponsor", "Avisame", etc.) que despliega el formulario. Se abren solos si se llega con el link directo (`#speaker`, `#sponsor-3ra`, `#tercera`, `#invitado`, `#anotate`) o desde un botón de la misma página que apunte ahí. Sin JS se ven abiertos. Los formularios se arman con `formBlock()` en `build.js` y los maneja un solo bloque de `assets/site.js` (`form[data-form]`). Evento de GTM: `formulario` con `tipo` y `enviado`.

## Marca

### SNFM (manual de marca de julio 2025, por Lila Sans)

Ro pasó el manual y los archivos en alta el 30/10/2026. Están en `assets/img/snfm/` (webp); los originales en PNG los tiene Ro en el Drive.

- **Primarios:** `#F3DA00` amarillo · `#E4E4A8` crema · `#202020` oscuro · `#F2F2F2` claro.
- **Secundarios** (para recursos gráficos): `#F9A900` naranja · `#EB462E` rojo · `#A68ADE` violeta · `#44BDDE` cian · `#2EA866` verde. El manual prohíbe colores flúo (verde, rojo puro, violeta eléctrico, lima).
- **Tipografía:** **Anton** para títulos (siempre en mayúsculas) y **Quicksand** para el cuerpo (500 a 700), de Google Fonts.
- **Logos:** `logo-se-nos-fue.webp` (isologo completo, va en el footer), `logo-snfm.webp` (imagotipo "SNFM", va en el menú) y `chasquido.webp` (la mano sola con contorno). Siempre en sus colores originales (letras blancas con contorno negro), también sobre el negro del menú y el footer: no invertirlos.
- **Recursos gráficos principales:** las tres manos (`mano-chasquido`, `mano-ok`, `mano-saludo`). **Secundarios:** formas (`forma-destello`, `forma-estrella`, `forma-flor`, `forma-sol`, `forma-engranaje`, `forma-asterisco`), la flecha ↘ (`#arr` en `assets/icons.svg`) y el sticker redondo (`sticker.webp`). Manos y formas son siluetas blancas: se pintan con cualquier color de la paleta con `shape(P, nombre, color, clase)` en `build.js` (usa `mask-image`).
- **Texturas:** papel arrugado claro y oscuro (`textura-clara`, `textura-oscura`), sutiles de fondo en el hero del inicio, los heros de cada página y las bandas amarillas.
- **Pastillas tipo sticker** (como en el manual: "SE VIENE", "SOON"): `.pill` con `.p-red` / `.p-violet`, rotadas sobre el título del inicio ("Podcast", "Mkt Fest").
- **Dónde está cada recurso:** sticker pegado en la tarjeta de Manu; mano OK amarilla en "Salimos del aula"; en los heros: podcast (chasquido blanco: sobre fondo oscuro las manos van en blanco, como en el manual), servicios (OK negra), sumate (saludo negra), sponsor del podcast (flor violeta), calle (sol rojo), videos (destello cian), eventos (asterisco verde). Se pasan con `deco: [nombre, color]` en `pageHero`.

### Marketing Fest

- **Logo y recursos: los que pasó Ro el 30/10/2026, en buena calidad**, en `assets/img/fest/` (webp). Usarlos siempre que se mencione el Marketing Fest:
  - Logo horizontal "MARKETING FEST": `logo-marketing-fest.webp` (negro y naranja, fondos claros), `logo-marketing-fest-blanco.webp` (blanco y naranja, fondos oscuros) y `logo-marketing-fest-negro.webp`.
  - Logo compacto "MKT FEST": `logo-mkt-fest.webp` y `logo-mkt-fest-blanco.webp`.
  - Recursos: estrellas sueltas y de a tres (`estrella-*`, `estrellas-*`, en naranja, amarillo, celeste y azul), bandas (`banda-naranja`, `banda-azul`), destellos de puntos (`destello-naranja`, `destello-amarillo`) y línea con punto (`linea-naranja`). Los originales en alta (PNG, también en gris, negro y un degradé) los tiene Ro en el Drive.
  - Rutas en `MF_LOGO` de `data.js` (`light`, `dark`, `mini`, `miniDark`).
- **Dónde se usan:** las páginas del Marketing Fest tienen el hero con `fest: true` (logo arriba, destello naranja y tres estrellas amarillas de fondo); en `/marketing-fest/` el logo es el título (`logoTitle`). Las tarjetas de cada edición llevan una estrella, la tarjeta del Marketing Fest en el inicio lleva el "MKT FEST", las etiquetas de los formularios del Marketing Fest van sobre la banda naranja (`.num.ribbon`) y "Gracias a las marcas" lleva tres estrellas naranjas.
- Reemplaza al logo anterior con la bajada "SEGUNDA EDICIÓN" (426 px), que se sacó.
- Las fotos de speakers son retratos en B&N sobre naranja `#E95D3A` (`--fest`).

## Tono y copy

- **Español rioplatense con voseo, siempre:** "Descargá", "Mirá", "Escribile a Ro", "Bajalas en PDF".
- **Directo, cercano y con humor de calle**, sin solemnidad institucional.
- **Los CTA dicen exactamente qué pasa:** "Descargar PDF", "Ver el capítulo", "Quiero contenido en la calle", "Escribile a Juan Pedro".
- **Sin anglicismos innecesarios**, salvo los propios del rubro (speaker, sponsor, break, reel).
- **Datos de speakers:** se respeta lo que viene de la planilla o del deck, solo con correcciones de tipeo. Nunca inventar títulos de charla.
- **Números:** no inventar. 1ra edición: +1200 personas y 16 speakers. 2da edición: **más de 2600 personas** (dato de Ro, 30/10/2026) y +30 speakers. Entre las dos ediciones, **más de 3800 personas** y **más de 60 speakers** (datos de Ro). La cantidad de charlas sale de `DATA`.
- **Siempre "Marketing Fest", nunca "Fest" solo** (pedido de Ro: es una marca). Vale para textos, botones, el chat de Manu, alt de imágenes y metadatos. El logo compacto "MKT FEST" es la única excepción, porque es un logo.
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
- **`assets/icons.svg`:** sprite con la flecha (`#arr`) y WhatsApp (`#wa`), se usa con `<use href="…/assets/icons.svg#arr">`. Necesita servirse por http (no anda abriendo el archivo con doble clic). Los logos de SNFM son imágenes en `assets/img/snfm/`.
- **Rutas relativas** en todos los links (`rel()` en `build.js`), así funciona en un dominio propio o en una subcarpeta.
- **`assets/img/`:** `speakers/`, `ed1/`, `logos/`. Las fotos de la 2da edición van en `assets/img/ed2/`.
- **`assets/presentaciones/`:** los PDF de las charlas del Marketing Fest 2026 (`dia-hora-speaker.pdf`). El peso que muestra el botón lo calcula el build.
- **`assets/ed1-sala-llena.mp4` / `.webm` / `.jpg`:** video vertical de la 1ra edición.

**SEO pendiente:** completar `CONFIG.site` con el dominio cuando esté definido y correr el build; eso agrega `canonical`, `og:url`, URLs absolutas en `og:image` y el `sitemap.xml`.

### Datos (`data.js`)

- **`CONFIG`:** `site` (dominio, para SEO), `youtube`, `instagram`, `contacto` (nombre y teléfono que se muestran) `whatsapp` (wa.me al 11 3478-4373 de Juan Pedro, con mensaje precargado) y `whatsappSponsor` (mismo número, con el mensaje de sponsoreo del podcast). Para cambiar el contacto de servicios se tocan solo `contacto` y `whatsapp`.
- **`MANU`:** `img`, `avatar`, `video` y `poster` de Manu (ver arriba).
- **`EPISODES`:** capítulos del podcast, del más nuevo al más viejo: `{n, id, t, g, b, hot, fest}`. `id` es el código de YouTube; si está vacío, el capítulo lleva al canal y la miniatura se arma con el título (pasa con el #9 de Belu Fiora, que no tiene link todavía). Las miniaturas salen de `i.ytimg.com/vi/<id>/hqdefault.jpg`.
- **`REELS`:** códigos de los reels de Instagram; el primero (`DYiW6gNxA1m`) va grande como destacado. Se muestran con el embed oficial de IG, que se carga recién cuando la sección está cerca.
- **`DATA`:** cronograma del Marketing Fest 2026: `{d, t, n, c, tp, k, ph, pause, dl, pend, ep}`. `dl` es la ruta del PDF; `pend: true` muestra "La presentación llega pronto"; `ep` son los números de capítulos del podcast relacionados (botón "Podcast #N"). Los paneles no tienen presentación.
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
6. **Logo de Mikhuna Nikkei** (sponsor de la 1ra edición), hoy como texto.
7. **Importar `n8n/formularios-web.json` en n8n** (credencial SMTP, `fromEmail`, activar) para que lleguen los mails de todos los formularios. Si además quieren una planilla con todo, sumar un nodo de data table o Google Sheets al mismo workflow.
8. **Precios:** el único precio publicado es el del sponsoreo del podcast solo (2.000 USD, pedido de Ro el 30/10/2026), en `PODCAST_SPONSOR` de `data.js`. Los paquetes del Marketing Fest (main sponsor 6.000 USD, platinum, etc.) no se publican salvo que Ro lo pida. Confirmar con Ro qué incluye el de 2.000 (hoy: sponsor del podcast con transmisión en Gigared, set y menciones, activación o sorteo en la comunidad) y por cuánto tiempo.

## Checklist antes de cada entrega

- Correr `node build.js` y probar con un servidor local (`python3 -m http.server`).
- Probar desktop 1440×900 y mobile 390×844, en modo claro y oscuro, todas las páginas.
- Que cada "Descargar PDF" baje el archivo correcto y que los capítulos abran el video correcto en YouTube.
- Que los botones de WhatsApp abran el chat con Juan Pedro.
- Que no aparezca ninguna marca no confirmada y que todo el copy esté en voseo.
