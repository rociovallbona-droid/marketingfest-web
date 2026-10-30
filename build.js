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
  '\nObject.assign(this,{CONFIG,MANU,ROLES,PODCAST_SPONSOR,EPISODES,REELS,DATA,PH,GAL2,GAL,GAL_CATS,TEAM,MF_LOGO,MAIN_SPONSORS,SPONSORS,MEDIA,LOGOS,SPONSORS_ED1});', ctx);
const { CONFIG, MANU, ROLES, PODCAST_SPONSOR, EPISODES, REELS, DATA, PH, GAL2, GAL, GAL_CATS, TEAM, MF_LOGO, MAIN_SPONSORS, SPONSORS, MEDIA, LOGOS, SPONSORS_ED1 } = ctx;

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
  sponsor:{ file: 'servicios/sponsor-del-podcast/index.html' },
  sumate: { file: 'sumate/index.html' },
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
/* Recursos gráficos de SNFM (manos y formas del manual): son siluetas que se pintan con el color que se pase */
const shape = (P, name, color, cls) => `<span class="shape ${cls}" aria-hidden="true" style="background:${color};-webkit-mask-image:url(${P('assets/img/snfm/' + name + '.webp')});mask-image:url(${P('assets/img/snfm/' + name + '.webp')})"></span>`;
const says = (P, text) => `<div class="says">${av(P)}<p><b>Manu</b>${text}</p></div>`;
const wa = (P, label, cls = 'cta', href = CONFIG.whatsapp) => `<a class="${cls}" href="${esc(href)}" ${ext} data-wa>${label} ${icon(P, 'arr')}</a>`;

function nav(k, P) {
  const a = (to, label) => `<a href="${rel(k, to)}"${k === to ? ' aria-current="page"' : ''}>${label}</a>`;
  const festOn = ['fest', 'f2026', 'f2025'].includes(k);
  const svcOn = ['servicios', 'calle', 'videos', 'eventos', 'sponsor'].includes(k);
  return `<header class="nav">
  <div class="wrap">
    <a class="home" href="${rel(k, 'home')}" aria-label="Se Nos Fue de las Manos, inicio"><img src="${P('assets/img/snfm/logo-snfm.webp')}" alt="" width="600" height="236"></a>
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
          <a href="${rel(k, 'sponsor')}">Sponsoreá el podcast<small>Tu marca en cada capítulo</small></a>
        </div>
      </div>
      ${a('sumate', 'Sumate')}
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
        <div><strong>Escribile a ${esc(CONFIG.contacto.nombre)}</strong><span>Por WhatsApp, al ${esc(CONFIG.contacto.tel)}</span></div>
      </a>
      <p class="also">O seguinos en <a href="${CONFIG.instagram}" ${ext}>@senosfuedelasmanos.ok</a>.</p>
    </div>
  </div>
</section>`;
}

/* Formularios (capítulo del podcast, speaker, sponsor de la 3ra, Sumate).
   Mandan los datos a CONFIG.formsWebhook (n8n, que avisa por mail al equipo). Si el webhook no responde,
   ofrecen mandar lo mismo por WhatsApp al contacto, así no se pierde nada.
   fields: [name, label, {type: text|email|tel|url|chips|check, req, ph, rows, min, err, options}] */
const ERR = {
  nombre: 'Escribí tu nombre y apellido.',
  email: 'Revisá el email: le falta algo (por ejemplo, la @ o el dominio).',
  tel: 'El teléfono tiene que tener al menos 10 números, con la característica (por ejemplo, 11 2345 6789).',
};
function formBlock(k, P, { id, tipo, num, h, lead, free, intro, asunto, fields, btn, ok, fine, ribbon, style = '' }) {
  const field = ([name, label, o = {}]) => {
    const req = o.req !== false;
    const err = o.err || ERR[name] || (o.type === 'email' ? ERR.email : o.type === 'tel' ? ERR.tel : 'Completá este campo.');
    const data = `data-label="${esc(label)}" data-err="${esc(err)}"${o.min ? ` data-min="${o.min}"` : ''}`;
    if (o.type === 'chips') return `<fieldset class="f" data-group="${name}" ${data}${req ? ' data-req' : ''}><legend>${esc(label)} <small>${req ? 'Elegí uno o más' : '(opcional)'}</small></legend><div class="roles">${o.options.map(v => `<label class="role"><input type="checkbox" name="${name}" value="${esc(v)}"><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`;
    if (o.type === 'check') return `<label class="check"><input type="checkbox" name="${name}" ${data} required><span>${esc(label)}</span></label>`;
    const attrs = `id="${id}-${name}" name="${name}" ${data}${req ? ' required' : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}`;
    const auto = o.type === 'tel' ? ' inputmode="tel" autocomplete="tel"' : o.type === 'email' ? ' autocomplete="email"' : o.type === 'url' ? ' inputmode="url"' : name === 'nombre' ? ' autocomplete="name"' : name === 'marca' ? ' autocomplete="organization"' : '';
    const input = o.rows ? `<textarea ${attrs} rows="${o.rows}"></textarea>` : `<input ${attrs} type="${o.type || 'text'}"${auto}>`;
    return `<div class="f"><label for="${id}-${name}">${esc(label)}${req ? '' : ' <small>(opcional)</small>'}</label>${input}</div>`;
  };
  return `<section class="ch aviso-wrap" id="${id}" aria-labelledby="t-${id}"${style ? ` style="${style}"` : ''}>
  <div class="wrap">
    <div class="aviso sumate">
      <div>
        <p class="num${ribbon ? ' ribbon' : ''}">${num}</p>
        <h2 id="t-${id}">${h}</h2>
        <p class="lead">${lead}</p>
        ${free ? `<p class="free">${free}</p>` : ''}
      </div>
      <form class="aviso-form" data-form="${tipo}" data-hook="${esc(CONFIG.formsWebhook)}" data-asunto="${esc(asunto)}" data-intro="${esc(intro)}" data-ok="${esc(ok)}" data-wa-base="${esc(CONFIG.whatsapp.split('?')[0])}" novalidate>
        ${fields.map(field).join('\n        ')}
        <p class="err" role="alert"></p>
        <button class="cta ink" type="submit">${btn} ${icon(P, 'arr')}</button>
        ${fine ? `<p class="fine">${fine}</p>` : ''}
      </form>
      <div class="aviso-ok" hidden tabindex="-1"></div>
    </div>
  </div>
</section>`;
}
const F = {
  nombre: ['nombre', 'Nombre y apellido'],
  marca: ['marca', 'Marca o empresa', { err: 'Contanos de qué marca o empresa sos.' }],
  cargo: ['cargo', 'Tu cargo', { ph: 'Por ejemplo: gerente de marketing', err: 'Contanos tu cargo.' }],
  email: ['email', 'Email', { type: 'email' }],
  tel: ['whatsapp', 'Teléfono (WhatsApp)', { type: 'tel', ph: '11 2345 6789' }],
};
const hola = q => `¡Hola, Juampe! ¿Cómo estás? Te escribo desde la web de Se Nos Fue de las Manos ${q}`;
const podcastForm = (k, P) => formBlock(k, P, {
  id: 'invitado', tipo: 'capitulo-podcast', asunto: 'Quieren hacer un capítulo del podcast',
  num: 'Gratis', h: 'Vení al podcast',
  lead: '¿Tu marca tiene una historia para contar? Grabamos un capítulo con vos para mostrar la cocina de tu marketing. No hace falta ser sponsor.',
  free: 'Participar de un capítulo es gratuito.',
  intro: hola('porque quiero hacer un capítulo del podcast.'),
  btn: 'Quiero hacer un capítulo', ok: 'Recibimos tu propuesta. Te escribimos para coordinar el capítulo.',
  fields: [F.nombre, F.marca, F.cargo, F.email, F.tel,
    ['tema', '¿De qué te gustaría hablar?', { rows: 3, min: 20, ph: 'Por ejemplo: cómo lanzamos una marca nueva con poco presupuesto.', err: 'Contanos en una o dos frases de qué te gustaría hablar.' }]],
});
const speakerForm = (k, P) => formBlock(k, P, {
  id: 'speaker', tipo: 'speaker-fest', ribbon: true, asunto: 'Propuesta de speaker para el Marketing Fest',
  num: 'Gratis · 3ra edición', h: 'Sé speaker en el Marketing Fest',
  lead: '¿Querés que tu marca suba al escenario? Contanos qué le vas a dejar a la gente: qué aprende, qué se lleva para su negocio o su carrera. Elegimos las charlas por lo que suman, no por quién paga.',
  free: 'Ser speaker es gratuito.',
  intro: hola('porque quiero proponer una charla para el Marketing Fest.'),
  btn: 'Mandar mi propuesta', ok: 'Recibimos tu propuesta de charla. La leemos con el equipo y te escribimos.',
  fields: [F.nombre, F.marca, F.cargo, F.email, F.tel,
    ['propuesta', 'Tu propuesta de valor: ¿qué se lleva la gente de tu charla?', { rows: 4, min: 40, ph: 'Por ejemplo: cómo armamos una comunidad de 100 mil personas sin pauta, con los números reales.', err: 'Contanos tu propuesta de valor en al menos un par de frases: qué aprende la gente con tu charla.' }],
    ['link', 'LinkedIn o web de la marca', { req: false, type: 'url', ph: 'https://' }]],
});
const sponsorFestForm = (k, P) => formBlock(k, P, {
  id: 'sponsor-3ra', tipo: 'sponsor-fest', ribbon: true, asunto: 'Una marca quiere ser sponsor de la 3ra edición del Marketing Fest',
  num: 'Marketing Fest · 3ra edición', h: 'Sumá tu marca como sponsor',
  lead: 'Más de 2600 personas en la 2da edición, entre estudiantes, profesionales y emprendedores. Dejanos tus datos y te mandamos las opciones para la 3ra.',
  intro: hola('porque quiero que mi marca sea sponsor de la 3ra edición del Marketing Fest.'),
  btn: 'Quiero ser sponsor', ok: 'Recibimos tus datos. Te escribimos con las opciones para la 3ra edición.',
  fields: [F.nombre, F.marca, F.cargo, F.email, F.tel,
    ['interes', '¿Qué te interesa?', { type: 'chips', options: ['Main sponsor', 'Sponsor', 'Stand o activación', 'Sorteo de productos', 'Todavía no sé'], err: 'Elegí al menos una opción (si no sabés, marcá "Todavía no sé").' }],
    ['mensaje', 'Contanos algo más', { req: false, rows: 3, ph: 'Por ejemplo: queremos hacer sampling de un producto nuevo.' }]],
});
const sumateForm = (k, P) => formBlock(k, P, {
  id: 'anotate', tipo: 'sumate', asunto: 'Alguien se quiere sumar a Se Nos Fue de las Manos', style: 'padding-top:0',
  num: 'La base de SNFM', h: 'Anotate',
  lead: 'Contanos quién sos y en qué te gustaría ayudar. No hace falta experiencia profesional: hacen falta ganas.',
  intro: hola('porque quiero sumarme al equipo.'),
  btn: 'Quiero sumarme', ok: 'Ya estás en la base. Cuando necesitemos una mano en lo tuyo, te escribimos.',
  fields: [F.nombre, F.email, F.tel,
    ['roles', '¿En qué podés ayudar?', { type: 'chips', options: ROLES.map(r => r.t), err: 'Elegí al menos una forma de ayudar.' }],
    ['link', 'Link a tu portfolio, Instagram o TikTok', { req: false, type: 'url', ph: 'https://' }],
    ['mensaje', 'Contanos algo más', { req: false, rows: 3, ph: 'Por ejemplo: tengo cámara y micrófono, o puedo los martes a la tarde.' }],
    ['ok', 'Entiendo que no es remunerado: me sumo por amor al marketing.', { type: 'check', err: 'Marcá la casilla para confirmar que sabés que no es remunerado.' }]],
});

/* Formulario para que te avisen cuando abra la 3ra edición del Marketing Fest */
function aviso(k, P, id = 'tercera') {
  return `<section class="ch aviso-wrap" id="${id}" aria-labelledby="t-${id}">
  <div class="wrap">
    <div class="aviso">
      <div>
        <p class="num ribbon">Marketing Fest · 3ra edición</p>
        <h2 id="t-${id}">Avisame cuando salga la 3ra</h2>
        <p class="lead">Dejanos tus datos y te escribimos apenas abra la inscripción. Es libre y gratuita, pero los cupos vuelan.</p>
      </div>
      <form class="aviso-form" data-aviso="${esc(CONFIG.avisoWebhook)}" data-hook="${esc(CONFIG.formsWebhook)}" novalidate>
        <div class="f"><label for="${id}-n">Nombre y apellido</label><input id="${id}-n" name="nombre" autocomplete="name" required></div>
        <div class="f"><label for="${id}-e">Email</label><input id="${id}-e" name="email" type="email" autocomplete="email" required></div>
        <div class="f"><label for="${id}-t">Teléfono (WhatsApp)</label><input id="${id}-t" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="11 2345 6789" required></div>
        <p class="err" role="alert"></p>
        <button class="cta ink" type="submit">Avisame ${icon(P, 'arr')}</button>
        <p class="fine">Solo te escribimos para avisarte de la 3ra edición del Marketing Fest.</p>
      </form>
      <div class="aviso-ok" hidden tabindex="-1"></div>
    </div>
  </div>
</section>`;
}

function qa(k) {
  return [
    { q: '¿Dónde bajo las presentaciones del Fest?', a: `Están en <a href="${rel(k, 'f2026')}#descargas">la página de la 2da edición</a>, separadas por día. Tocá "Descargar PDF" en la charla que quieras.` },
    { q: '¿Cuándo es la 3ra edición del Fest?', a: `Todavía no tiene fecha. Dejá tus datos en <a href="${rel(k, 'fest')}#tercera">Avisame cuando salga la 3ra</a> y te escribimos apenas abra la inscripción.` },
    { q: '¿Dónde veo el podcast?', a: `En nuestro <a href="${CONFIG.youtube}" ${ext}>canal de YouTube</a>. Si no sabés por cuál arrancar, andá por el de Con el Kora o el de McDonald's. Están todos en <a href="${rel(k, 'podcast')}">la página del podcast</a>.` },
    { q: 'Tengo una marca, ¿qué pueden hacer conmigo?', a: `Mirá <a href="${rel(k, 'servicios')}">nuestros servicios</a>: <a href="${rel(k, 'calle')}">Contenido en la calle</a>, <a href="${rel(k, 'videos')}">videos y UGC</a> con nosotros o alguien de tu equipo como cara, <a href="${rel(k, 'eventos')}">eventos</a> como el Marketing Fest y tu marca en el podcast.` },
    { q: '¿Cómo me sumo a Se Nos Fue?', a: `Anotate en <a href="${rel(k, 'sumate')}">Sumate</a> y contanos en qué podés ayudar. Ojo: no es remunerado, lo hacemos por amor al marketing.` },
    { q: '¿Mi marca puede ser sponsor del podcast?', a: `¡Sí! Sponsorear solo el podcast sale ${esc(PODCAST_SPONSOR.precio)}. Mirá <a href="${rel(k, 'sponsor')}">qué incluye</a> o escribile directo a ${esc(CONFIG.contacto.nombre)} por <a href="${esc(CONFIG.whatsappSponsor)}" ${ext}>WhatsApp</a>.` },
    { q: '¿Puedo hacer un capítulo del podcast sin ser sponsor?', a: `¡Sí, y es gratis! Proponé tu capítulo en <a href="${rel(k, 'podcast')}#invitado">Vení al podcast</a>.` },
    { q: '¿Cómo hago para ser speaker en el Fest?', a: `Es gratis. Contanos tu propuesta de valor (qué se lleva la gente de tu charla) en <a href="${rel(k, 'fest')}#speaker">Sé speaker en el Marketing Fest</a>.` },
    { q: '¿Cómo sumo mi marca como sponsor de la 3ra edición?', a: `Dejanos tus datos en <a href="${rel(k, 'fest')}#sponsor-3ra">Sumá tu marca como sponsor</a> y te mandamos las opciones.` },
    { q: '¿Cuánto sale?', a: `Depende de la idea. Escribile a ${esc(CONFIG.contacto.nombre)} por <a href="${esc(CONFIG.whatsapp)}" ${ext}>WhatsApp</a>, contale qué tenés en mente y te pasa una propuesta.` },
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
    <img class="logo" src="${P('assets/img/snfm/logo-se-nos-fue.webp')}" alt="Se Nos Fue de las Manos" width="900" height="421" loading="lazy">
    <p>El Marketing Fest lo organizan Se Nos Fue de las Manos, Tomás Cazalá, el cuerpo docente de Marketing Digital, el Centro de Estudiantes, la Secretaría de Graduados y la FCE UBA.</p>
    <nav aria-label="Más">
      <a href="${rel(k, 'podcast')}">Podcast</a>
      <a href="${rel(k, 'fest')}">Marketing Fest</a>
      <a href="${rel(k, 'servicios')}">Servicios</a>
      <a href="${rel(k, 'sumate')}">Sumate</a>
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

function pageHero(k, P, { num, h1, lead, say, trail, yellow, fest, logoTitle, deco, extra = '' }) {
  return `<section class="page-hero${yellow ? ' s-y' : ''}${fest ? ' fest-hero' : ''}${deco ? ' deco-hero' : ''}">
  ${deco ? shape(P, deco[0], deco[1], 'hero-shape') : ''}
  ${fest ? `<img class="deco destello" src="${P('assets/img/fest/destello-naranja.webp')}" alt="" aria-hidden="true"><img class="deco estrellas" src="${P('assets/img/fest/estrellas-amarillo.webp')}" alt="" aria-hidden="true">` : ''}
  <div class="wrap">
    ${crumbs(k, trail)}
    ${fest && !logoTitle ? `<img class="mf-logo" src="${P(MF_LOGO.dark)}" alt="Marketing Fest" width="1000" height="195">` : ''}
    ${num ? `<p class="num">${num}</p>` : ''}
    ${logoTitle ? `<h1 class="logo-title"><img src="${P(MF_LOGO.dark)}" alt="${h1}" width="1000" height="195"></h1>` : `<h1>${h1}</h1>`}
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
    const card = (to, num, h, p, go, logo) => `<a class="card" href="${rel(k, to)}"><div><span class="num">${num}</span>${logo ? `<img class="card-logo" src="${P(logo)}" alt="" aria-hidden="true">` : ''}<h3>${h}</h3><p>${p}</p></div><span class="go">${go} ${icon(P, 'arr')}</span></a>`;
    return layout(k, {
      title: 'Se Nos Fue de las Manos · Podcast de marketing, Marketing Fest y contenido para marcas',
      description: 'Docentes, ayudantes y estudiantes de la UBA que enseñamos marketing fuera del aula: un podcast con gerentes de marcas referentes, el Marketing Fest libre y gratuito y contenido para marcas. Descargá las presentaciones del Marketing Fest 2026.',
      body: `<section class="hero" aria-labelledby="t-hero">
  <div class="wrap">
    <div>
      <p class="num">#00</p>
      <h1 id="t-hero"><span>Se nos fue</span><span>de las manos</span><span class="pill p-red" aria-hidden="true">Podcast</span><span class="pill p-violet" aria-hidden="true">Mkt Fest</span></h1>
      <p class="lead">Somos docentes, ayudantes y estudiantes de la UBA que enseñamos marketing desde otro lado: fuera del aula, en la cocina de cada marca.</p>
      <ul class="chips" aria-label="En números">
        <li><b>${EPISODES.length}</b>capítulos del podcast</li>
        <li><b>+60</b>speakers en dos ediciones del Fest</li>
        <li><b>+1200</b>personas en la 1ra</li>
        <li><b>+2600</b>personas en la 2da</li>
      </ul>
      <div class="btns">
        <a class="cta" href="${rel(k, 'f2026')}#descargas">Descargá las presentaciones ${icon(P, 'arr')}</a>
        <a class="ghost" href="#tercera">Avisame de la 3ra edición</a>
      </div>
    </div>
    <figure class="manu" aria-label="Manu, el vocero con IA de Se Nos Fue de las Manos">
      <img class="sticker" src="${P('assets/img/snfm/sticker.webp')}" alt="" aria-hidden="true" width="420" height="422">
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

<section class="ch about-wrap" aria-labelledby="t-quienes">
  ${shape(P, 'mano-ok', 'var(--y)', 'about-hand')}
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
      ${card('fest', '#02', 'Marketing Fest', 'El evento de marketing más grande de la FCE UBA. En la 2da edición vinieron más de 2600 personas.', 'Conocé el Fest', MF_LOGO.mini)}
      ${card('servicios', '#03', 'Nuestros servicios', 'Contenido en la calle, videos y UGC, eventos y sponsoreo del podcast.', 'Ver los servicios')}
      ${card('sumate', '#04', 'Sumate', '¿Hacés UGC, filmás o editás? Anotate y te llamamos cuando necesitemos una mano.', 'Quiero sumarme')}
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
${aviso(k, P)}
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
        deco: ['mano-chasquido', 'var(--y)'], num: '#01', h1: 'El podcast', trail: [['home', 'Inicio'], [null, 'Podcast']],
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
${podcastForm(k, P)}
<section class="ch s-ink" aria-labelledby="t-spon" style="padding:clamp(40px,6vw,72px) 0">
  <div class="wrap spon-strip">
    <div><h2 id="t-spon">Tu marca en el podcast</h2><p class="lead">Sponsoreá los próximos capítulos y llegá a quienes aprenden marketing de los que lo hacen. ¿Solo querés contar tu historia? <a href="#invitado">Hacer un capítulo es gratis</a>.</p></div>
    <div class="btns" style="margin:0">${wa(P, `Hablá con ${esc(CONFIG.contacto.nombre)}`, 'cta', CONFIG.whatsappSponsor)}<a class="ghost" href="${rel(k, 'sponsor')}">Ver más info</a></div>
  </div>
</section>
${band(k, P, 'También hacemos contenido en la calle, videos, UGC y eventos.')}`,
    });
  },

  fest(k, P) {
    return layout(k, {
      title: 'Marketing Fest · El evento de marketing de la FCE UBA',
      description: 'El Marketing Fest es el evento de marketing más grande de la Facultad de Ciencias Económicas de la UBA. Mirá cómo fueron la 1ra edición (2025) y la 2da (2026) y descargá las presentaciones.',
      body: `${pageHero(k, P, {
        fest: true, logoTitle: true, num: '#02', h1: 'Marketing Fest', trail: [['home', 'Inicio'], [null, 'Marketing Fest']],
        lead: 'El evento de marketing más grande de la Facultad de Ciencias Económicas de la UBA, abierto a todo el mundo, libre y gratuito. Lo hacemos para democratizar el conocimiento: que no tengas que pagar una fortuna para ver a los capos del rubro contar lo que hacen bien y entender cómo hacer crecer tu negocio o tu carrera profesional.',
        say: 'Ya van dos ediciones, más de 3800 personas y más de 60 speakers. Elegí cuál querés ver.',
        extra: `<div class="btns"><a class="cta" href="#tercera">Avisame de la 3ra edición ${icon(P, 'arr')}</a><a class="ghost" href="#speaker">Quiero ser speaker</a><a class="ghost" href="#sponsor-3ra">Quiero ser sponsor</a></div>`,
      })}
<section class="ch" aria-labelledby="t-eds">
  <div class="wrap">
    <h2 class="sr" id="t-eds">Ediciones</h2>
    <div class="cards two">
      <a class="card" href="${rel(k, 'f2026')}"><img class="star" src="${P('assets/img/fest/estrella-naranja.webp')}" alt="" aria-hidden="true"><div><span class="num">27 y 28 de octubre de 2026</span><h3>2da edición</h3><p>Meta, McDonald's, Pepsico, Rappi, CCU, Tiendanube y más. Las presentaciones están para descargar.</p>
        <div class="mini"><div><b>+2600</b><span>personas</span></div><div><b>+30</b><span>speakers</span></div><div><b>${nTalks}</b><span>charlas y paneles</span></div></div></div>
        <span class="go">Ver la 2da edición ${icon(P, 'arr')}</span></a>
      <a class="card" href="${rel(k, 'f2025')}"><img class="star" src="${P('assets/img/fest/estrella-azul.webp')}" alt="" aria-hidden="true"><div><span class="num">25 y 26 de septiembre de 2025</span><h3>1ra edición</h3><p>Donde empezó todo: el salón lleno y una fila que daba la vuelta.</p>
        <div class="mini"><div><b>+1200</b><span>personas</span></div><div><b>16</b><span>speakers</span></div></div></div>
        <span class="go">Ver la 1ra edición ${icon(P, 'arr')}</span></a>
    </div>
    <div class="thanks">
      <div><p class="label">Con el apoyo institucional de</p>${logoRow(P, LOGOS)}</div>
    </div>
  </div>
</section>
${speakerForm(k, P)}
${sponsorFestForm(k, P)}
${aviso(k, P)}
${band(k, P, '¿Querés sumar tu marca al próximo Marketing Fest u organizar un evento propio? Escribinos.')}`,
    });
  },

  f2026(k, P) {
    const day = d => DATA.filter(r => r.d === d).map(r => talkRow(P, r)).join('\n');
    const dls = DATA.filter(r => r.dl).length;
    return layout(k, {
      title: 'Marketing Fest 2026 · 2da edición: presentaciones para descargar',
      description: `Así fue la 2da edición del Marketing Fest en la FCE UBA, el 27 y 28 de octubre de 2026. Descargá en PDF las presentaciones de McDonald's, Tiendanube, Agens, Go For y más.`,
      jsonld: [festEvent(k, 'Marketing Fest 2026 · 2da edición', '2026-10-27T14:00:00-03:00', '2026-10-28T21:00:00-03:00', 'Dos días de charlas y paneles de marketing en la FCE UBA, libres y gratuitos, con más de 2600 personas y +30 speakers.')],
      body: `${pageHero(k, P, {
        fest: true, num: '27 y 28 de octubre de 2026', h1: 'Marketing Fest 2026', trail: [['home', 'Inicio'], ['fest', 'Marketing Fest'], [null, '2da edición']],
        lead: 'El 27 y 28 de octubre de 2026 la FCE UBA fue el lugar del marketing. Vinieron más de 2600 personas a dos días de charlas y paneles con Meta, McDonald\'s, Pepsico, Rappi, CCU, Tiendanube, Bayer, Logitech y muchas más. Gracias por venir.',
      })}
<section class="ch s-ink" aria-labelledby="t-dl" style="padding-top:0">
  <div class="wrap">
    <dl class="facts">
      <div><dt>+2600</dt><dd>personas</dd></div>
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
      <img class="stars" src="${P('assets/img/fest/estrellas-naranja.webp')}" alt="" aria-hidden="true">
      <h2 style="font-size:clamp(1.8rem,4vw,2.6rem)">Gracias a las marcas que lo hicieron posible</h2>
      <div><p class="label">Main sponsors</p>${logoRow(P, MAIN_SPONSORS, 'main')}</div>
      <div><p class="label">Sponsors</p>${logoRow(P, SPONSORS)}</div>
      <div><p class="label">Media partners</p>${logoRow(P, MEDIA)}</div>
      <div><p class="label">Con el apoyo institucional de</p>${logoRow(P, LOGOS)}</div>
    </div>
    <div class="next-links">
      <a class="cta" href="${rel(k, 'fest')}#sponsor-3ra">Quiero que mi marca sea sponsor de la 3ra ${icon(P, 'arr')}</a>
      <a class="ghost" href="${rel(k, 'fest')}#speaker">Quiero ser speaker en la 3ra</a>
      <a class="ghost" href="${rel(k, 'f2025')}">Mirá cómo fue la 1ra edición</a>
      <a class="ghost" href="${rel(k, 'podcast')}">Escuchá a los speakers en el podcast</a>
    </div>
  </div>
</section>
${aviso(k, P)}
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
        fest: true, num: '25 y 26 de septiembre de 2025', h1: 'Donde empezó todo', trail: [['home', 'Inicio'], ['fest', 'Marketing Fest'], [null, '1ra edición']],
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
        <div class="next-links"><a class="ghost" href="${rel(k, 'f2026')}">Mirá cómo fue la 2da edición</a><a class="ghost" href="${rel(k, 'fest')}#speaker">Quiero ser speaker en la 3ra</a></div>
      </div>
    </div>
  </div>
</section>
${aviso(k, P)}
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
        deco: ['mano-ok', 'var(--ink)'], yellow: true, num: 'Para marcas', h1: 'Nuestros servicios', trail: [['home', 'Inicio'], [null, 'Servicios']],
        lead: 'Lo que aprendimos haciendo el podcast y el Marketing Fest, puesto al servicio de tu marca. Elegí uno o combinalos.',
        say: 'Tocá "Ver más info" en el que te interese y te cuento todo.',
      })}
<section class="ch" aria-label="Servicios">
  <div class="wrap svc-list">
    ${svc('calle', '01', 'Contenido en la calle', 'Preguntas a la gente, dinámicas y desafíos en la vía pública, con tu marca en el centro.', ['Reels listos para Instagram y TikTok', 'Caras reales, contenido que se comparte'])}
    ${svc('videos', '02', 'Videos y UGC', 'Contenido UGC y producción de videos, con nosotros o alguien de tu equipo como cara.', ['Reseñas, unboxings y pruebas de producto', 'Entrevistas, cápsulas y videos institucionales'])}
    ${svc('eventos', '03', 'Eventos', 'Armamos eventos que se llenan, como el Marketing Fest: más de 2600 personas en la 2da edición y más de 60 speakers entre las dos.', ['Line up, sponsors y producción', 'Comunicación y cobertura'])}
    ${svc('sponsor', '04', 'Sponsoreá el podcast', 'Tu marca presente en los capítulos de Se Nos Fue de las Manos, en YouTube, Spotify, TikTok y Gigared TV.', ['En el set, en las menciones y en los shorts', 'Hablás directo con ' + esc(CONFIG.contacto.nombre)])}
  </div>
</section>
${band(k, P, 'También podés sumar tu marca al podcast o al próximo Marketing Fest. Contanos qué tenés en mente.')}`,
    });
  },

  sumate(k, P) {
    return layout(k, {
      title: 'Sumate a Se Nos Fue de las Manos · UGC, filmmakers, cámaras y más',
      description: '¿Hacés UGC, filmás, editás o sacás fotos? Sumate a la base de Se Nos Fue de las Manos y te llamamos cuando necesitemos una mano para el podcast, el Marketing Fest o un proyecto. No es remunerado: es por amor al marketing.',
      body: `${pageHero(k, P, {
        deco: ['mano-saludo', 'var(--ink)'], yellow: true, num: 'Sumate', h1: 'Sumate a Se Nos Fue', trail: [['home', 'Inicio'], [null, 'Sumate']],
        lead: 'Estamos armando una base de gente con ganas de hacer: creadores de UGC, filmmakers, cámaras, editores y más. Cuando necesitemos una mano para el podcast, el Marketing Fest o un proyecto, te llamamos.',
        say: 'Antes de anotarte: no es remunerado. Lo hacemos por amor al marketing.',
      })}
<section class="ch" aria-labelledby="t-roles">
  <div class="wrap">
    <div class="ch-head">
      <h2 id="t-roles">Cómo podés ayudar</h2>
    </div>
    <ul class="roles-list">${ROLES.map(r => `<li><b>${esc(r.t)}</b><span>${esc(r.d)}</span></li>`).join('')}</ul>
    <div class="note">
      <strong>No es remunerado</strong>
      <p>Se Nos Fue de las Manos lo hacemos docentes, ayudantes y estudiantes por amor al marketing, y quien se suma lo hace igual. Lo que te llevás: experiencia en proyectos reales, material para tu portfolio y un equipo con las mismas ganas que vos.</p>
    </div>
  </div>
</section>

${sumateForm(k, P)}
${band(k, P)}`,
    });
  },

  sponsor(k, P) {
    const brands = ['McDonald\'s', 'CCU', 'Pepsico', 'Logitech', 'Kia', 'Mirgor', 'Hudson Kitchenware', 'Calm', 'Con el Kora'];
    return layout(k, {
      title: 'Sponsoreá el podcast de marketing · Se Nos Fue de las Manos',
      description: `Sumá tu marca como sponsor del podcast de Se Nos Fue de las Manos: ${EPISODES.length} capítulos con gerentes de marketing de McDonald's, CCU, Pepsico y más, en YouTube, Spotify, TikTok y Gigared TV. Hablá directo con ${CONFIG.contacto.nombre}.`,
      body: `${pageHero(k, P, {
        deco: ['forma-flor', 'var(--purple)'], num: 'Para marcas', h1: 'Sponsoreá el podcast', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Sponsor del podcast']],
        lead: 'Tu marca presente en las charlas con los que hacen marketing en las marcas más grandes del país, frente a estudiantes, profesionales y emprendedores que quieren aprender de verdad.',
        say: `Para sponsorear, hablá directo con ${esc(CONFIG.contacto.nombre)}. Te arma la propuesta a medida.`,
        extra: `<div class="btns">${wa(P, `Escribile a ${esc(CONFIG.contacto.nombre)}`, 'cta', CONFIG.whatsappSponsor)}</div>`,
      })}
<section class="ch" aria-labelledby="t-precio">
  <div class="wrap">
    <div class="price">
      <div class="price-t"><span>Sumate como</span><h2 id="t-precio">Sponsor del podcast</h2></div>
      <div class="price-b">
        <ul>${PODCAST_SPONSOR.incluye.map(([b, t]) => `<li><b>${esc(b)}</b> ${esc(t)}</li>`).join('')}</ul>
        <p class="price-v"><strong>${esc(PODCAST_SPONSOR.precio)}</strong><small>${esc(PODCAST_SPONSOR.aclara)}</small></p>
        ${wa(P, `Quiero ser sponsor`, 'cta', CONFIG.whatsappSponsor)}
      </div>
    </div>
  </div>
</section>

<section class="ch" aria-labelledby="t-como" style="padding-top:0">
  <div class="wrap">
    <h2 class="sr" id="t-como">Cómo aparece tu marca</h2>
    <div class="svc">
      <article><h3>En el set</h3><p>Tu marca o tu producto a la vista mientras charlamos con los invitados.</p></article>
      <article><h3>En las menciones</h3><p>Te nombramos en los capítulos y en la descripción, con link a tu marca.</p></article>
      <article class="who"><h3>Dónde se ve</h3><ul><li><b>YouTube</b> Los capítulos completos.</li><li><b>Spotify, TikTok y Gigared TV</b> El audio y los mejores momentos.</li></ul></article>
    </div>
    <div class="thanks">
      <h3 style="font-size:clamp(1.8rem,4vw,2.6rem)">Ya pasaron por el podcast</h3>
      <p class="lead" style="max-width:none">${brands.join(' · ')}</p>
    </div>
    <div class="ch-head" style="margin:clamp(40px,6vw,64px) 0 1.5rem"><h3 style="font-size:clamp(1.8rem,4vw,2.6rem)">Mirá cómo es un capítulo</h3></div>
    <div class="hot">${hotEps(P)}</div>
    <div class="btns">${wa(P, `Quiero sponsorear el podcast`, 'cta', CONFIG.whatsappSponsor)}<a class="ghost" href="${rel(k, 'podcast')}">Ver todos los capítulos</a></div>
    <div class="note"><strong>¿Sin ser sponsor?</strong><p>Si querés que tu marca participe de un capítulo, es gratis. <a href="${rel(k, 'podcast')}#invitado">Proponé tu capítulo</a>.</p></div>
  </div>
</section>
${band(k, P, 'Además del podcast, hacemos contenido en la calle, videos, UGC y eventos.')}`,
    });
  },

  calle(k, P) {
    return layout(k, {
      title: 'Contenido de marca en la calle · Se Nos Fue de las Manos',
      description: 'Preguntas a la gente, dinámicas y desafíos en la vía pública con tu marca en el centro. Mirá los reels que hicimos y escribinos para hacer el tuyo.',
      body: `${pageHero(k, P, {
        deco: ['forma-sol', 'var(--red)'], yellow: true, num: 'Para marcas', h1: 'Salimos a la calle con tu marca', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Contenido en la calle']],
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
        deco: ['forma-destello', 'var(--cyan)'], num: 'Para marcas', h1: 'Videos y UGC para tu marca', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Videos y UGC']],
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
      description: 'Armamos eventos que se llenan: el Marketing Fest de la FCE UBA pasó de +1200 personas en su 1ra edición a más de 2600 en la 2da, con más de 60 speakers. Organizá tu evento con nosotros.',
      image: TEAM[0].src,
      body: `${pageHero(k, P, {
        deco: ['forma-asterisco', 'var(--green)'], num: 'Para marcas', h1: 'Armamos eventos que se llenan', trail: [['home', 'Inicio'], ['servicios', 'Servicios'], [null, 'Eventos']],
        lead: 'El Marketing Fest lo hicimos de cero dos veces: más de 3800 personas y más de 60 speakers entre las dos ediciones (+1200 en la 1ra y más de 2600 en la 2da). Si tu marca quiere un evento así, lo armamos con vos.',
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
