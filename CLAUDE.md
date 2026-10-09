# Marketing Fest 2026 · Landing "La cuadra"

Contexto completo para seguir desarrollando la landing del Marketing Fest 2da edición. Leelo entero antes de tocar código.

## Qué es el proyecto

Landing del **Marketing Fest 2da edición**, el evento de marketing más grande de la Facultad de Ciencias Económicas de la UBA. Lo organiza **Se Nos Fue de las Manos (SNFM)** junto con Tomás Cazalá, el cuerpo docente de Marketing Digital, el Centro de Estudiantes (CECE), la Secretaría de Graduados y la FCE UBA.

La dueña del proyecto es **Ro (Rocío Vallbona)**, Responsable Comercial en DT Comunicación, cofundadora de Doble Dosis y docente de Marketing Digital en la FCE. Trabaja siempre en español rioplatense, con voseo.

Objetivo de la web: que la gente **se inscriba** (gratis, cupos limitados), conozca speakers y cronograma, y que **marcas se sumen como sponsors**. Todos los CTA de mails y redes apuntan acá.

### Datos del evento

- **Fechas:** martes 27 y miércoles 28 de octubre de 2026, de 14 a 21 hs. Acreditación desde las 14, primera charla 14:20.
- **Lugar:** Salón Principal, Edificio Nuevo, FCE UBA, Uriburu 781, CABA. ⚠️ El deck de Canva dice "Salón de Actos"; la planilla dice "Salón Principal". Pendiente de confirmar.
- **Costo:** libre y gratuito, cupos limitados, requiere inscripción.
- **Números:** 1ra edición +1200 personas, 16 speakers (25 y 26 de septiembre de 2025). Meta 2da edición: 2000 personas, +30 speakers confirmados. ⚠️ El deck de sponsors dice +1500 asistentes y +25 speakers; Ro todavía no definió cuáles mostrar.
- **Contacto sponsors:** Tomás Cazalá, tomascazala@economicas.uba.ar.
- **Redes:** IG @senosfuedelasmanos.ok. El podcast SNFM está en YouTube, Spotify, TikTok y Gigared TV.
- **Propiedades sponsoreables de SNFM:** Marketing Fest y el podcast SNFM. GenIA se sacó de la web a pedido de Ro: no mencionarlo.

## Concepto: "La cuadra del Marketing Fest"

La idea de Ro: *el corazón del marketing es la publicidad en la calle, en los celulares, en la ropa*. La web tiene que sentirse como una experiencia del futuro donde ves anuncios en las paredes, los tocás y se abren secciones.

Cómo se resolvió:

- **El hero es una calle.** Un sticky de 100vh donde el scroll vertical se traduce en caminar horizontalmente por una pared llena de anuncios. Hay cielo (iridiscente de día, noche en dark mode), skyline con carteles en las terrazas (parallax 0.25), vereda en perspectiva y un HUD con barra de progreso, el texto "Bienvenido al Marketing Fest. Scrolleá y clickeá lo que te llame la atención." y "Faltan N días". No usar "cuadra" ni "calle" en textos visibles: los botones de cerrar dicen "Volver al evento".
- **Cada anuncio es un formato distinto de publicidad callejera** y abre una sección como takeover: el anuncio se expande con `clip-path` desde su rectángulo hasta pantalla completa, y al cerrar vuelve al anuncio.
- **Futurismo sutil:** retícula amarilla que "fija" el anuncio en hover (solo con pointer fine), tilt 3D, brillo holográfico, textura de papel pegado y animación de "pegado" al cargar (una sola orquestación, no efectos sueltos).
- **Después de la calle:** cuenta regresiva, datos prácticos (cuándo, dónde, cuánto), sponsors, apoyo institucional y footer.

### Recorrido de la pared (orden actual en `.track`)

| # | Anuncio | Formato | Abre |
|---|---|---|---|
| 1 | Tríptico (logo MKT Fest + "Conectá, innová y aprendé." / "2da edición" / "27 y 28 de octubre") | 3 afiches estilo Kaktus, amarillo / negro / rojo | `p-fest` |
| 2 | Pantalla LED en poste | Reel 9:16 que cicla marcas y "Faltan N días" | `p-speakers` |
| 2b | Mosaico de 9 caras + "+30 speakers" | Afiche con fotos en B&N, color en hover | `p-speakers` |
| 3 | "Dos días. 14 a 21 hs." con horarios | Afiche tipo tabla de horarios | `p-crono` |
| 4 | "GRATIS" con tiritas para arrancar | Flyer callejero con tiras, una arrancada | `p-inscripcion` |
| 5 | "¿Y si voy un solo día?" | Afiche cian | `p-faq` |
| 6 | Puerta entreabierta con neón "Detrás de escena", cartel "Solo personal autorizado" y credencial STAFF | Puerta de backstage | `p-organizan` |
| 6b | Fotos pegadas con cinta + "Así se vivió la 1ra edición" | Collage de fotos impresas | `p-ed1` |
| 7 | "Este espacio está libre." con cinta "Disponible" | Cartel en alquiler | `p-sponsors` |
| — | "Fin del recorrido" en stencil + CTA | Pared | `p-inscripcion` |

**Decisión de Ro: el cartel vacío "Este espacio está libre" se queda así.** Le encanta. Es la invitación a sumarse como sponsor. No ponerle logos.

### Paneles (takeovers)

Son `section.panel[role=dialog]`, cada uno con `data-hash` para deep links (`#speakers` abre directo ese panel):

`el-fest` · `speakers` · `cronograma` · `inscripcion` · `primera-edicion` · `preguntas` · `organizan` · `sponsors`

Cada panel tiene su color de fondo plano de la paleta. La regla visual: la calle es lo audaz, los paneles son disciplinados (tipografía grande, listas limpias, sin decoración extra).

## Marca

### SNFM (manual de marca de julio 2025, por Lila Sans)

- **Primarios:** `#F3DA00` amarillo · `#E4E4A8` crema · `#202020` oscuro · `#F2F2F2` claro.
- **Secundarios:** `#F9A900` naranja · `#EB462E` rojo · `#A68ADE` violeta · `#44BDDE` cian · `#2EA866` verde.
- **Tipografía:** **Anton** para títulos (siempre en mayúsculas en la web) y **Quicksand** para el cuerpo (500 a 700). Las dos se cargan de Google Fonts.
- **Logo:** isologo SNFM negro con la mano; en fondos oscuros va invertido (blanco). Está inline como `<symbol id="snfm">`, se usa con `<use href="#snfm">` y en fondos oscuros con la clase `.inv`.
- **Recurso gráfico:** la flecha ↘ del manual está como `<symbol id="arr">` y se usa en todos los CTA.

### Marketing Fest

- **Logo: siempre la versión con la bajada "SEGUNDA EDICIÓN"** (pedido de Ro, según manual de marca): "MARKETING" con la etiqueta naranja "FEST" y abajo "SEGUNDA EDICIÓN". Versión oscura sobre fondos claros (`.mf-l`) y blanca sobre fondos oscuros (`.mf-d`); se usa en la nav, el tríptico y el footer. El archivo que pasó Ro es de 426 px de ancho: si llega una versión más grande o SVG, reemplazar.
- El deck usa naranja `#E85C2E` + teal + amarillo. Las fotos de speakers vienen así: retrato en B&N sobre naranja. Se mantuvo ese look en las fotos.
- Tagline del deck: "Conectá, innová y aprendé."

### Referencias visuales que dio Ro

1. Una landing de conferencia con gradientes iridiscentes, cuenta regresiva y chips de info.
2. La campaña de **Kaktus** (gaseosa de cactus): tríptico en vía pública, bloques planos de dos colores (rosa y verde), tipografía condensada enorme, mucha actitud.

## Tono y copy

- **Español rioplatense con voseo, siempre:** "Inscribite", "Tocá", "Scrolleá", "Mirá", "Reservá tu lugar", "Llegá 13:45 y evitá la fila".
- **Directo, cercano y con humor de calle**, sin solemnidad institucional: "Arrancá una tirita.", "Este espacio está libre.", "Ellos van a estar. ¿Y vos?", "Fin del recorrido", "Pasá sin permiso".
- **Los CTA dicen exactamente qué pasa:** "Inscribite gratis", "Ver cronograma", "Agendar el martes 27", "Escribile a Tomás Cazala".
- **Los errores dicen qué falló y cómo arreglarlo, sin pedir perdón:** "El DNI tiene que tener 7 u 8 números."
- **Sin anglicismos innecesarios**, salvo los propios del rubro (speaker, sponsor, break).
- **Datos de speakers:** se respeta lo que viene de la planilla o del deck, solo con correcciones de tipeo ("Mac donalds" → "McDonald's"). Nunca inventar títulos de charla. Si dice "XXX" o "a definir", se omite.
- **Emilia Vrancic no está confirmada:** no mostrarla en el panel de influencers hasta que Ro avise.
- **Miércoles 14:40 es "Sorpresa"** (en la planilla es José Antonio Stracquadaini): no mostrar su nombre ni su charla hasta que Ro avise.
- **Amé Amor no está confirmada:** se sacó del panel de influencers; no mostrarla hasta que Ro avise.
- **No se anuncian marcas no confirmadas.** Por eso Google, L'Oréal, PedidosYa, Campari y Mercado Libre no aparecen. Rappi entró en la planilla del 9/10 (Tamara Stronguin). Los huecos de agenda se muestran como "Speaker a confirmar".

### Reglas de diseño que se vienen respetando

- Una sola cosa audaz (la calle); el resto, calmo.
- No usar eyebrows en mayúsculas sobre cada título, ni "A · B · C" como relleno, ni sombras grises genéricas tipo kit SaaS.
- Movimiento solo como respuesta a una acción del usuario (abrir, hover, pegar al cargar). `prefers-reduced-motion` respetado.
- Responsive hasta 390px. Dark mode con tokens (`:root`, `prefers-color-scheme`, `[data-theme]`). Foco visible amarillo. Safe areas de iOS (`viewport-fit=cover` + `env(safe-area-inset-*)`).

## Arquitectura técnica

**Assets externos:** `assets/ed1-sala-llena.mp4` (H.264) + `.webm` (VP9, respaldo) + `.jpg` (poster): video vertical de la sala vacía a la sala llena, en `p-ed1`. Se reproduce muteado en loop al abrir el panel (salvo `prefers-reduced-motion`) y se pausa al cerrar.

**Favicon:** el chasquido de SNFM en `favicon.png` (64 px, fondo transparente) y `apple-touch-icon.png` (180 px, fondo amarillo `#F3DA00`), en la raíz junto al `index.html`.

**Hoy es un solo archivo:** `index.html`, de unos 1.8 MB, con HTML, CSS, JS e imágenes en base64. Sin build ni dependencias, solo Google Fonts.

### Datos (al principio del `<script>`)

- **`CONFIG`**: tiene `webhook` y `whatsapp`. ⚠️ **Ambos vacíos.** El formulario muestra la confirmación pero no envía nada hasta que se cargue el webhook de n8n, que dispara el Mail 1 con QR + calendario + comunidad WPP. Si `whatsapp` está vacío, el botón no aparece.
- **`EVENT`**: fecha objetivo de la cuenta regresiva (`2026-10-27T14:00:00-03:00`).
- **`DATA`**: el cronograma completo. Cada ítem es `{d, t, n, c, tp, k, w, ph, pause, tbc}`:
  - `d`: día (1 o 2).
  - `t`: hora.
  - `n`: nombres.
  - `c`: empresa o cargo.
  - `tp`: tema o moderador.
  - `k`: tipo de panel.
  - `w`: palabra de marca de agua cuando no hay foto.
  - `ph`: array de slugs de fotos.
  - `pause`: acreditación, break o cierre.
  - `tbc`: speaker a confirmar.

  De `DATA` salen la grilla de speakers y el cronograma.
- **`PH`**: fotos de speakers en base64 por slug (`catalina-smidt`, `mariano-felix-rica`, etc.). Están recortadas del deck.
- **`GAL`**: fotos de la 1ra edición (`{src, alt, cat}`). Las 5 primeras se usan en el collage de la pared (no cambiar su orden). En `p-ed1` se muestran agrupadas por `cat` en el orden de `GAL_CATS` (Acreditaciones, Charlas, Paneles de IA y marketing, Speakers con su certificado, La gente, Photocall; las vacías no se muestran); para sumar un momento nuevo, agregalo a `GAL_CATS`. Las fotos nuevas van al final, a ~1000 px de ancho en JPEG.
- **`TEAM`**: fotos del equipo para "Detrás de escena" en `p-organizan` (`{src, alt}`); también se muestran las fotos de `GAL` con `team: true`.
- **`LOGOS`**: los logos del apoyo institucional.
- **`SPONSORS`**: los sponsors de esta edición (`{src, alt, url}`).
- **`SPONSORS_ED1`**: los sponsors de la 1ra edición (`{src, alt, url, main}`). Se muestran en `p-sponsors` ("Nos acompañaron en la 1ra edición") y en `p-ed1`. Si `src` está vacío, `logoCell` muestra el nombre en Anton; `main: true` agrega la etiqueta "Main sponsor" (Tiendanube).
- **`COLORS` / `DAYNAME`**: helpers.

### Piezas clave del JS

- **`layout()` / `onScroll()`:** calculan el ancho de la pared, la altura del sticky y el `translate3d` del track, el skyline y la vereda. Se recalculan en resize y cuando cargan las fuentes.
- **`open(id, src)` / `close()`:** takeover con `clip-path` desde el rect del anuncio. Manejan foco, Esc y `history.replaceState` con el hash.
- **Accesibilidad de la calle:** cuando un anuncio recibe foco por teclado, se scrollea para centrarlo. `.scene` usa `overflow: clip` para que el navegador no la desplace sola (era un bug).
- **Retícula, tilt y holo:** solo con `pointer: fine`.
- **Pantalla LED:** `reel()` + `frame()` cada 820 ms, con el tamaño de fuente ajustado según el largo de la palabra.
- **Formulario:** valida nombre y apellido, email, DNI de 7 u 8 dígitos y perfil; si hay `CONFIG.webhook`, hace POST. Guarda en `localStorage` (`mktfest26`) para mostrar "¡Inscripción confirmada!" al volver, y tiene un botón "Inscribir a otra persona".
- **Pre-inscripción (activa hoy):** con `CONFIG.preinscripcion: true` el formulario cambia a "Pre-inscribite": pide nombre, email, WhatsApp, perfil y día (sin DNI) y hace POST a `CONFIG.webhookPre` (`https://n8n.dtcomunicacion.com/webhook/preinscripcion-mkt-fest`). El workflow de n8n "Pre-inscripción MKT Fest 2026" (id `E6dF41wKNW31obCu`) guarda en la data table "Pre-inscripción MKT Fest 2026" (id `d7GBQXcVm9nlEQsh`), sin duplicar por email, con la columna `avisado` en false. Después de responder a la web, también escribe (sin duplicar por Email) en el Google Sheet "Pre-inscripción Marketing Fest 2026" (id `1Y0BM4c904CzP39UAmYkIgErZsOKoPjnkcfR2w2ZQYo4`, pestaña "Untitled", columnas Fecha, Nombre, Email, WhatsApp, Perfil, Día, Avisado) con la credencial "Sheets DT". Si el Sheet falla, la inscripción igual queda guardada en la data table. Los CTA "Inscribite" pasan a "Pre-inscribite" por JS. Guarda en `localStorage` con la clave `mktfest26-pre`. Cuando abra la oficial: `preinscripcion: false`, cargar `webhook` y avisar a la lista.
- **Google Calendar:** links por día, 14 a 21 hs ART.

## Pendientes y cosas a confirmar con Ro

1. **Cargar `CONFIG.webhook` y `CONFIG.whatsapp`** para la inscripción oficial. Es bloqueante para el lanzamiento real. Mientras tanto corre la pre-inscripción; al abrir la oficial hay que avisar a todos los de la data table de pre-inscripción (mail + WhatsApp) y marcar `avisado`.
2. **Sponsors de la 1ra edición:** cargados en `SPONSORS_ED1` (Tiendanube como main, Heineken 0.0, Gigared, DT Comunicación, Doble Dosis, FlashTag, Óptica Lof, Prometheo y Mikhuna Nikkei; 9 marcas). Falta el archivo del logo de Mikhuna: hoy se muestra como texto.
3. **Speakers a confirmar:** martes 15:00 (la planilla dice "Luciana Danduono o Julieta Skilki", Laboratorio de Bikinis / Azania, charla "Del Moodboard al Mercado"; sigue como "?" hasta que se defina quién). También falta un invitado del panel gamer, el acompañante de Norman Ventre (Bayer, "a definir con quién") y los títulos de Norman, el panel de influencers, Fernanda Rivera, Tamara Stronguin y Sabrina Kolod.
4. **Fotos que faltan:** Natalia Landa, Norman Ventre, Solana Epstein, Juan Pablo Brea, Tamara Stronguin, Agustín Arias y los moderadores.
5. **Discrepancias entre deck y planilla:**
   - el nombre del salón;
   - el horario del panel gamer: el deck dice 19:00, se usa 17:10 de la planilla;
   - el cargo de Mariano Félix Rica;
   - los números (+1500 / +25 contra 2000 / +30).
6. **El link de FlashTag** para su logo de sponsor.
7. **Títulos de charla "a definir":** Marcelo Romeo, el panel Abadi/Dubiansky, Sabrina Kolod, Fernanda Rivera y Tomás Cazalá.
8. **Precios de sponsorship:** están en el deck (Silver USD 1.500, Gold 2.500, Platinum 5.000, podcast 2.000, main 6.000). Se decidió **no** mostrarlos en la web pública salvo que Ro lo pida.

## Próximos pasos técnicos sugeridos

- **Separar assets:** pasar imágenes de base64 a `/assets` (webp) y datos a `data.js` o JSON. Eso baja el HTML de 1.8 MB a menos de 100 KB y facilita editar speakers.
- **Deploy en Vercel** como sitio estático. Dominio sugerido en el plan: `marketingfest.fce.uba.ar`, a definir.
- **QR personal en el Mail 1:** lo arma el flujo de n8n, no la web.
- **Metadatos para compartir:** `og:image` (afiche del tríptico) y metadatos para WhatsApp e IG.
- **Analytics** para medir lo que pide el plan: clicks en inscripción, calendario y WPP.

## Checklist antes de cada entrega

- Probar desktop 1440×900 y mobile 390×844: caminar la cuadra, abrir y cerrar cada panel, y navegar con teclado (Tab sobre los anuncios no debe descuadrar la escena).
- Probar dark mode.
- Mandar el formulario con y sin webhook.
- Que no aparezca ninguna marca no confirmada.
- Que todo el copy esté en voseo.
