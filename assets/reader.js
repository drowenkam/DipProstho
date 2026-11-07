(() => {
  'use strict';
  const meta = JSON.parse(document.getElementById('reader-data').textContent);
  const pageTotal=meta.pageCount, toc=meta.toc;
  const el=(id)=>document.getElementById(id);
  const pageEl=el('page-image'), viewport=el('reader-viewport'), wrapper=el('image-container');
  const chapter=el('chapter-name'), caption=el('page-caption'), pageInput=el('page-input');
  const storagePrefix='dip-pros-final-notes-v1-';
  let saved=[];
  try{saved=JSON.parse(localStorage.getItem(storagePrefix+'bookmarks'))||[];}catch(e){}
  if(!Array.isArray(saved))saved=[];
  saved=saved.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=pageTotal);
  const rawPage=new URLSearchParams(location.search).get('page');
  let current=Number(rawPage)||Number(localStorage.getItem(storagePrefix+'last'))||1;
  current=Math.max(1,Math.min(pageTotal,current));
  let zoom=1;
  function pageURL(n){return 'assets/notes-pages/'+String(n).padStart(3,'0')+'.webp';}
  const htmlEscape=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sectionName=(page)=>{let name='Introduction';for(const entry of toc){if(entry.page>page)break;if(entry.level===1)name=entry.title;}return name;};
  const detailedName=(page)=>{let name='';for(const entry of toc){if(entry.page>page)break;name=entry.title;}return name;};
  function setSize(){const full=Math.max(240,viewport.clientWidth-26);const base=Math.min(860,full);wrapper.style.width=(base*zoom)+'px';el('zoom-value').textContent=Math.round(zoom*100)+'%';}
  function updateSaved(){
    saved=[...new Set(saved)].sort((a,b)=>a-b);localStorage.setItem(storagePrefix+'bookmarks',JSON.stringify(saved));
    el('bookmark-btn').textContent=saved.includes(current)?'★ Saved page':'☆ Save page';
    el('saved-pages').innerHTML=saved.length?saved.map(n=>`<button class="saved-page" type="button" data-saved-page="${n}">Page ${n}</button>`).join(''):'<span>No pages saved yet. Use “Save page” above.</span>';
  }
  function update(){
    pageEl.src=pageURL(current);pageEl.alt=`Diploma in Prosthodontics final revision notebook, page ${current} of ${pageTotal}: ${detailedName(current)}`;
    pageInput.value=current;chapter.textContent=sectionName(current);
    caption.textContent=`Page ${current} of ${pageTotal} · ${detailedName(current)}`;
    for(const id of ['prev-btn','prev-bottom'])el(id).disabled=current===1;
    for(const id of ['next-btn','next-bottom'])el(id).disabled=current===pageTotal;
    updateSaved();setSize();viewport.scrollTo({left:0,top:0});
    localStorage.setItem(storagePrefix+'last',String(current));
    try{history.replaceState(null,'','?page='+current);}catch(e){}
    for(const ahead of [1,-1,2]){const n=current+ahead;if(n>=1&&n<=pageTotal){const preload=new Image();preload.src=pageURL(n);}}
  }
  function goto(n){if(!Number.isInteger(n)||n<1||n>pageTotal){pageInput.value=current;return;}current=n;update();}
  function changeZoom(dir){zoom=Math.max(1,Math.min(3.5,Math.round((zoom+dir)*4)/4));setSize();}
  el('prev-btn').onclick=el('prev-bottom').onclick=()=>goto(current-1);
  el('next-btn').onclick=el('next-bottom').onclick=()=>goto(current+1);
  el('go-btn').onclick=()=>goto(Number(pageInput.value));
  pageInput.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();goto(Number(pageInput.value));}});
  el('zoom-in').onclick=()=>changeZoom(.25);
  el('zoom-out').onclick=()=>changeZoom(-.25);
  el('zoom-reset').onclick=()=>{zoom=1;setSize();};
  el('bookmark-btn').onclick=()=>{saved=saved.includes(current)?saved.filter(n=>n!==current):[...saved,current];updateSaved();};
  el('saved-pages').addEventListener('click',ev=>{const btn=ev.target.closest('[data-saved-page]');if(btn){goto(Number(btn.dataset.savedPage));el('notebook').scrollIntoView({behavior:'smooth'});}});
  const tocList=el('toc-list');
  tocList.innerHTML=toc.map((entry,i)=>`<button class="toc-entry ${entry.level===1?'section':'subsection'}" type="button" data-toc-page="${entry.page}" aria-label="Go to page ${entry.page}: ${htmlEscape(entry.title)}"><span>${htmlEscape(entry.title)}</span><span class="toc-page">p. ${entry.page}</span></button>`).join('');
  tocList.addEventListener('click',ev=>{const b=ev.target.closest('[data-toc-page]');if(b){goto(Number(b.dataset.tocPage));el('contents').open=false;el('notebook').scrollIntoView({behavior:'smooth'});}});
  window.addEventListener('resize',setSize);
  document.addEventListener('keydown',ev=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable)return;
    if(ev.key==='ArrowRight'){ev.preventDefault();goto(current+1);}
    if(ev.key==='ArrowLeft'){ev.preventDefault();goto(current-1);}
  });
  let x0=null,y0=null;
  viewport.addEventListener('touchstart',e=>{if(e.touches.length===1 && zoom===1){x0=e.touches[0].clientX;y0=e.touches[0].clientY;}else{x0=null;}},{passive:true});
  viewport.addEventListener('touchend',e=>{if(x0==null||e.changedTouches.length!==1)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.7)goto(current+(dx<0?1:-1));},{passive:true});
  el('offline-btn').addEventListener('click',async()=>{
    const status=el('offline-status'),btn=el('offline-btn');
    if(!('caches' in window)){status.textContent='Offline download is not supported in this browser. Use the original PDF in Files instead.';return;}
    btn.disabled=true;status.textContent='Saving pages…';
    let completed=0,failed=0;
    try{
      const cache=await caches.open('dip-pros-notes-v3');
      const files=['notes.html','assets/reader.css','assets/reader.js','assets/notes-volume-i.pdf', ...Array.from({length:pageTotal},(_,i)=>pageURL(i+1))];
      for(let i=0;i<files.length;i+=3){
        await Promise.all(files.slice(i,i+3).map(async rel=>{
          try{const url=new URL(rel,location.href);const res=await fetch(url,{cache:'reload'});if(!res.ok)throw Error('HTTP '+res.status);await cache.put(url,res.clone());completed++;}
          catch(err){failed++;}
        }));
        status.textContent=`Saved ${completed} of ${files.length} resources${failed?' · '+failed+' failed':''}`;
      }
      status.textContent=failed===0?'All 72 pages and the PDF were saved in this device’s browser cache. Offline availability still depends on Safari storage retention.':`Saved ${completed} resources; ${failed} failed. Reconnect and retry, or save the PDF to Files.`;
    }catch(err){status.textContent='Could not complete offline saving. Please use the PDF download for reliable offline access.';}
    btn.disabled=false;
  });
  update();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
})();