/* Offline shell: Chapter content is fully embedded in notes.html. */
const CACHE_NAME='dip-pros-standalone-volume-reader-v19-20261109';
const files=['./','./index.html','./notes.html','./assets/app.js','./assets/questions.json','./assets/style.css','./pdf.html','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await Promise.allSettled(files.map(f=>cache.add(f)));await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('dip-pros-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;
e.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);if(r.mode==='navigate'||u.pathname.endsWith('/app.js')){try{const res=await fetch(r);if(res.ok)await cache.put(r,res.clone());return res;}catch(e){return await cache.match(r,{ignoreSearch:true})||await cache.match('./index.html')||Response.error();}}const old=await cache.match(r,{ignoreSearch:true});if(old)return old;try{const res=await fetch(r);if(res.ok)await cache.put(r,res.clone());return res;}catch(e){return Response.error();}})());});
