import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
const app=express(), dir=path.dirname(fileURLToPath(import.meta.url));
app.use(helmet({crossOriginResourcePolicy:{policy:"cross-origin"}}));
app.use(express.json({limit:"12kb"}));
app.use(express.static(path.join(dir,"public")));
app.use("/api/",rateLimit({windowMs:60000,limit:20,standardHeaders:"draft-7",legacyHeaders:false}));
const hosts=["terabox.com","teraboxshare.com","1024terabox.com","teraboxapp.com","share.google"];
function validUrl(s){try{const u=new URL(s);return ["https:","http:"].includes(u.protocol)&&hosts.some(h=>u.hostname===h||u.hostname.endsWith("."+h))?u:null}catch{return null}}
app.post("/api/resolve",async(req,res)=>{
 const u=typeof req.body?.url==="string"?validUrl(req.body.url.trim()):null;
 if(!u)return res.status(400).json({error:"Enter a valid supported share URL."});
 const endpoint=process.env.TERABOX_RESOLVER_URL,key=process.env.TERABOX_RESOLVER_API_KEY;
 if(!endpoint||!key)return res.status(503).json({error:"Backend is ready, but no authorized resolver is configured.",detail:"Set TERABOX_RESOLVER_URL and TERABOX_RESOLVER_API_KEY on the backend host. GitHub Pages alone cannot extract a playable URL."});
 try{
  const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({url:u.href}),signal:AbortSignal.timeout(20000)});
  if(!r.ok)return res.status(502).json({error:`Resolver returned HTTP ${r.status}.`});
  const d=await r.json(),files=(Array.isArray(d.files)?d.files:[]).filter(f=>{try{return typeof f.url==="string"&&new URL(f.url).protocol==="https:"}catch{return false}}).map((f,i)=>({id:String(f.id??i),name:String(f.name??`File ${i+1}`).slice(0,240),type:String(f.type??"unknown"),size:Number.isFinite(Number(f.size))?Number(f.size):null,url:f.url,downloadUrl:typeof f.downloadUrl==="string"&&f.downloadUrl.startsWith("https://")?f.downloadUrl:f.url}));
  res.json({title:String(d.title??"Shared files").slice(0,240),files});
 }catch(e){res.status(502).json({error:"Could not contact resolver.",detail:e.name==="TimeoutError"?"Resolver timed out.":"Check backend and resolver settings."})}
});
app.get("/health",(_,res)=>res.json({ok:true}));
app.listen(Number(process.env.PORT||3000),()=>console.log("CloudVideo running"));
