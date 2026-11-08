(() => {
  'use strict';
  const meta = JSON.parse(document.getElementById('reader-data').textContent);
  const pageTotal=meta.pageCount, toc=meta.toc;
  const chapterData=JSON.parse(document.getElementById('chapter-map-data').textContent);
  const chapters=chapterData.chapters;
  const el=(id)=>document.getElementById(id);
  const pageEl=el('page-image'), viewport=el('reader-viewport'), wrapper=el('image-container');
  const chapter=el('chapter-name'), caption=el('page-caption'), pageInput=el('page-input');
  const storagePrefix='dip-pros-final-notes-v1-';
  // One-off migration from the original 72-page reader to Edition 2 (105 pages).
  const oldPageToNew=[1,2,4,5,6,7,8,9,11,12,13,14,19,20,21,22,23,24,25,26,32,33,34,35,36,38,39,40,41,42,43,48,49,50,51,52,57,58,59,60,61,65,66,67,68,69,70,71,74,75,76,77,79,80,81,82,83,86,87,88,89,92,93,94,95,97,98,99,100,102,103,104];
  try{
    const marker=storagePrefix+'edition2-map-done';
    if(localStorage.getItem(marker)!=='1'){
      const translate=n=>Number.isInteger(n)&&n>=1&&n<=72?oldPageToNew[n-1]:n;
      const prev=JSON.parse(localStorage.getItem(storagePrefix+'bookmarks')||'[]');
      if(Array.isArray(prev)) localStorage.setItem(storagePrefix+'bookmarks',JSON.stringify([...new Set(prev.map(v=>translate(Number(v))).filter(v=>v>=1&&v<=105))]));
      const oldLast=Number(localStorage.getItem(storagePrefix+'last'));
      if(Number.isInteger(oldLast)&&oldLast>=1&&oldLast<=72)localStorage.setItem(storagePrefix+'last',String(translate(oldLast)));
      localStorage.setItem(marker,'1');
    }
  }catch(e){ /* Reader is usable even if storage is unavailable. */ }
  let saved=[];
  try{saved=JSON.parse(localStorage.getItem(storagePrefix+'bookmarks'))||[];}catch(e){}
  if(!Array.isArray(saved))saved=[];
  saved=saved.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=pageTotal);
  const rawPage=new URLSearchParams(location.search).get('page');
  let lastSaved=1;try{lastSaved=Number(localStorage.getItem(storagePrefix+'last'))||1;}catch(e){}
  let current=Number(rawPage)||lastSaved;
  current=Math.max(1,Math.min(pageTotal,current));
  let zoom=1;
  // A single packed file replaces separate webp files (GitHub browser upload friendly).
  let packedIndex=null, packedBytes=null;
  const pageBlobs=new Map();
  function pageURL(n){
    if(!packedIndex || !packedBytes)return '';
    if(pageBlobs.has(n))return pageBlobs.get(n);
    const entry=packedIndex.offsets[n-1];
    if(!entry)return '';
    const chunk=new Uint8Array(packedBytes,entry[0],entry[1]);
    const objectURL=URL.createObjectURL(new Blob([chunk],{type:'image/webp'}));
    pageBlobs.set(n,objectURL);
    return objectURL;
  }
  async function loadPackedPages(){
    const status=el('offline-status');
    try{
      const [metaResponse,packResponse]=await Promise.all([
        fetch('assets/notebook-pages-index.json'),
        fetch('assets/notebook-pages.pack')
      ]);
      if(!metaResponse.ok || !packResponse.ok)throw new Error('Notebook page file unavailable');
      const meta=await metaResponse.json();
      const bytes=await packResponse.arrayBuffer();
      if(meta.pages!==pageTotal || meta.offsets.length!==pageTotal)throw new Error('Invalid notebook page index');
      const last=meta.offsets[pageTotal-1];
      if(last[0]+last[1]!==bytes.byteLength)throw new Error('Notebook page bundle is incomplete');
      packedIndex=meta;packedBytes=bytes;
      update();
      status.textContent='Notebook loaded · all '+pageTotal+' pages available.';
    }catch(err){
      status.textContent='Unable to load the notebook. Please refresh, confirm the two notebook-pages files were uploaded together, or read the separate PDF.';
      pageEl.alt='Notebook page data could not load.';
    }
  }
  const htmlEscape=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const questionLink=(id,page)=>'index.html?question='+encodeURIComponent(id)+'&from='+page;
  const practiceLink=(ids,page)=>'index.html?practice='+encodeURIComponent(ids.join(','))+'&from='+page;
  function topicHTML(t){
    const allIds=t.questions||[];
    return `<div class="chapter-topic"><div class="chapter-topic-title">${htmlEscape(t.title)}</div><div class="chapter-topic-meta">Volume I p. ${t.page} · ${allIds.length} selected matching SBAs</div>
    <div class="chapter-topic-actions"><a class="chapter-link" href="notes.html?page=${t.page}#notebook">Read these notes →</a>${allIds.length?`<a class="chapter-link primary" href="${practiceLink(allIds,t.page)}">Practise ${allIds.length} SBAs →</a>`:''}</div>
    <div class="chapter-question-links" aria-label="Specific linked questions">${allIds.map(id=>`<a href="${questionLink(id,t.page)}" title="Open question ${id} in Volume II">Q${id}</a>`).join('')}</div></div>`;
  }
  const grid=el('chapter-grid');
  grid.innerHTML=chapters.map(c=>`<details class="chapter-card" id="chapter-${c.unit}"><summary><span class="chapter-number">${String(c.unit).padStart(2,'0')}</span><span>${htmlEscape(c.title)}</span></summary><div class="chapter-card-content"><div class="chapter-card-actions"><a class="chapter-link primary" href="notes.html?page=${c.page}#notebook">Read Chapter ${c.unit} →</a><a class="chapter-link" href="notes.html?page=${106+c.unit}#notebook">Chapter study map (PDF p. ${106+c.unit}) →</a><a class="chapter-link" href="index.html?chapter=${c.unit}&from=${c.page}">All ${c.allQuestionCount} chapter SBAs →</a></div>${c.topics.map(topicHTML).join('')}</div></details>`).join('');
  const chapterSelect=el('chapter-select');
  chapterSelect.innerHTML='<option value="0">Choose chapter…</option>'+chapters.map(c=>`<option value="${c.unit}">${String(c.unit).padStart(2,'0')} · ${htmlEscape(c.title)}</option>`).join('');
  chapterSelect.addEventListener('change',()=>{const c=chapters.find(x=>x.unit===Number(chapterSelect.value));if(c)goto(c.page);});
  function currentChapter(){if(current>=107&&current<=120)return chapters[current-107];if(current===106)return chapters[0];let c=null;for(const ch of chapters){if(ch.page<=current)c=ch;else break;}return c||chapters[0];}
  function renderChapterPanel(){
    const c=currentChapter();
    chapterSelect.value=String(c.unit);
    el('chapter-previous').disabled=c.unit===1;
    el('chapter-next').disabled=c.unit===chapters.length;
    const panel=el('chapter-study-panel');
    const related=c.topics.filter((t,i)=>t.page<=current || i===0);
    const focused=(related.length?related.at(-1):c.topics[0]);
    panel.innerHTML=`<h3>Chapter ${c.unit}: ${htmlEscape(c.title)}</h3><p>Currently showing p. ${current}. Use these links to go directly from these notes to their selected Volume II SBA questions.</p>
      ${focused?topicHTML(focused):''}<a class="chapter-link primary" href="index.html?chapter=${c.unit}&from=${c.page}">Practice all ${c.allQuestionCount} chapter SBAs →</a><a class="chapter-link" href="notes.html?page=${106+c.unit}#notebook">Full chapter study map (p. ${106+c.unit}) →</a>
      <a class="chapter-link" href="#chapter-${c.unit}" data-expand-chapter="${c.unit}">See all topics in this chapter ↑</a>`;
  }
  el('chapter-previous').addEventListener('click',()=>{const c=currentChapter();const target=chapters[c.unit-2];if(target)goto(target.page);});
  el('chapter-next').addEventListener('click',()=>{const c=currentChapter();const target=chapters[c.unit];if(target)goto(target.page);});
  el('chapter-study-panel').addEventListener('click',ev=>{const a=ev.target.closest('[data-expand-chapter]');if(a){const d=el('chapter-'+a.dataset.expandChapter);if(d)d.open=true;}});

  const sectionName=(page)=>{let name='Introduction';for(const entry of toc){if(entry.page>page)break;if(entry.level===1)name=entry.title;}return name;};
  const detailedName=(page)=>{let name='';for(const entry of toc){if(entry.page>page)break;name=entry.title;}return name;};
  function setSize(){const full=Math.max(240,viewport.clientWidth-26);const base=Math.min(860,full);wrapper.style.width=(base*zoom)+'px';el('zoom-value').textContent=Math.round(zoom*100)+'%';}
  function updateSaved(){
    saved=[...new Set(saved)].sort((a,b)=>a-b);try{localStorage.setItem(storagePrefix+'bookmarks',JSON.stringify(saved));}catch(e){}
    el('bookmark-btn').textContent=saved.includes(current)?'★ Saved page':'☆ Save page';
    el('saved-pages').innerHTML=saved.length?saved.map(n=>`<button class="saved-page" type="button" data-saved-page="${n}">Page ${n}</button>`).join(''):'<span>No pages saved yet. Use “Save page” above.</span>';
  }
  function update(){
    pageEl.src=pageURL(current);pageEl.alt=`Diploma in Prosthodontics final revision notebook, page ${current} of ${pageTotal}: ${detailedName(current)}`;
    pageInput.value=current;chapter.textContent=sectionName(current);
    caption.textContent=`Page ${current} of ${pageTotal} · ${detailedName(current)}`;
    for(const id of ['prev-btn','prev-bottom'])el(id).disabled=current===1;
    for(const id of ['next-btn','next-bottom'])el(id).disabled=current===pageTotal;
    updateSaved();renderChapterPanel();setSize();viewport.scrollTo({left:0,top:0});
    try{localStorage.setItem(storagePrefix+'last',String(current));}catch(e){}
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
      const cache=await caches.open('dip-pros-notes-v4');
      const files=['index.html','notes.html','assets/reader.css','assets/reader.js','assets/style.css','assets/app.js','assets/questions.json','assets/notebook-pages-index.json','assets/notebook-pages.pack'];
      for(let i=0;i<files.length;i+=3){
        await Promise.all(files.slice(i,i+3).map(async rel=>{
          try{const url=new URL(rel,location.href);const res=await fetch(url,{cache:'reload'});if(!res.ok)throw Error('HTTP '+res.status);await cache.put(url,res.clone());completed++;}
          catch(err){failed++;}
        }));
        status.textContent=`Saved ${completed} of ${files.length} resources${failed?' · '+failed+' failed':''}`;
      }
      status.textContent=failed===0?`All ${pageTotal} notebook pages and the question bank were saved to this device's browser cache. Offline availability still depends on Safari storage retention.`:`Saved ${completed} resources; ${failed} failed. Reconnect and retry, or save the PDF to Files.`;
    }catch(err){status.textContent='Could not complete offline saving. Please use the PDF download for reliable offline access.';}
    btn.disabled=false;
  });
  loadPackedPages();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
})();