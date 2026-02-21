const CACHE='osp-lazy-admin-fixed-v1';
const ASSETS=['./','./index.html','./manifest.json','./sw.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  if(req.mode==='navigate'){
    e.respondWith(caches.match('./index.html').then(r=>r||fetch(req)));
    return;
  }
  const url=new URL(req.url);
  if(url.origin===location.origin){
    e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(req,copy));
      return resp;
    }).catch(()=>cached)));
  }
});