/* ==========================================================================
   Datos de la web de Se Nos Fue de las Manos.
   Para sumar algo nuevo (un capítulo, un reel, una presentación) editá este
   archivo y después corré  node build.js  para regenerar las páginas.
   No edites los index.html a mano: se pisan en cada build.
   ========================================================================== */

const CONFIG = {
  /* URL pública del sitio, sin barra final (ej. 'https://senosfuedelasmanos.com').
     Con esto se generan el canonical, og:url y sitemap.xml para Google. */
  site: '',
  youtube: 'https://www.youtube.com/@SeNosFueDeLasManos',
  instagram: 'https://www.instagram.com/senosfuedelasmanos.ok/',
  /* Formulario "Avisame de la 3ra edición": hace POST con {nombre, email, whatsapp, evento, tipo, fecha}.
     Hoy usa el webhook de n8n de la pre-inscripción 2026 (workflow E6dF41wKNW31obCu, data table d7GBQXcVm9nlEQsh);
     los registros nuevos llegan con tipo 'aviso-3ra-edicion'. */
  avisoWebhook: 'https://n8n.dtcomunicacion.com/webhook/preinscripcion-mkt-fest',
  /* Formulario "Sumate": la base de gente que quiere dar una mano (UGC, filmmakers, cámaras, etc.).
     Si sumateWebhook tiene una URL (ej. un webhook de n8n), hace POST con
     {nombre, email, whatsapp, roles, link, mensaje, tipo: 'sumate', fecha}.
     Mientras esté vacío, abre WhatsApp con los datos escritos para mandárselos al contacto de abajo. */
  sumateWebhook: '',
  /* Contacto para servicios (marcas): nombre, teléfono como se muestra y link de WhatsApp con el texto precargado */
  contacto: { nombre: 'Juan Pedro', tel: '11 3478-4373' },
  /* Mensaje precargado para marcas que quieren ser sponsors del podcast (mismo número que whatsapp) */
  whatsappSponsor: 'https://wa.me/5491134784373?text=' + encodeURIComponent('¡Hola, Juampe! ¿Cómo estás? Te escribo desde la web de Se Nos Fue de las Manos porque quiero que mi marca sea sponsor del podcast.'),
  whatsapp: 'https://wa.me/5491134784373?text=' + encodeURIComponent('¡Hola, Juampe! ¿Cómo estás? Te escribo desde la web de Se Nos Fue de las Manos para trabajar juntos.')
};

/* Manu, el vocero con IA de SNFM.
   img: la ilustración entera (va en la tarjeta del inicio) · avatar: recorte cuadrado de Manu (va en los círculos chicos)
   video: mp4 vertical opcional; si está, reemplaza a img en la tarjeta (poster: su primer cuadro). */
const MANU = { video: '', poster: '', img: 'assets/img/manu.webp', avatar: 'assets/img/manu-avatar.webp' };

/* Sponsoreo del podcast (solo podcast, sin Marketing Fest). Se muestra en /servicios/sponsor-del-podcast/. */
const PODCAST_SPONSOR = {
  precio: '2.000 USD',
  incluye: [
    ['Sponsor del podcast SNFM', 'que también se transmite en el canal de televisión Gigared.'],
    ['Tu marca en el set y en las menciones', 'de los capítulos, con link en la descripción.'],
    ['Activación o sorteo', 'de productos de tu marca en la comunidad @senosfuedelasmanos.ok.']
  ],
  aclara: 'Solo el podcast: no incluye el Marketing Fest.'
};

/* Roles de la página "Sumate": {t: título, d: qué hace} */
const ROLES = [
  {t:'Creador/a de contenido UGC', d:'Grabás en primera persona: reseñas, pruebas de producto y videos para marcas.'},
  {t:'Filmmaker o cámara', d:'Tenés equipo o sabés usarlo: grabaciones del podcast, eventos y contenido en la calle.'},
  {t:'Edición de video', d:'Cortás capítulos, armás reels y le das ritmo a lo que grabamos.'},
  {t:'Fotografía', d:'Cubrís eventos y sesiones para que quede todo registrado.'},
  {t:'Sonido y streaming', d:'Micrófonos, consola y transmisiones en vivo.'},
  {t:'Diseño', d:'Piezas, miniaturas, placas y todo lo que se ve.'},
  {t:'Redes y community', d:'Publicás, respondés y hacés crecer la comunidad.'},
  {t:'Producción de eventos', d:'Acreditaciones, escenario, speakers y logística el día del Fest.'}
];

/* Capítulos del podcast, del más nuevo al más viejo.
   id: el código del video de YouTube (lo que va después de youtu.be/). Si está vacío, el capítulo lleva al canal.
   hot: true lo muestra grande arriba, como destacado. fest: aparece en el Marketing Fest 2026. */
const EPISODES = [
  {"n":15,"id":"mWQZiNSbfPk","t":"Schneider, Heineken, Villavicencio. La estrategia detrás de estas y 30 marcas más","g":"Juan Pablo Barrale","b":"CCU"},
  {"n":14,"id":"frHZ2A1u_Jc","t":"Cocinando una marca que habla","g":"Nahuel Beneitez","b":"Responsable de marketing de Hudson Kitchenware"},
  {"n":13,"id":"U3ouaWOMLNc","t":"Construyendo una comunidad gamer","g":"Lucas Landa","b":"Responsable de marketing de Logitech"},
  {"n":12,"id":"z7KLrqzyUEk","t":"¿Cuál es el verdadero secreto detrás de las RRPP de McDonald’s?","g":"Fernando Arango","b":"Responsable de comunicaciones de McDonald’s (Arcos Dorados)","hot":true},
  {"n":11,"id":"58lgNq7-6qU","t":"Jugar a construir una comunidad romántica","g":"Malena Riesgo y Facundo Mey","b":"Fundadores de Con el Kora","hot":true,"fest":true},
  {"n":10,"id":"_MChtd2S8w4","t":"Cómo construir equipos extraordinarios","g":"Juan Pablo Brea","b":"Fundador de Hike y ABN Digital"},
  {"n":9,"id":"","t":"Marketing que se lleva puesto","g":"Belu Fiora","b":"CEO & founder de Hacks Digital"},
  {"n":8,"id":"tjo926L-25M","t":"Construir marcas, crear experiencias","g":"Agustina Forchiniti","b":"Responsable de marketing de Enter Group y fundadora de Fuerza Estudio"},
  {"n":7,"id":"ci1ZzBnsqk4","t":"Convertir diversión en comunidad","g":"Julián Ocampo","b":"Emprendedor, creador de contenido y fundador de Play for Fun"},
  {"n":6,"id":"z0wwmsokSnI","t":"Energía de Rockstar y recuperación con Gatorade","g":"Natalia Landa","b":"Pepsico"},
  {"n":5,"id":"HGDVLvvIYE0","t":"Amasando grandes marcas","g":"Sebastián Ríos","b":"Fundador de Almacén de Pizzas y socio en Grupo RE"},
  {"n":4,"id":"UG4LPqGkdlc","t":"De trainee en Samsung a country manager en Mirgor","g":"Daniel Macchi","b":"Mirgor"},
  {"n":3,"id":"jAumKMEuzj4","t":"De hobby a franquicia: el secreto de Big Pons","g":"Eduardo Fosco","b":"Socio y director de Big Pons"},
  {"n":2,"id":"B6IyHL8OWGg","t":"Del branding a la realidad: el desafío de bajar una marca multinacional al mercado local","g":"Diana Anzola","b":"Responsable de marketing de Kia"},
  {"n":1,"id":"27pX_QO6yEY","t":"De Flybondi a Calm: despertando industrias","g":"Malena Martín","b":"CMO de Calm"}
];

/* Reels de contenido en la calle (Instagram). El primero va grande como destacado. */
const REELS = [
  "DYiW6gNxA1m",
  "DdcYkM5xXD0",
  "DZs4iNTDESi",
  "DZf4kmaCDbi",
  "DZdd1XGF3Tg",
  "DZa92xIgg2l",
  "DZK1BDGH1ne",
  "DYnjpQzP2E8"
];

/* Marketing Fest 2026 (2da edición): cronograma. Cada ítem es {d, t, n, c, tp, k, ph, pause, dl, pend, ep}:
   d: día (1 martes 27, 2 miércoles 28) · t: hora · n: nombres · c: empresa o cargo · tp: tema
   k: tipo de panel · ph: fotos (slugs de PH) · pause: acreditación, break o cierre
   dl: la presentación en PDF (en assets/presentaciones) · pend: la presentación todavía no llegó
   ep: capítulos del podcast relacionados (números de EPISODES) */
const DATA = [
  {"d":1,"t":"14:00","n":"Acreditaciones","c":"Introducción y bienvenida","pause":true},
  {"d":1,"t":"14:20","n":"Julián Ocampo","c":"Influencer y founder, Play x Fun y Escuela de UGC","tp":"Cómo vender en Instagram Stories","ph":["julian-ocampo"],"dl":"assets/presentaciones/martes-1420-julian-ocampo.pdf","ep":[7]},
  {"d":1,"t":"15:00","n":"Federico Bongiorno","c":"Everest Media y Ecodiem","tp":"Crecer con método: cómo diseñar un sistema que multiplique tu adquisición","ph":["federico-bongiorno"],"dl":"assets/presentaciones/martes-1500-federico-bongiorno.pdf"},
  {"d":1,"t":"15:45","k":"Panel","n":"Norman Ventre y Sergio Doval","c":"Head of Marketing de Bayer y CEO & Founder de Taquion","tp":"La campaña empieza antes de la creatividad. Modera Diego Miranda Iglesias","ph":["norman-ventre","sergio-doval"]},
  {"d":1,"t":"16:15","k":"Panel de influencers con marca","n":"Giuliana Lourdes, Santino Bellizzi, Facundo Mey y Malena Riesgo","c":"Porfa Café y Con El Kora","tp":"De comunidad a marca. Modera Julieta Skilki","ph":["porfa-giuli-santi","kora-male-facu"],"ep":[11]},
  {"d":1,"t":"16:45","n":"Break","c":"Comida, stands y música","pause":true},
  {"d":1,"t":"17:10","n":"Federico Feres y Solana Epszteyn","c":"CEO y founder de Go For Marketing y directora comercial y de marca de Santaclara","tp":"El próximo consumidor en moda: herramientas de citabilidad","ph":["federico-feres","solana-epszteyn"],"dl":"assets/presentaciones/martes-1710-go-for-santaclara.pdf"},
  {"d":1,"t":"17:45","n":"Celeste D'Andrea","c":"Especialista en e-commerce, Tienda Nube","tp":"El motor de tu negocio: cómo escalar con el ecosistema Tiendanube","ph":["celeste-dandrea"],"dl":"assets/presentaciones/martes-1745-tiendanube.pdf"},
  {"d":1,"t":"18:15","n":"Marcelo Romeo","c":"CEO y partner de Agens","tp":"La nueva era de las marcas","ph":["marcelo-romeo"],"dl":"assets/presentaciones/martes-1815-marcelo-romeo-agens.pdf"},
  {"d":1,"t":"19:00","k":"Panel de marcas","n":"Nahuel Beneitez, Natalia Landa y Kevin Gorfinkel","c":"Director de marketing de Hudson Kitchenware, marketing manager de Pepsico y founder & CEO de Growing Group","tp":"De entender al consumidor a hacer crecer una marca. Modera José Antonio Stracquadaini","ph":["nahuel-beneitez","natalia-landa","kevin-gorfinkel"],"ep":[14,6]},
  {"d":1,"t":"19:40","n":"Break","c":"Comida, stands y música","pause":true},
  {"d":1,"t":"20:00","n":"Catalina Smidt","c":"McDonald's (Arcos Dorados), Brand, Menu & Innovation Grouper","tp":"McDonald's, el caso mundialista que rompe récords","ph":["catalina-smidt"],"dl":"assets/presentaciones/martes-2000-mcdonalds.pdf","ep":[12]},
  {"d":1,"t":"20:30","n":"Sabrina Kolod","c":"Licenciada en marketing, speaker e influencer","tp":"Real Time Marketing: cómo convertí el Mundial en +100 contenidos y qué puede aprender tu marca","ph":["sabrina-kolod"],"pend":true},
  {"d":1,"t":"21:00","n":"Cierre del día 1","c":"Mañana seguimos","pause":true},
  {"d":2,"t":"14:00","n":"Acreditaciones","c":"Introducción y bienvenida","pause":true},
  {"d":2,"t":"14:20","n":"Fernanda Rivera","c":"Founder de Markus","tp":"La evolución de la inteligencia artificial y su impacto en los negocios","ph":["fernanda-rivera"],"pend":true},
  {"d":2,"t":"14:40","n":"Mariano Garibini","c":"Founder de La Pareja Tester"},
  {"d":2,"t":"15:00","n":"Aldana Abadi y Carolina Dubiansky","c":"Carolina Dubiansky y Fandel Mkt","ph":["aldana-abadi","caro-dubi"],"dl":"assets/presentaciones/miercoles-1500-aldana-abadi-fandel.pdf"},
  {"d":2,"t":"15:45","n":"Carolina Geler","c":"Founder & CEO de Komin Sabor Digital","tp":"Tu próximo cliente está scrolleando con hambre","ph":["carolina-geler"],"dl":"assets/presentaciones/miercoles-1545-carolina-geler-komin.pdf"},
  {"d":2,"t":"16:15","k":"Panel de franquicias","n":"Sebastián Ríos, Alejo Canudas y Emiliano Baratz","c":"Grupo RE, Canudas Franquicias y La Pinocha","tp":"Marcas en expansión: marketing para impulsar franquicias. Modera Adolfo Wiegrebe","ph":["sebastian-rios","alejo-canudas","emiliano-baratz"],"ep":[5]},
  {"d":2,"t":"16:45","n":"Break","c":"Comida, stands y música","pause":true},
  {"d":2,"t":"17:10","k":"Panel gamer","n":"Valentín Rementería, Lautaro Bordón y Walter Costabel","c":"KRU, Shell, LocalStrike y Logitech","tp":"Game over al marketing tradicional. Modera Lucas Landa","ph":["valentin-rementeria","lautaro-bordon","walter-costabel"],"ep":[13]},
  {"d":2,"t":"17:45","n":"Juan Pablo Brea y Santiago Giovannetti","c":"Founder & CEO y head of agentic AI de ABN Group","tp":"¿Cuándo fue la última vez que hiciste algo por primera vez?","ph":["juan-pablo-brea","santiago-giovannetti"],"pend":true,"ep":[10]},
  {"d":2,"t":"18:15","k":"Panel de logística y distribución","n":"Agustín Arias Usandivaras y Sebastián Lutz","c":"Brand manager de Heineken y Sol (CCU) y gerente de marketing de Pickit","tp":"Estar donde está el consumidor: distribución, logística y el desafío de llegar en el momento indicado. Modera Rocío Vallbona","ph":["agustin-arias","sebastian-lutz"],"ep":[15]},
  {"d":2,"t":"19:00","n":"Mariano Felix Rica y Francisco Grancelli","c":"Meta, Regional Client Solutions Partner y Regional Retail & Tech Client Partner","tp":"Cooling break: aprovechar la pausa para entender el nuevo juego digital","ph":["mariano-felix-rica","francisco-grancelli"],"pend":true},
  {"d":2,"t":"19:40","n":"Break","c":"Comida, stands y música","pause":true},
  {"d":2,"t":"20:00","n":"Tamara Stronguin","c":"Head of Growth de Rappi","tp":"El balde roto","ph":["tamara-stronguin"],"pend":true},
  {"d":2,"t":"20:30","n":"Tomás Cazalá","c":"Founder & CEO de DT Comunicación, Doble Dosis y FlashTag","ph":["tomas-cazala"]},
  {"d":2,"t":"21:00","n":"Cierre del evento","c":"Nos vemos en la 3ra edición","pause":true}
];

/* Fotos de speakers de la 2da edición, por slug */
const PH = {
 "porfa-giuli-santi": "assets/img/speakers/porfa-giuli-santi.jpg",
 "kora-male-facu": "assets/img/speakers/kora-male-facu.jpg",
 "tamara-stronguin": "assets/img/speakers/tamara-stronguin.jpg",
 "juan-pablo-brea": "assets/img/speakers/juan-pablo-brea.jpg",
 "santiago-giovannetti": "assets/img/speakers/santiago-giovannetti.jpg",
 "walter-costabel": "assets/img/speakers/walter-costabel.jpg",
 "solana-epszteyn": "assets/img/speakers/solana-epszteyn.jpg",
 "norman-ventre": "assets/img/speakers/norman-ventre.jpg",
 "sergio-doval": "assets/img/speakers/sergio-doval.jpg",
 "agustin-arias": "assets/img/speakers/agustin-arias.jpg",
 "sebastian-lutz": "assets/img/speakers/sebastian-lutz.jpg",
 "natalia-landa": "assets/img/speakers/natalia-landa.jpg",
 "kevin-gorfinkel": "assets/img/speakers/kevin-gorfinkel.jpg",
 "federico-bongiorno": "assets/img/speakers/federico-bongiorno.jpg",
 "catalina-smidt": "assets/img/speakers/catalina-smidt.jpg",
 "marcelo-romeo": "assets/img/speakers/marcelo-romeo.jpg",
 "mariano-felix-rica": "assets/img/speakers/mariano-felix-rica.jpg",
 "francisco-grancelli": "assets/img/speakers/francisco-grancelli.jpg",
 "celeste-dandrea": "assets/img/speakers/celeste-dandrea.jpg",
 "caro-dubi": "assets/img/speakers/caro-dubi.jpg",
 "sabrina-kolod": "assets/img/speakers/sabrina-kolod.jpg",
 "aldana-abadi": "assets/img/speakers/aldana-abadi.jpg",
 "fernanda-rivera": "assets/img/speakers/fernanda-rivera.jpg",
 "nahuel-beneitez": "assets/img/speakers/nahuel-beneitez.jpg",
 "federico-feres": "assets/img/speakers/federico-feres.jpg",
 "sebastian-rios": "assets/img/speakers/sebastian-rios.jpg",
 "alejo-canudas": "assets/img/speakers/alejo-canudas.jpg",
 "emiliano-baratz": "assets/img/speakers/emiliano-baratz.jpg",
 "valentin-rementeria": "assets/img/speakers/valentin-rementeria.jpg",
 "lautaro-bordon": "assets/img/speakers/lautaro-bordon.jpg",
 "julian-ocampo": "assets/img/speakers/julian-ocampo.jpg",
 "carolina-geler": "assets/img/speakers/carolina-geler.jpg",
 "tomas-cazala": "assets/img/speakers/tomas-cazala.jpg"
};

/* Fotos de la 2da edición ({src, alt}). Van en assets/img/ed2, a ~1000 px de ancho en JPEG. Mientras esté vacío, la galería no se muestra. */
const GAL2 = [];

/* Fotos de la 1ra edición ({src, alt, cat}) */
const GAL = [
  {"src":"assets/img/ed1/01.jpg","alt":"Charlas con el salón lleno","cat":"Charlas"},
  {"src":"assets/img/ed1/02.jpg","alt":"Escenario principal","cat":"Charlas"},
  {"src":"assets/img/ed1/03.jpg","alt":"Pantalla y escenario","cat":"Charlas"},
  {"src":"assets/img/ed1/04.jpg","alt":"El equipo de acreditaciones","cat":"Acreditaciones","team":true},
  {"src":"assets/img/ed1/05.jpg","alt":"Las pantallas antes de arrancar","cat":"Charlas"},
  {"src":"assets/img/ed1/06.jpg","alt":"El salón, atento a la charla","cat":"Charlas"},
  {"src":"assets/img/ed1/07.jpg","alt":"IA para negocios, en primera persona","cat":"Charlas"},
  {"src":"assets/img/ed1/08.jpg","alt":"Charla en el escenario principal","cat":"Charlas"},
  {"src":"assets/img/ed1/09.jpg","alt":"Marketing y gaming en el escenario","cat":"Charlas"},
  {"src":"assets/img/ed1/10.jpg","alt":"Conectá, innová y aprendé en todas las pantallas","cat":"Charlas"},
  {"src":"assets/img/ed1/11.jpg","alt":"Panel en el escenario","cat":"Paneles de IA y marketing"},
  {"src":"assets/img/ed1/12.jpg","alt":"Sabrina Kolod y Aldana Abadi en el escenario","cat":"Paneles de IA y marketing"},
  {"src":"assets/img/ed1/13.jpg","alt":"Aldana Abadi y Sabrina Kolod con su certificado de disertantes","cat":"Speakers con su certificado"},
  {"src":"assets/img/ed1/14.jpg","alt":"Una selfie entre charla y charla","cat":"La gente"}
];

/* Momentos de la galería de la 1ra edición, en orden (las categorías vacías no se muestran) */
const GAL_CATS = ['Acreditaciones','Charlas','Paneles de IA y marketing','Speakers con su certificado','La gente','Photocall'];

/* Fotos del equipo */
const TEAM = [
  {"src":"assets/img/ed1/equipo-1.jpg","alt":"El equipo completo frente al escenario"},
  {"src":"assets/img/ed1/equipo-2.jpg","alt":"La foto de cierre, con el salón lleno atrás"},
  {"src":"assets/img/ed1/equipo-3.jpg","alt":"El equipo, todos juntos"},
  {"src":"assets/img/ed1/equipo-4.jpg","alt":"Saludo desde atrás del escenario"},
  {"src":"assets/img/ed1/equipo-5.jpg","alt":"Mirando el escenario desde abajo"},
  {"src":"assets/img/ed1/equipo-6.jpg","alt":"Conduciendo el Fest","pos":"50% 22%"},
  {"src":"assets/img/ed1/equipo-7.jpg","alt":"El equipo en el photocall","pos":"50% 30%"},
  {"src":"assets/img/ed1/equipo-8.jpg","alt":"Esperando que arranque"},
  {"src":"assets/img/ed1/equipo-9.jpg","alt":"Selfie en el ascensor"}
];

/* Logos ({src, alt, url}) */
const MF_LOGO = {"light":"assets/img/logos/marketing-fest-oscuro.png","dark":"assets/img/logos/marketing-fest-blanco.png"};
const MAIN_SPONSORS = [
  {"src":"assets/img/logos/main-heineken-0-0.webp","alt":"Heineken 0.0","url":"https://www.heineken.com"},
  {"src":"assets/img/logos/main-ccu.webp","alt":"CCU","url":"https://www.ccu.com.ar","h":84}
];
const SPONSORS = [
  {"src":"assets/img/logos/dt-comunicacion.png","alt":"DT Comunicación","url":"https://dtcomunicacion.com"},
  {"src":"assets/img/logos/doble-dosis.png","alt":"Doble Dosis","url":"https://somosdobledosis.com"},
  {"src":"assets/img/logos/flashtag.png","alt":"FlashTag","url":""},
  {"src":"assets/img/logos/sushi-burger.png","alt":"Sushi Burger","url":""},
  {"src":"assets/img/logos/bengala.webp","alt":"Bengala","url":""},
  {"src":"assets/img/logos/dismaser.webp","alt":"Dismaser","url":""},
  {"src":"assets/img/logos/chiquijuegos.webp","alt":"Chiquijuegos","url":""}
];
const MEDIA = [
  {"src":"assets/img/logos/media-radio-simphony-91-3.webp","alt":"Radio Simphony 91.3","url":""},
  {"src":"assets/img/logos/media-radio-uba-87-9.webp","alt":"Radio UBA 87.9","url":""}
];
const LOGOS = [
  {"src":"assets/img/logos/inst-cace-camara-argentina-de-comercio-electronico.jpg","alt":"CACE, Cámara Argentina de Comercio Electrónico"},
  {"src":"assets/img/logos/inst-dma-data-marketing-association-argentina.jpg","alt":"DMA, Data & Marketing Association Argentina"},
  {"src":"assets/img/logos/inst-academia-argentina-de-la-publicidad.jpg","alt":"Academia Argentina de la Publicidad"},
  {"src":"assets/img/logos/inst-secretaria-de-graduados-economicas-uba.jpg","alt":"Secretaría de Graduados, Económicas UBA"},
  {"src":"assets/img/logos/inst-cece-centro-de-estudiantes-de-ciencias-economicas.jpg","alt":"CECE, Centro de Estudiantes de Ciencias Económicas"},
  {"src":"assets/img/logos/inst-uba-economicas-posgrado-enap.jpg","alt":"UBA Económicas Posgrado, ENAP"}
];
const SPONSORS_ED1 = [
  {"alt":"Tiendanube","src":"assets/img/logos/ed1-tiendanube.webp","url":"","main":true},
  {"alt":"Heineken 0.0","src":"assets/img/logos/ed1-heineken-0-0.webp","url":""},
  {"alt":"Gigared","src":"assets/img/logos/ed1-gigared.webp","url":""},
  {"alt":"DT Comunicación","src":"assets/img/logos/ed1-dt-comunicacion.png","url":"https://dtcomunicacion.com"},
  {"alt":"Doble Dosis","src":"assets/img/logos/ed1-doble-dosis.png","url":"https://somosdobledosis.com"},
  {"alt":"FlashTag","src":"assets/img/logos/ed1-flashtag.png","url":""},
  {"alt":"Óptica Lof","src":"assets/img/logos/ed1-optica-lof.webp","url":""},
  {"alt":"Prometheo","src":"assets/img/logos/ed1-prometheo.webp","url":""},
  {"alt":"Mikhuna Nikkei","src":"","url":""}
];
