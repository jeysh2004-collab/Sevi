// Sevi backend: static site + Gnani.ai speech proxy (API key stays on the server). No dependencies, Node 18+.
const http=require('http'),fs=require('fs'),path=require('path');
try{for(const l of fs.readFileSync(path.join(__dirname,'.env'),'utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);if(m&&!l.trim().startsWith('#')&&!(m[1] in process.env))process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const E=process.env,PORT=+E.PORT||3000;
const GL=['en-IN','hi-IN','ta-IN','te-IN','kn-IN','ml-IN','bn-IN','mr-IN','gu-IN','pa-IN'];
const VO={};(E.GNANI_VOICES||'').split(',').forEach(p=>{const[a,b]=p.split(':');if(a&&b)VO[a.trim()]=b.trim()});
const hits=new Map(),limited=ip=>{const n=Date.now(),a=(hits.get(ip)||[]).filter(t=>n-t<60000);a.push(n);hits.set(ip,a);return a.length>400};
const body=(req,max)=>new Promise((ok,no)=>{const c=[];let n=0;req.on('data',d=>{n+=d.length;if(n>max){no(new Error('too large'));req.destroy()}else c.push(d)});req.on('end',()=>ok(Buffer.concat(c)));req.on('error',no)});
const send=(res,code,o)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'};
http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Permissions-Policy','microphone=(self)');
 const url=new URL(req.url,'http://x'),P=url.pathname,ip=req.socket.remoteAddress;
 try{
  if(P.startsWith('/api/')){
   if(limited(ip))return send(res,429,{error:'Too many requests'});
   if(P==='/api/config')return send(res,200,{gnani:!!E.GNANI_API_KEY,gnaniLangs:GL});
   if(P==='/api/tts'&&req.method==='POST'){if(!E.GNANI_API_KEY)return send(res,503,{error:'no gnani key'});
    const j=JSON.parse((await body(req,20e3)).toString()||'{}'),lang=GL.includes(j.language)?j.language:'en-IN';
    const r=await fetch(E.GNANI_TTS_URL||'https://api.vachana.ai/api/v1/tts/inference',{method:'POST',signal:AbortSignal.timeout(25000),headers:{'Content-Type':'application/json','X-API-Key-ID':E.GNANI_API_KEY},body:JSON.stringify({text:String(j.text||'').slice(0,1200),voice:VO[lang]||E.GNANI_VOICE||'Nalini',model:'timbre-v2.5',language:lang,speed:1.0,audio_config:{sample_rate:24000,num_channels:1,sample_width:2,encoding:'linear_pcm',container:'wav'}})});
    if(!r.ok){console.error('Gnani TTS',r.status,await r.text());return send(res,502,{error:'Gnani TTS '+r.status})}
    res.writeHead(200,{'Content-Type':r.headers.get('content-type')||'audio/wav'});return res.end(Buffer.from(await r.arrayBuffer()))}
   if(P==='/api/stt'&&req.method==='POST'){if(!E.GNANI_API_KEY)return send(res,503,{error:'no gnani key'});const buf=await body(req,12e6);
    const r=await fetch(E.GNANI_STT_URL||'https://api.vachana.ai/stt/v3',{method:'POST',signal:AbortSignal.timeout(30000),headers:{'content-type':req.headers['content-type'],'X-API-Key-ID':E.GNANI_API_KEY},body:buf});
    const t=await r.text();if(!r.ok)console.error('Gnani STT',r.status,t);res.writeHead(r.status,{'Content-Type':'application/json'});return res.end(t)}
   return send(res,404,{error:'Not found'})}
  let p=path.normalize(decodeURIComponent(P)).replace(/^(\.\.[\/\\])+/,'');if(p==='/'||p==='\\')p='/index.html';
  const root=path.join(__dirname,'public'),f=path.join(root,p);if(!f.startsWith(root))return send(res,403,{error:'Forbidden'});
  fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});res.end(d)});
 }catch(e){console.error(e.message);send(res,500,{error:'Server error'})}
}).listen(PORT,()=>console.log(`Sevi running at http://localhost:${PORT}   Gnani voice: ${!!E.GNANI_API_KEY}`));
