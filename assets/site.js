/* JS compartido por todas las páginas. El contenido viene ya armado en el HTML (lo genera build.js);
   acá solo va lo que necesita interacción. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Manu: botón de sonido del video */
$$('.manu-sound').forEach(b=>{
  const v=b.parentNode.querySelector('video');
  b.onclick=()=>{ v.muted=!v.muted; if(!v.muted) v.play(); b.setAttribute('aria-pressed',String(!v.muted)); b.textContent=v.muted?'Activar sonido':'Silenciar'; };
});

/* Presentaciones: pestañas por día. Sin JS se ven los dos días. */
const tabs=$$('.tabs [role=tab]');
if(tabs.length){
  const select=(b,focus)=>{
    tabs.forEach(t=>{ const on=t===b; t.setAttribute('aria-selected',on); t.tabIndex=on?0:-1; $('#'+t.getAttribute('aria-controls')).hidden=!on; });
    if(focus) b.focus();
  };
  tabs.forEach((b,i)=>{
    b.onclick=()=>select(b);
    b.onkeydown=e=>{ if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); select(tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length],true); } };
  });
  select(tabs[0]);
}

/* Reels de Instagram: el script de IG se carga recién cuando la sección está cerca */
const igWrap=$('[data-ig-wrap]');
if(igWrap){
  let loaded=false;
  const load=()=>{ if(loaded) return; loaded=true;
    const s=document.createElement('script'); s.async=true; s.src='https://www.instagram.com/embed.js';
    s.onload=()=>{ window.instgrm&&instgrm.Embeds.process(); };
    document.body.appendChild(s); };
  /* cuando IG reemplaza el blockquote por su iframe, se esconde el respaldo */
  new MutationObserver(()=>$$('.ig',igWrap).forEach(b=>{ if($('iframe',b)) b.classList.add('ready'); })).observe(igWrap,{childList:true,subtree:true});
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ load(); io.disconnect(); } },{rootMargin:'600px 0px'});
    io.observe(igWrap);
  } else load();
  $$('[data-reels]').forEach(b=>b.onclick=()=>{ const r=$('#reels'), d=+b.dataset.reels; r.scrollBy({left:d*(r.firstElementChild.offsetWidth+16),behavior:reduce?'auto':'smooth'}); });
}

/* Preguntale a Manu: respuestas armadas (window.QA, cada página lo trae con sus links) */
const chat=$('#chat');
if(chat && window.QA){
  const log=$('#chat-log');
  const say=(html,who)=>{ log.insertAdjacentHTML('beforeend',`<div class="msg ${who}">${html}</div>`); log.scrollTop=log.scrollHeight; };
  $('#chat-q').innerHTML=QA.map((x,i)=>`<button data-q="${i}">${x.q}</button>`).join('');
  $$('#chat-q button').forEach(b=>b.onclick=()=>{ const x=QA[+b.dataset.q]; say(x.q,'u'); setTimeout(()=>say(x.a,'m'),reduce?0:350); });
  $$('[data-ask]').forEach(b=>b.onclick=()=>{
    if(!log.children.length) say('¡Hola! Soy Manu. ¿Qué querés saber? Elegí una pregunta.','m');
    chat.showModal();
  });
  $('[data-close]',chat).onclick=()=>chat.close();
  chat.addEventListener('click',e=>{ if(e.target===chat||e.target.closest('a')) chat.close(); });
}

const notify=(hook,body)=>fetch(hook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

/* Avisame de la 3ra edición: valida, manda los datos al webhook y muestra la confirmación.
   Si ya se anotó en este navegador, muestra la confirmación directo. */
const KEY='mktfest-aviso-3ra';
$$('form[data-aviso]').forEach(form=>{
  const box=form.parentNode, ok=$('.aviso-ok',box), err=$('.err',form), btn=$('button',form);
  const done=(nombre,focus)=>{
    form.hidden=true; ok.hidden=false;
    ok.innerHTML=`<strong>¡Listo${nombre?', '+nombre.split(' ')[0].replace(/[<>&"]/g,''):''}!</strong>Te avisamos por mail y por WhatsApp apenas abra la inscripción de la 3ra edición.`;
    if(focus) ok.focus();
  };
  try{ const saved=JSON.parse(localStorage.getItem(KEY)||'null'); if(saved) done(saved.nombre); }catch(e){}
  const fail=(input,msg)=>{ err.textContent=msg; input.setAttribute('aria-invalid','true'); input.focus(); };
  form.addEventListener('input',e=>{ e.target.removeAttribute('aria-invalid'); err.textContent=''; });
  form.addEventListener('submit',async e=>{
    e.preventDefault(); err.textContent='';
    const f=form.elements, nombre=f.nombre.value.trim().replace(/\s+/g,' '), email=f.email.value.trim(), tel=f.whatsapp.value.trim();
    if(nombre.split(' ').length<2) return fail(f.nombre,'Escribí tu nombre y apellido.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(f.email,'Revisá el email: le falta algo (por ejemplo, la @ o el dominio).');
    if(tel.replace(/\D/g,'').length<10) return fail(f.whatsapp,'El teléfono tiene que tener al menos 10 números, con la característica (por ejemplo, 11 2345 6789).');
    btn.disabled=true; btn.firstChild.textContent='Enviando… ';
    try{
      const r=await fetch(form.dataset.aviso,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({nombre,email,whatsapp:tel,evento:'Marketing Fest · 3ra edición',tipo:'aviso-3ra-edicion',origen:location.pathname,fecha:new Date().toISOString()})});
      if(!r.ok) throw 0;
      if(form.dataset.hook) notify(form.dataset.hook,{tipo:'aviso-3ra-edicion',asunto:'Alguien quiere que le avisen de la 3ra edición del Marketing Fest',campos:[['Nombre y apellido',nombre],['Email',email],['Teléfono (WhatsApp)',tel]],datos:{nombre,email,whatsapp:tel},origen:location.href,fecha:new Date().toISOString()}).catch(()=>{});
      try{ localStorage.setItem(KEY,JSON.stringify({nombre})); }catch(e){}
      window.dataLayer&&dataLayer.push({event:'aviso_3ra_edicion'});
      done(nombre,true);
    }catch(x){
      err.textContent='No pudimos guardar tus datos. Probá de nuevo en un rato o escribinos por Instagram a @senosfuedelasmanos.ok.';
      btn.disabled=false; btn.firstChild.textContent='Avisame ';
    }
  });
});

/* Formularios (capítulo del podcast, speaker, sponsor de la 3ra, Sumate):
   validan, mandan todo al webhook de n8n (que avisa por mail al equipo) y muestran la confirmación.
   Si el webhook no responde, ofrecen mandar lo mismo por WhatsApp, así no se pierde nada. */
$$('form[data-form]').forEach(form=>{
  const box=form.parentNode, ok=$('.aviso-ok',box), err=$('.err',form), btn=$('button[type=submit]',form), label=btn.firstChild.textContent;
  form.addEventListener('input',()=>{ $$('[aria-invalid]',form).forEach(x=>x.removeAttribute('aria-invalid')); err.textContent=''; });
  form.addEventListener('submit',async e=>{
    e.preventDefault(); err.textContent='';
    const campos=[], datos={};
    const fail=(el,focus=el)=>{ err.textContent=el.dataset.err; (el.closest('.check')||el).setAttribute('aria-invalid','true'); focus.focus(); };
    for(const el of $$('input:not([type=checkbox]),textarea,fieldset[data-group],input[type=checkbox][data-label]',form)){
      if(el.matches('fieldset')){
        const v=$$('input:checked',el).map(x=>x.value);
        if(el.hasAttribute('data-req')&&!v.length) return fail(el,$('input',el));
        if(v.length){ campos.push([el.dataset.label,v.join(', ')]); datos[el.dataset.group]=v.join(', '); }
        continue;
      }
      if(el.type==='checkbox'){ if(!el.checked) return fail(el); campos.push([el.dataset.label,'Sí']); datos[el.name]=true; continue; }
      let v=el.value.trim().replace(/[ \t]+/g,' ');
      if(el.type==='url'&&v&&!/^https?:\/\//.test(v)) v='https://'+v;
      const bad=(el.required&&!v)
        ||(el.name==='nombre'&&v.split(' ').length<2)
        ||(el.type==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        ||(el.type==='tel'&&v.replace(/\D/g,'').length<10)
        ||(el.dataset.min&&v.length<+el.dataset.min)
        ||(el.type==='url'&&v&&!/^https?:\/\/\S+\.\S+/.test(v));
      if(bad) return fail(el);
      if(v){ campos.push([el.dataset.label,v]); datos[el.name]=v; }
    }
    const first=(datos.nombre||'').split(' ')[0].replace(/[<>&"]/g,'');
    const wa=form.dataset.waBase+'?text='+encodeURIComponent(form.dataset.intro+'\n\n'+campos.map(([l,v])=>`${l}: ${v}`).join('\n'));
    let sent=false;
    if(form.dataset.hook){
      btn.disabled=true; btn.firstChild.textContent='Enviando… ';
      try{ const r=await notify(form.dataset.hook,{tipo:form.dataset.form,asunto:form.dataset.asunto,campos,datos,origen:location.href,fecha:new Date().toISOString()}); sent=r.ok; }catch(x){}
      btn.disabled=false; btn.firstChild.textContent=label;
    }
    window.dataLayer&&dataLayer.push({event:'formulario',tipo:form.dataset.form,enviado:sent});
    ok.innerHTML=sent
      ? `<strong>¡Gracias, ${first}!</strong>${form.dataset.ok}`
      : `<strong>¡Casi listo, ${first}!</strong>Tocá el botón para mandarnos tus datos por WhatsApp: ya van escritos.<div class="btns"><a class="cta ink" href="${wa}" target="_blank" rel="noopener">Mandar por WhatsApp</a></div>`;
    form.hidden=true; ok.hidden=false; ok.focus();
  });
});
