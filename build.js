/* ==========================================================================
   Genera las páginas de la web a partir de data.js.
   Uso: node build.js   (después de editar data.js o este archivo)
   Cada página es un HTML estático con su propio título y descripción, para SEO.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8') +
  '\nObject.assign(this,{CONFIG,MANU,EPISODES,REELS,DATA,PH,GAL2,GAL,GAL_CATS,TEAM,MF_LOGO,MAIN_SPONSORS,SPONSORS,MEDIA,LOGOS,SPONSORS_ED1});', ctx);
const { CONFIG, MANU, EPISODES, REELS, DATA, PH, GAL2, GAL, GAL_CATS, TEAM, MF_LOGO, MAIN_SPONSORS, SPONSORS, MEDIA, LOGOS, SPONSORS_ED1 } = ctx;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ext = 'target="_blank" rel="noopener"';

/* ---------- páginas ---------- */
const PAGES = {
  home:   { file: 'index.html' },
  podcast:{ file: 'podcast/index.html' },
  fest:   { file: 'marketing-fest/index.html' },
  f2026:  { file: 'marketing-fest/2026/index.html' },
  f2025:  { file: 'marketing-fest/2025/index.html' },
  servicios:{ file: 'servicios/index.html' },
  calle:  { file: 'servicios/contenido-en-la-calle/index.html' },
  videos: { file: 'servicios/videos-y-ugc/index.html' },
  eventos:{ file: 'servicios/eventos/index.html' },
};
const dirOf = k => path.posix.dirname(PAGES[k].file);
/* link relativo de una página a otra (o a un archivo), para que funcione en cualquier hosting */
function rel(from, to) {
  const target = PAGES[to] ? (dirOf(to) === '.' ? '' : dirOf(to) + '/') : to;
  const up = dirOf(from) === '.' ? '' : '../'.repeat(dirOf(from).split('/').length);
  return (up + target) || './';
}
const urlOf = k => CONFIG.site ? CONFIG.site.replace(/\/$/, '') + '/' + (dirOf(k) === '.' ? '' : dirOf(k) + '/') : '';

/* ---------- piezas comunes ---------- */
const icon = (P, id, cls = '', label = '') => `<svg${cls ? ` class="${cls}"` : ''} ${label ? `aria-label="${label}" role="img"` : 'aria-hidden="true"'}><use href="${P('assets/icons.svg')}#${id}"/></svg>`;
const av = P => (MANU.avatar || MANU.img) ? `<span class="av" aria-hidden="true"><img src="${P(MANU.avatar || MANU.img)}" alt=""></span>` : '<span class="av" aria-hidden="true">M</span>';
const says = (P, text) => `<div class="says">${av(P)}<p><b>Manu</b>${text}</p></div>`;
const wa = (P, label, cls = 'cta') => `<a class="${cls}" href="${esc(CONFIG.whatsapp)}" ${ext} data-wa>${label} ${icon(P, 'arr')}</a>`;

function nav(k, P) {
  const a = (to, label) => `<a href="${rel(k, to)}"${k === to ? ' aria-current="page"' : ''}>${label}</a>`;
  const festOn = ['fest', 'f2026', 'f2025'].includes(k);
  const svcOn = ['servicios', 'calle', 'videos', 'eventos'].includes(k);
  return `<header class="nav">
  <div class="wrap">
    <a class="home" href="${rel(k, 'home')}" aria-label="Se Nos Fue de las Manos, inicio">${icon(P, 'snfm', 'inv')}</a>
    <nav class="nav-links" aria-label="Secciones">
      ${a('podcast', 'Podcast')}
      <div class="dd">
        <a href="${rel(k, 'fest')}"${festOn ? ' aria-current="page"' : ''}>Marketing Fest</a>
        <div class="dd-menu">
          <a href="${rel(k, 'f2026')}">2da edición<small>27 y 28 de octubre de 2026</small></a>
          <a href="${rel(k, 'f2025')}">1ra edición<small>25 y 26 de septiembre de 2025</small></a>
        </div>
      </div>
      <div class="dd">
        <a href="${rel(k, 'servicios')}"${svcOn ? ' aria-current="page"' : ''}>Servicios</a>
        <div class="dd-menu">
          <a href="${rel(k, 'calle')}">Contenido en la calle<small>Preguntas y dinámicas con la gente</small></a>
          <a href="${rel(k, 'videos')}">Videos y UGC<small>Con nosotros o tu equipo como cara</small></a>
          <a href="${rel(k, 'eventos')}">Eventos<small>Como el Marketing Fest</small></a>
        </div>
      </div>
    </nav>
    <a class="cta" href="${esc(CONFIG.whatsapp)}" ${ext} data-wa>Hablemos</a>
  </div>
</header>`;
}

function crumbs(k, items) {
  return `<ol class="crumbs" aria-label="Estás en">${items.map(([to, label]) => to ? `<li><a href="${rel(k, to)}">${label}</a></li>` : `<li aria-current="page">${label}</li>`).join('')}</ol>`;
}

function band(k, P, text = 'Contenido en la calle, videos y UGC, eventos o tu marca en el podcast o en el próximo Marketing Fest. Contanos qué tenés en mente.') {
  return `<section class="band s-y" aria-labelledby="t-hab">
  <div class="wrap talk-to">
    <div class="ch-head" style="margin:0">
      <h2 id="t-hab">¿Tenés una marca? Hablemos.</h2>
      <p class="lead">${text}</p>
    </div>
    <div>
      <a class="wa" href="${esc(CONFIG.whatsapp)}" ${ext} data-wa>
        ${icon(P, 'wa', 'w')}
        <div><strong>Escribile a Ro</strong><span>Por WhatsApp, al 11 5134-1115</span></div>
      </a>
      <p class="also">O seguinos en <a href="${CONFIG.instagram}" ${ext}>@senosfuedelasmanos.ok</a>.</p>
    </div>
  </div>
</section>`;
}

function qa(k) {
  return [
    { q: '¿Dónde bajo las presentaciones del Fest?', a: `Están en <a href="${rel(k, 'f2026')}#descargas">la página de la 2da edición</a>, separadas por día. Tocá "Descargar PDF" en la charla que quieras.` },
    { q: '¿Dónde veo el podcast?', a: `En nuestro <a href="${CONFIG.youtube}" ${ext}>canal de YouTube</a>. Si no sabés por cuál arrancar, andá por el de Con el Kora o el de McDonald's. Están todos en <a href="${rel(k, 'podcast')}">la página del podcast</a>.` },
    { q: 'Tengo una marca, ¿qué pueden hacer conmigo?', a: `Mirá <a href="${rel(k, 'servicios')}">nuestros servicios</a>: <a href="${rel(k, 'calle')}">Contenido en la calle</a>, <a href="${rel(k, 'videos')}">videos y UGC</a> con nosotros o alguien de tu equipo como cara, <a href="${rel(k, 'eventos')}">eventos</a> como el Marketing Fest y tu marca en el podcast.` },
    { q: '¿Cuánto sale?', a: `Depende de la idea. Escribile a Ro por <a href="${esc(CONFIG.whatsapp)}" ${ext}>WhatsApp</a>, contale qué tenés en mente y te pasa una propuesta.` },
    { q: '¿Quién sos?', a: 'Soy Manu, el vocero con IA de Se Nos Fue de las Manos. Te ayudo a encontrar lo que buscás en la web. Para algo más, te paso con el equipo.' },
  ];
}

function layout(k, { title, description, image, body, jsonld = [], extraHead = '' }) {
  const P = f => rel(k, f);
  const url = urlOf(k);
  const img = image || 'assets/img/ed1/01.jpg';
  const imgUrl = CONFIG.site ? CONFIG.site.replace(/\/$/, '') + '/' + img : P(img);
  const ld = [{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Se Nos Fue de las Manos', alternateName: 'SNFM', description: 'Docentes, ayudantes y estudiantes de la UBA que enseñan marketing fuera del aula: podcast con gerentes de marketing de marcas referentes y el Marketing Fest, libre y gratuito.', ...(CONFIG.site ? { url: urlOf('home') } : {}), sameAs: [CONFIG.youtube, CONFIG.instagram] }, ...jsonld];
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5Z65GSRG');</script>
<!-- End Google Tag Manager -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${url ? `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="Se Nos Fue de las Manos">
<meta property="og:locale" content="es_AR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${imgUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#202020">
<link rel="icon" type="image/png" href="${P('favicon.png')}">
<link rel="apple-touch-icon" href="${P('apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${P('assets/site.css')}">
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
${extraHead}</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5Z65GSRG"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
${nav(k, P)}

<main>
${body}
</main>

<footer class="foot">
  <div class="wrap">
    ${icon(P, 'snfm', 'logo inv', 'Se Nos Fue de las Manos')}
    <p>El Marketing Fest lo organizan Se Nos Fue de las Manos, Tomás Cazalá, el cuerpo docente de Marketing Digital, el Centro de Estudiantes, la Secretaría de Graduados y la FCE UBA.</p>
    <nav aria-label="Más">
      <a href="${rel(k, 'podcast')}">Podcast</a>
      <a href="${rel(k, 'fest')}">Marketing Fest</a>
      <a href="${rel(k, 'servicios')}">Servicios</a>
      <a href="${CONFIG.youtube}" ${ext}>YouTube</a>
      <a href="${CONFIG.instagram}" ${ext}>Instagram</a>
    </nav>
  </div>
</footer>

<button class="ask-fab" data-ask aria-haspopup="dialog">${av(P)}Preguntale a Manu</button>
<dialog class="chat" id="chat" aria-labelledby="chat-t">
  <div class="chat-h">
    ${av(P)}
    <div><b id="chat-t">Manu</b><small>Vocero con IA de SNFM</small></div>
    <button data-close aria-label="Cerrar">×</button>
  </div>
  <div class="chat-log" id="chat-log" aria-live="polite"></div>
  <div class="chat-q" id="chat-q"></div>
</dialog>
<script>window.QA=${JSON.stringify(qa(k))};</script>
<script src="${P('assets/site.js')}" defer></script>
</body>
</html>
`;
}

/* ---------- bloques de contenido ---------- */
const ytUrl = e => e.id ? `https://youtu.be/${e.id}` : CONFIG.youtube;
function epCard(P, e, big) {
  const alt = `<span class="alt"><strong>${esc(e.t)}</strong><span>${esc(e.g)}</span></span>`;
  const th = e.id
    ? `<div class="thumb"><img src="https://i.ytimg.com/vi/${e.id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.parentNode.classList.add('nothumb')">${alt}<span class="n">#${e.n}</span></div>`
    : `<div class="thumb nothumb">${alt}<span class="n">#${e.n}</span></div>`;
  return `<a class="ep" href="${ytUrl(e)}" ${ext} data-ep="${e.n}">
  ${th}
  ${big && e.fest ? '<span class="badge">También en el Marketing Fest 2026</span>' : ''}
  <h3>${esc(e.t)}</h3>
  <p>${esc(e.g)} · ${esc(e.b)}</p>
  <span class="go">${e.id ? 'Ver el capítulo' : 'Ver en el canal'} ${icon(P, 'arr')}</span>
</a>`;
}
const hotEps = P => EPISODES.filter(e => e.hot).sort((a, b) => !!b.fest - !!a.fest).map(e => epCard(P, e, true)).join('\n');

function logoRow(P, list, cls = '') {
  return `<div class="logo-row${cls ? ' ' + cls : ''}">${list.map(s => {
    const inner = `${s.main ? '<span class="tag">Main sponsor</span>' : ''}${s.src ? `<img src="${P(s.src)}" alt="${esc(s.alt)}" loading="lazy">` : `<span class="wm">${esc(s.alt)}</span>`}`;
    return s.url ? `<a href="${s.url}" ${ext}>${inner}</a>` : `<div>${inner}</div>`;
  }).join('')}</div>`;
}

function gallery(P, list) {
  return `<div class="gal">${list.map(g => `<figure><img src="${P(g.src)}" alt="${esc(g.alt)}" loading="lazy"${g.pos ? ` style="object-position:${g.pos}"` : ''}><a class="get" href="${P(g.src)}" download aria-label="Descargar foto: ${esc(g.alt)}">Descargar ${icon(P, 'arr')}</a></figure>`).join('')}</div>`;
}

const mb = b => b >= 1e6 ? `${Math.round(b / 1e6)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;
function talkRow(P, r) {
  if (r.pause) return `<li class="talk pause"><time>${r.t}</time><span>${esc(r.n)} · ${esc(r.c)}</span></li>`;
  const faces = (r.ph || []).filter(s => PH[s]).map(s => `<img src="${P(PH[s])}" alt="" loading="lazy">`).join('');
  let act = '';
  if (r.dl) {
    const size = fs.existsSync(path.join(ROOT, r.dl)) ? ' · ' + mb(fs.statSync(path.join(ROOT, r.dl)).size) : '';
    act += `<a class="pdf" href="${P(r.dl)}" download data-dl="${esc(r.n)}">Descargar PDF${size} ${icon(P, 'arr')}</a>`;
  } else if (r.pend) act += '<span class="soon">La presentación llega pronto</span>';
  (r.ep || []).map(n => EPISODES.find(e => e.n === n)).filter(Boolean)
    .forEach(e => act += `<a class="yt" href="${ytUrl(e)}" ${ext}>Podcast #${e.n} ${icon(P, 'arr')}</a>`);
  return `<li class="talk"><time>${r.t}</time><div class="faces">${faces}</div>
    <div class="talk-t">${r.k ? `<span class="k">${esc(r.k)}</span>` : ''}<strong>${esc(r.n)}</strong><span>${esc(r.c)}</span>${r.tp ? `<em>${esc(r.tp)}</em>` : ''}</div>
    <div class="talk-a">${act}</div></li>`;
}

function pageHero(k, P, { num, h1, lead, say, trail, yellow, extra = '' }) {
  return `<section class="page-hero${yellow ? ' s-y' : ''}">
  <div class="wrap">
    ${crumbs(k, trail)}
    ${num ? `<p class="num">${num}</p>` : ''}
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
    ${say ? says(P, say) : ''}
    ${extra}
  </div>
</section>`;
}

const reelBox = id => `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/${id}/" data-instgrm-version="14"></blockquote>
  <a class="ig-fallback" href="https://www.instagram.com/reel/${id}/" ${ext}><strong>Ver el reel</strong><span>Se abre en Instagram</span></a>`;

const nTalks = DATA.filter(r => !r.pause).length;
const festEvent = (k, name, start, end, desc) => ({
  '@context': 'https://schema.org', '@type': 'Event', name, startDate: start, endDate: end, description: desc,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', isAccessibleForFree: true,
  location: { '@type': 'Place', name: 'Facultad de Ciencias Económicas, UBA', address: { '@type': 'PostalAddress', streetAddress: 'Uriburu 781', addressLocality: 'Ciudad Autónoma de Buenos Aires', addressCountry: 'AR' } },
  organizer: { '@type': 'Organization', name: 'Se Nos Fue de las Manos' },
  ...(CONFIG.site ? { url: urlOf(k) } : {}),
});

/* ---------- contenido de cada página ---------- */
const BUILD = {
  home(k, P) {
    const manuMedia = MANU.video
      ? `<video src="${P(MANU.video)}" ${MANU.poster ? `poster="${P(MANU.poster)}"` : ''} muted loop playsinline autoplay aria-label="Manu se presenta"></video><button class="manu-sound" aria-pressed="false">Activar sonido</button>`
      : MANU.img ? `<img class="manu-img" src="${P(MANU.img)}" alt="Manu, una mano ilustrada con gorra y zapatillas, que muestra un celular y señala" width="900" height="900">` : '';
    const card = (to, num, h, p, go) => `<a class="card" href="${rel(k, to)}"><div><span class="num">${num}</span><h3>${h}</h3><p>${p}</p></div><span class="go">${go} ${icon(P, 'arr')}</span></a>`;
    return layout(k, {
      title: 'Se Nos Fue de las Manos · Podcast de marketing, Marketing Fest y contenido para marcas',
      description: 'Docentes, ayudantes y estudiantes de la UBA que enseñamos marketing fuera del aula: un podcast con gerentes de marcas referentes, el Marketing Fest libre y gratuito y contenido para marcas. Descargá las presentaciones del Marketing Fest 2026.',
      body: `<section class="hero" aria-labelledby="t-hero">
  <div class="wrap">
    <div>
      <p class="num">#00</p>
      <h1 id="t-hero"><span>Se nos fue</span><span>de las manos</span></h1>
      <p class="lead">Somos docentes, ayudantes y estudiantes de la UBA que enseñamos marketing desde otro lado: fuera del aula, en la cocina de cada marca.</p>
      <ul class="chips" aria-label="En números">
        <li><b>${EPISODES.length}</b>capítulos del podcast</li>
        <li><b>2</b>ediciones del Marketing Fest</li>
        <li><b>+1200</b>personas en la 1ra</li>
        <li><b>+30</b>speakers en la 2da</li>
      </ul>
      <div class="btns">
        <a class="cta" href="${rel(k, 'f2026')}#descargas">Descargá las presentaciones ${icon(P, 'arr')}</a>
        <a class="ghost" href="${rel(k, 'podcast')}">Mirá el podcast</a>
      </div>
    </div>
    <figure class="manu" aria-label="Manu, el vocero con IA de Se Nos Fue de las Manos">
      <div class="manu-frame">
        ${manuMedia || '<div class="manu-mono" aria-hidden="true"><span>M</span></div>'}
        <span class="manu-tag"><i aria-hidden="true"></i>Manu · vocero con IA</span>
      </div>
      <figcaption class="manu-bubble typing">
        <b>Hola, soy Manu</b>
        <p>Soy el vocero con IA de Se Nos Fue de las Manos. Te muestro todo: el podcast, el Marketing Fest y lo que podemos hacer con tu marca.</p>
        <button class="ghost ask" data-ask>Preguntame algo</button>
      </figcaption>
    </figure>
  </div>
</section>

<section class="ch" aria-labelledby="t-quienes">
  <div class="wrap about">
    <h2 id="t-quienes">Salimos del aula</h2>
    <div>
      <p class="lead">En Se Nos Fue de las Manos somos docentes, ayudantes y estudiantes de la UBA con ganas de enseñar desde otro lado. Salimos del aula para ver la verdad de cada empresa: lo que pasa detrás, la cocina del marketing.</p>
      <p class="lead">Por eso hacemos el <a href="${rel(k, 'podcast')}">podcast</a>, donde charlamos con gerentes de marketing de marcas referentes, y el <a href="${rel(k, 'fest')}">Marketing Fest</a>, un evento abierto a todo el mundo para democratizar el conocimiento: que no tengas que pagar una fortuna para ver a los capos del rubro contar lo que hacen bien y entender cómo hacer crecer tu negocio o tu carrera.</p>
    </div>
  </div>
</section>

<section class="ch" aria-labelledby="t-que" style="padding-top:0">
  <div class="wrap">
    <div class="ch-head">
      <h2 id="t-que">Qué hacemos</h2>
      ${says(P, 'Elegí por dónde arrancar. Si sos una marca, mirá nuestros servicios.')}
    </div>
    <div class="cards">
      ${card('podcast', '#01', 'El podcast', `${EPISODES.length} capítulos con los que están detrás de McDonald's, CCU, Pepsico, Logitech y más.`, 'Ver los capítulos')}
      ${card('fest', '#02', 'Marketing Fest', 'El evento de marketing más grande de la FCE UBA. Ya van dos ediciones.', 'Conocé el Fest')}
      ${card('servicios', '#03', 'Nuestros servicios', 'Contenido en la calle, videos y UGC y eventos para tu marca.', 'Ver los servicios')}
    </div>
  </div>
</section>

<section class="ch s-ink" aria-labelledby="t-hot">
  <div class="wrap">
    <div class="ch-head">
      <h2 id="t-hot">Para arrancar el podcast</h2>
      <div class="says">${av(P)}<p><b>Manu</b>Si tenés 40 minutos, mirá estos dos. Los de Con el Kora también pasaron por el Fest.</p></div>
    </div>
    <div class="hot">${hotEps(P)}</div>
    <div class="btns"><a class="cta" href="${rel(k, 'podcast')}">Ver todos los capítulos ${icon(P, 'arr')}</a></div>
  </div>
</section>
${band(k, P)}`,
      /* links viejos de la landing del Fest (mails y redes) */
      extraHead: `<script>(function(){var m={inscripcion:'descargas','el-fest':'',speakers:'descargas',cronograma:'descargas',preguntas:'',sponsors:'gracias'},h=location.hash.slice(1);
if(h in m){location.replace('${rel(k, 'f2026')}'+(m[h]?'#'+m[h]:''));}else if(h==='primera-edicion'){location.replace('${rel(k, 'f2025')}');}else if(h==='organizan'){location.replace('${rel(k, 'eventos')}');}})();</script>\n`,
    });
  },

  podcast(k, P) {
    return layout(k, {
      title: 'Podcast de marketing · Se Nos Fue de las Manos',
      description: `${EPISODES.length} capítulos con los que hacen marketing en McDonald's, CCU, Pepsico, Logitech, Kia, Calm y más. Mirá el podcast de Se Nos Fue de las Manos en YouTube.`,
      image: EPISODES.find(e => e.hot && e.id) ? `https://i.ytimg.com/vi/${EPISODES.find(e => e.hot && e.id).id}/hqdefault.jpg` : undefined,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'PodcastSeries', name: 'Se Nos Fue de las Manos', inLanguage: 'es-AR', url: CONFIG.youtube, description: 'El canal donde el marketing se convierte en experiencias reales. Entrevistas a referentes, gerentes de marketing, creativos y docentes.' }],
      body: `${pageHero(k, P, {
        num: '#01', h1: 'El podcast', trail: [['home', 'Inicio'], [null, 'Podcast']],
        lead: 'Charlamos con gerentes de marketing de marcas referentes para ver lo que no se ve desde el aula: el verdadero detrás de cada empresa, la cocina del marketing. Lo hacemos junto a Tomás Cazalá y un equipo de docentes, ayudantes y estudiantes de la UBA.',
        say: 'Si tenés 40 minutos, arrancá por estos dos. Los de Con el Kora también pasaron por el Fest.',
        extra: `<div class="btns"><a class="cta" href="${CONFIG.youtube}" ${ext}>Ver el canal en YouTube ${icon(P, 'arr')}</a></div>`,
      })}
<section class="ch" aria-labelledby="t-eps">
  <div class="wrap">
    <h2 class="sr" id="t-eps">Capítulos</h2>
    <div class="hot">${hotEps(P)}</div>
    <div class="eps">${EPISODES.filter(e => !e.hot).map(e => epCard(P, e, false)).join('\n')}</div>
    <div class="pod-foot">
      <p>Todos los capítulos están en YouTube. También nos escuchás en Spotify, TikTok y Gigared TV.</p>
      <a class="cta" href="${CONFIG.youtube}" ${ext}>Suscribite en YouTube ${icon(P, 'arr')}</a>
    </div>
  </div>
</section>
${band(k, P, '¿Querés que tu marca esté en el podcast? También hacemos contenido en la calle, videos, UGC y eventos.')}`,
    });
  },

  fest(k, P) {
    return layout(k, {
      title: 'Marketing Fest · El evento de marketing de la FCE UBA',
      description: 'El Marketing Fest es el evento de marketing más grande de la Facultad de Ciencias Económicas de la UBA. Mirá cómo fueron la 1ra edición (2025) y la 2da (2026) y descargá las presentaciones.',
      body: `${pageHero(k, P, {
        num: '#02', h1: 'Marketing Fest', trail: [['home', 'Inicio'], [null, 'Marketing Fest']],
        lead: 'El evento de marketing más grande de la Facultad de Ciencias Económicas de la UBA, abierto a todo el mundo, libre y gratuito. Lo hacemos para democratizar el conocimiento: que no tengas que pagar una fortuna para ver a los capos del rubro contar lo que hacen bien y entender cómo hacer crecer tu negocio o tu carrera profesional.',
        say: 'Ya van dos ediciones. Elegí cuál querés ver.',
        extra: `<img class="mf-logo" style="margin-top:2rem" src="${P(MF_LOGO.dark)}" alt="Marketing Fest, segunda edición">`,
      })}
<section class="ch" aria-labelledby="t-eds">
  <div class="wrap">
    <h2 class="sr" id="t-eds">Ediciones</h2>
    <div class="cards two">
      <a class="card" href="${rel(k, 'f2026')}"><div><span class="num">27 y 28 de octubre de 2026</span><h3>2da edición</h3><p>Meta, McDonald's, Pepsico, Rappi, CCU, Tiendanube y más. Las presentaciones están para descargar.</p>
        <div class="mini"><div><b>+30</b><span>speakers</span></div><div><b>${nTalks}</b><span>charlas y paneles</span></div></div></div>
        <span class="go">Ver la 2da edición ${icon(P, 'arr')}</span></a>
      <a class="card" href="${rel(k, 'f2025')}"><div><span class="num">25 y 26 de septiembre de 2025</span><h3>1ra edición</h3><p>Donde empezó todo: el salón lleno y una fila que daba la vuelta.</p>
        <div class="mini"><div><b>+1200</b><span>personas</span></div><div><b>16</b><span>speakers</span></div></div></div>
        <span class="go">Ver la 1ra edición ${icon(P, 'arr')}</span></a>
    </div>
    <div class="thanks">
      <div><p class="label">Con el apoyo institucional de</p>${logoRow(P, LOGOS)}</div>
    </div>
  </div>
</section>
${band(k, P, '¿Querés sumar tu marca al próximo Marketing Fest u organizar un evento propio? Escribinos.')}`,
    });
  },

  f2026(k, P) {
    const day = d => DATA.filter(r => r.d === d).map(r => talkRow(P, r)).join('\n');
    const dls = DATA.filter(r => r.dl).length;
    return layout(k, {
      title: 'Marketing Fest 2026 · 2da edición: presentaciones para descargar',
      description: `Así fue la 2da edición del Marketing Fest en la FCE UBA, el 27 y 28 de octubre de 2026. Descargá en PDF las presentaciones de McDonald's, Tiendanube, Agens, Go For y más.`,
      jsonld: [festEvent(k, 'Marketing Fest 2026 · 2da edición', '2026-10-27T14:00:00-03:00', '2026-10-28T21:00:00-03:00', 'Dos días de charlas y paneles de marketing en la FCE UBA, libres y gratuitos.')],
      body: `${pageHero(k, P, {
        num: '27 y 28 de octubre de 2026', h1: 'Marketing Fest 2026', trail: [['home', 'Inicio'], ['fest', 'Marketing Fest'], [null, '2da edición']],
        lead: 'El 27 y 28 de octubre de 2026 la FCE UBA fue el lugar del marketing. Dos días de charlas y paneles con Meta, McDonald\'s, Pepsico, Rappi, CCU, Tiendanube, Bayer, Logitech y muchas más. Gracias por venir.',
        extra: `<img class="mf-logo" style="margin-top:2rem" src="${P(MF_LOGO.dark)}" alt="Marketing Fest, segunda edición">`,
      })}
<section class="ch s-ink" aria-labelledby="t-dl" style="padding-top:0">
  <div class="wrap">
    <dl class="facts">
      <div><dt>2</dt><dd>días, de 14 a 21 hs</dd></div>
      <div><dt>+30</dt><dd>speakers</dd></div>
      <div><dt>${nTalks}</dt><dd>charlas y paneles</dd></div>
      <div><dt>${dls}</dt><dd>presentaciones para descargar</dd></div>
    </dl>
    <div class="dl-head" id="descargas">
      <div>
        <h2 id="t-dl" style="font-size:clamp(2.4rem,6vw,4.4rem);color:var(--y)">Las presentaciones</h2>
        <div style="margin-top:1rem">${says(P, 'Bajalas en PDF. Las que faltan las subimos apenas nos lleguen.').replace('class="says"', 'class="says" style="margin:0"')}</div>
      </div>
      <div class="tabs" role="tablist" aria-label="Día">
        <button role="tab" id="tab-1" aria-controls="day-1" aria-selected="true">Martes 27</button>
        <button role="tab" id="tab-2" aria-controls="day-2" aria-selected="false" tabindex="-1">Miércoles 28</button>
      </div>
    </div>
    <ul class="talks" id="day-1" role="tabpanel" aria-labelledby="tab-1">${day(1)}</ul>
    <ul class="talks" id="day-2" role="tabpanel" aria-labelledby="tab-2">${day(2)}</ul>
    ${GAL2.length ? `<div class="dl-head" id="fotos"><h2 style="font-size:clamp(2.4rem,6vw,4.4rem);color:var(--y)">Las fotos</h2></div>${gallery(P, GAL2)}` : ''}
    <div class="thanks" id="gracias">
      <h2 style="font-size:clamp(1.8rem,4vw,2.6rem)">Gracias a las marcas que lo hicieron posible</h2>
      <div><p class="label">Main sponsors</p>${logoRow(P, MAIN_SPONSORS, 'main')}</div>
      <div><p class="label">Sponsors</p>${logoRow(P, SPONSORS)}</div>
      <div><p class="label">Media partners</p>${logoRow(P, MEDIA)}</div>
      <div><p class="label">Con el apoyo institucional de</p>${logoRow(P, LOGOS)}</div>
    </div>
    <div class="next-links">
      <a class="ghost" href="${rel(k, 'f2025')}">Mirá cómo fue la 1ra edición</a>
      <a class="ghost" href="${rel(k, 'podcast')}">Escuchá a los speakers en el podcast</a>
    </div>
  </div>
</section>
${band(k, P, '¿Querés sumar tu marca a la 3ra edición del Marketing Fest u organizar un evento propio? Escribinos.')}`,
    });
  },

  f2025(k, P) {
    const cats = GAL_CATS.map(c => [c, GAL.filter(g => g.cat === c)]).filter(([, l]) => l.length);
    return layout(k, {
      title: 'Marketing Fest 2025 · Así fue la 1ra edición en la FCE UBA',
      description: 'El 25 y 26 de septiembre de 2025 hicimos el primer Marketing Fest en la FCE UBA: más de 1200 personas y 16 speakers. Mirá el video, las fotos y las marcas que nos acompañaron.',
      image: GAL[0].src,
      jsonld: [festEvent(k, 'Marketing Fest 2025 · 1ra edición', '2025-09-25', '2025-09-26', 'La primera edición del Marketing Fest en la FCE UBA: más de 1200 personas y 16 speakers.')],
      body: `${pageHero(k, P, {
        num: '25 y 26 de septiembre de 2025', h1: 'Donde empezó todo', trail: [['home', 'Inicio'], ['fest', 'Marketing Fest'], [null, '1ra edición']],
        lead: 'El 25 y 26 de septiembre de 2025 hicimos el primer Marketing Fest en la FCE UBA. Vinieron más de 1200 personas, pasaron 16 speakers por el escenario y no quedó una silla libre.',
        say: 'Las fotos se pueden descargar. Si estás en alguna, es tuya.',
      })}
<section class="ch" aria-labelledby="t-e1">
  <div class="wrap">
    <h2 class="sr" id="t-e1">La 1ra edición</h2>
    <div class="ed1">
      <figure style="margin:0">
        <video poster="${P('assets/ed1-sala-llena.jpg')}" muted loop playsinline controls preload="none" aria-label="La sala vacía antes de arrancar y después llena, con una charla en vivo"><source src="${P('assets/ed1-sala-llena.mp4')}" type="video/mp4"><source src="${P('assets/ed1-sala-llena.webm')}" type="video/webm"></video>
        <figcaption>De la sala vacía a la sala llena, en un rato.</figcaption>
      </figure>
      <div>
        <div class="stats">
          <div><b>+1200</b><span>personas</span></div>
          <div><b>16</b><span>speakers</span></div>
          <div><b>2</b><span>días</span></div>
        </div>
        ${cats.map(([c, l]) => `<h3 class="gal-cat">${esc(c)}</h3>${gallery(P, l)}`).join('\n')}
        <h3 class="gal-cat">El equipo</h3>
        ${gallery(P, TEAM)}
        <p class="label" style="margin-top:2.5rem">Nos acompañaron</p>
        ${logoRow(P, SPONSORS_ED1)}
        <div class="next-links"><a class="ghost" href="${rel(k, 'f2026')}">Mirá cómo fue la 2da edición</a></div>
      </div>
    </div>
  </div>
</section>
${band(k, P, '¿Querés sumar tu marca a la 3ra edición del Marketing Fest u organizar un evento propio? Escribinos.')}`,
    });
  },

  servicios(k, P) {
    const svc = (to, num, h, p, items) => `<article class="svc-row">
      <span class="num">${num}</span>
      <div><h2>${h}</h2><p class="lead">${p}</p><ul>${items.map(i => `<li>${icon(P, 'arr')}${i}</li>`).join('')}</ul></div>
      <a class="cta" href="${rel(k, to)}">Ver más info ${icon(P, 'arr')}</a>
    </article>`;
    return layout(k, {
      title: 'Servicios para marcas · Se Nos Fue de las Manos',
      description: 'Contenido de marca en la calle, producción de videos y UGC, y organización de eventos. Lo que Se Nos Fue de las Manos puede hacer con tu marca.',
      body: `${pageHero(k, P, {
        yellow: true, num: 'Para marcas', h1: 'Nuestros servicios', trail: [['home', 'Inicio'], [null, 'Servicios']],
        lead: 'Lo que aprendimos haciendo el podcast y el Marketing Fest, puesto al servicio de tu marca. Elegí uno o combinalos.',
        say: 'Tocá "Ver más info" en el que te interese y te cuento todo.',
      })}
<section class="ch" aria-label="Servicios">
  <div class="wrap svc-list">
    ${svc('calle', '01', 'Contenido en la calle', 'Preguntas a la gente, dinámicas y desafíos en la vía pública, con tu marca en el centro.', ['Reels listos para Instagram y TikTok', 'Caras reales, contenido que se comparte'])}
    ${svc('videos', '02', 'Videos y UGC', 'Contenido UGC y producción de videos, con nosotros o alguien de tu equipo como cara.', ['Reseñas, unboxings y pruebas de producto', 'Entrevistas, cápsulas y videos institucionales'])}
    ${svc('eventos', '03', 'Eventos', 'Armamos eventos que se llenan, como el Marketing Fest: +1200 personas en la 1ra edición.', ['Line up, sponsors y producción', 'Comunicación y cobertura'])}
  </div>
</section>
${band(k, P, 'También podés sumar tu marca al podcast o al próximo Marketing Fest. Contanos qué tenés en mente.')}`,
    });
  },

  calle(k, P) {
    return layout(k, {
      title: 'Contenido de marca en la calle · Se Nos Fue de las Manos',
      description: 'Preguntas a la gente, dinámicas y desafíos en la vía pública con tu marca en el centro. Mirá los reels que hicimos y escribinos para hacer el tuyo.',
      body: `${pageHero(k, P, {
        yellow: true, num: 'Para marcas', h1: 'Salimos a la calle con tu marca', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Contenido en la calle']],
        lead: 'Preguntas a la gente, dinámicas y desafíos en la vía pública. Contenido real, con caras reales, pensado para que se comparta.',
        say: 'Mirá el primero: es nuestro favorito.',
      })}
<section class="ch" aria-labelledby="t-reels" data-ig-wrap>
  <div class="wrap">
    <h2 class="sr" id="t-reels">Reels</h2>
    <div class="reel-hot">
      <div class="ig">${reelBox(REELS[0])}</div>
      <div>
        <h3 style="font-size:clamp(2rem,4vw,3rem);margin-bottom:1.25rem">Cómo lo hacemos</h3>
        <ul>
          <li>${icon(P, 'arr')}Pensamos la dinámica con tu marca en el centro.</li>
          <li>${icon(P, 'arr')}Salimos a grabar con nuestro equipo: preguntas, juegos y premios.</li>
          <li>${icon(P, 'arr')}Editamos reels listos para Instagram y TikTok.</li>
          <li>${icon(P, 'arr')}Los publicamos en nuestras redes y en las de tu marca.</li>
        </ul>
        <div class="btns">${wa(P, 'Quiero contenido en la calle')}</div>
      </div>
    </div>
    <div class="reels-nav" aria-hidden="true">
      <button class="prev" tabindex="-1" data-reels="-1"><svg><use href="${P('assets/icons.svg')}#arr"/></svg></button>
      <button class="next" tabindex="-1" data-reels="1"><svg><use href="${P('assets/icons.svg')}#arr"/></svg></button>
    </div>
    <div class="reels" id="reels" aria-label="Más reels en la calle">${REELS.slice(1).map(id => `<div><div class="ig">${reelBox(id)}</div></div>`).join('')}</div>
    <div class="next-links"><a class="ghost" href="${rel(k, 'videos')}">También hacemos videos y UGC</a></div>
  </div>
</section>
${band(k, P)}`,
    });
  },

  videos(k, P) {
    return layout(k, {
      title: 'Videos y contenido UGC para marcas · Se Nos Fue de las Manos',
      description: 'Producción de videos y contenido UGC para tu marca, con el equipo de SNFM o alguien de tu empresa como cara. Del guion a la edición, listo para redes y anuncios.',
      body: `${pageHero(k, P, {
        num: 'Para marcas', h1: 'Videos y UGC para tu marca', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Videos y UGC']],
        lead: 'Contenido que parece hecho por la gente, porque lo hace gente. Lo pensamos, lo grabamos y lo editamos listo para tus redes y tus anuncios.',
        say: '¿Quién pone la cara? Elegís vos: nosotros o alguien de tu equipo.',
      })}
<section class="ch" aria-labelledby="t-svc">
  <div class="wrap">
    <h2 class="sr" id="t-svc">Qué hacemos</h2>
    <div class="svc">
      <article>
        <h3>Contenido UGC</h3>
        <p>Videos en primera persona, como los que la gente sube a sus redes: reseñas, unboxings, "un día con" y pruebas de producto. Ideales para anuncios en Instagram y TikTok.</p>
      </article>
      <article>
        <h3>Producción de videos</h3>
        <p>Del guion a la edición: entrevistas, cápsulas, videos institucionales y coberturas. Con el mismo pulso que el podcast.</p>
      </article>
      <article class="who">
        <h3>¿Quién pone la cara?</h3>
        <ul>
          <li><b>Nosotros.</b> El equipo de SNFM conduce, pregunta y le pone onda a tu marca.</li>
          <li><b>Alguien de tu empresa.</b> Te acompañamos para que se luzca frente a la cámara, aunque sea su primera vez.</li>
        </ul>
      </article>
    </div>
    <div class="btns">${wa(P, 'Quiero videos para mi marca')}</div>
    <div class="next-links">
      <a class="ghost" href="${rel(k, 'calle')}">Mirá lo que hacemos en la calle</a>
      <a class="ghost" href="${rel(k, 'podcast')}">Mirá cómo conducimos en el podcast</a>
    </div>
  </div>
</section>
${band(k, P)}`,
    });
  },

  eventos(k, P) {
    const brands = [...MAIN_SPONSORS, ...SPONSORS_ED1, ...SPONSORS].filter((s, i, a) => s.src && a.findIndex(x => x.alt === s.alt) === i).map(s => ({ ...s, main: false }));
    return layout(k, {
      title: 'Organización de eventos para marcas · Se Nos Fue de las Manos',
      description: 'Armamos eventos que se llenan: el Marketing Fest de la FCE UBA reunió +1200 personas en su 1ra edición y +30 speakers en la 2da. Organizá tu evento con nosotros.',
      image: TEAM[0].src,
      body: `${pageHero(k, P, {
        num: 'Para marcas', h1: 'Armamos eventos que se llenan', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Eventos']],
        lead: 'El Marketing Fest lo hicimos de cero dos veces: +1200 personas en la 1ra edición y +30 speakers en la 2da. Si tu marca quiere un evento así, lo armamos con vos.',
        say: 'Del line up a la cobertura, nos encargamos de todo.',
      })}
<section class="ch s-ink" aria-labelledby="t-ev" style="padding-top:0">
  <div class="wrap">
    <h2 class="sr" id="t-ev">Qué hacemos</h2>
    <div class="ev">
      <div class="ev-photo"><img src="${P(TEAM[0].src)}" alt="${esc(TEAM[0].alt)}" loading="lazy"></div>
      <div>
        <ul class="does">
          <li><i>01</i><div><b>Line up y contenido</b><span>Conseguimos speakers que la gente quiere escuchar y armamos el cronograma.</span></div></li>
          <li><i>02</i><div><b>Sponsors y marcas</b><span>Sumamos marcas con activaciones que tienen sentido para el público.</span></div></li>
          <li><i>03</i><div><b>Producción</b><span>Escenario, pantallas, acreditaciones, stands y equipo el día del evento.</span></div></li>
          <li><i>04</i><div><b>Comunicación</b><span>Piezas, redes, mails y la web, para llenar la sala antes de abrir la puerta.</span></div></li>
          <li><i>05</i><div><b>Cobertura</b><span>Fotos, video y reels para que el evento siga vivo después.</span></div></li>
        </ul>
        <div class="btns">${wa(P, 'Quiero organizar un evento')}</div>
      </div>
    </div>
    <div class="thanks">
      <h3>Marcas que ya confiaron en el Fest</h3>
      ${logoRow(P, brands)}
    </div>
    <div class="next-links">
      <a class="ghost" href="${rel(k, 'f2026')}">Mirá el Marketing Fest 2026</a>
      <a class="ghost" href="${rel(k, 'f2025')}">Mirá el Marketing Fest 2025</a>
    </div>
  </div>
</section>
${band(k, P, 'Contanos qué evento tenés en mente: lanzamiento, convención, jornada para tu equipo o algo que todavía no existe.')}`,
    });
  },
};

for (const k of Object.keys(PAGES)) {
  const P = f => rel(k, f);
  const out = path.join(ROOT, PAGES[k].file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, BUILD[k](k, P));
  console.log('✓', PAGES[k].file);
}

/* sitemap y robots: el sitemap necesita la URL del sitio (CONFIG.site) */
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n${CONFIG.site ? `Sitemap: ${CONFIG.site.replace(/\/$/, '')}/sitemap.xml\n` : ''}`);
if (CONFIG.site) {
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(PAGES).map(k => `  <url><loc>${urlOf(k)}</loc></url>`).join('\n')}\n</urlset>\n`);
  console.log('✓ sitemap.xml');
}
