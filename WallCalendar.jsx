import { useState, useEffect, useRef, useCallback } from "react";

const HOLIDAYS={"01-26":"Republic Day","03-25":"Holi","08-15":"Independence Day","10-02":"Gandhi Jayanti","10-20":"Diwali","12-25":"Christmas"};
const MOON=["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WDAYS=["MON","TUE","WED","THU","FRI","SAT","SUN"];
const EVC=["#f43f5e","#fb923c","#facc15","#4ade80","#60a5fa","#c084fc","#f472b6"];

function mp(y,m,d){const mo=m+1,yr=mo<=2?y-1:y,mn=mo<=2?mo+12:mo,A=Math.floor(yr/100),B=2-A+Math.floor(A/4),jd=Math.floor(365.25*(yr+4716))+Math.floor(30.6001*(mn+1))+d+B-1524.5,p=((jd-2451550.1)/29.530588861)%1;return MOON[Math.floor((p<0?p+1:p)*8)];}
function fmt(d){return `${SHORT[d.getMonth()]} ${d.getDate()}`;}
function ek(y,m,d){return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,30px) scale(.95)}}
@keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,40px) scale(1.08)}66%{transform:translate(40px,-20px) scale(.93)}}
@keyframes sUp{0%{opacity:0;transform:translateY(60px) scale(.94)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes pIn{from{opacity:0;transform:scale(.85) translateY(-10px)}to{opacity:1;transform:none}}
.blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.32;pointer-events:none}
.blob1{width:600px;height:600px;background:radial-gradient(circle,#6366f1,transparent 70%);top:-200px;left:-150px;animation:blob1 12s ease-in-out infinite}
.blob2{width:500px;height:500px;background:radial-gradient(circle,#a855f7,transparent 70%);bottom:-150px;right:-100px;animation:blob2 15s ease-in-out infinite}
.c-enter{animation:sUp .7s cubic-bezier(.16,1,.3,1) forwards}
.c-hide{opacity:0;transform:translateY(60px) scale(.94)}
.pop-in{animation:pIn .22s cubic-bezier(.34,1.56,.64,1) forwards}
@media(max-width:768px){.cmain{grid-template-columns:1fr!important}.chero{min-height:240px!important}.bind-dot:nth-child(n+9){display:none!important}}
.flip{transform:rotateY(90deg);transition:transform 160ms ease}.unflip{transform:rotateY(0);transition:transform 160ms ease}
.dc{position:relative;aspect-ratio:1/1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:12px;cursor:pointer;user-select:none;transition:all .18s cubic-bezier(.16,1,.3,1)}
.dc:hover{background:rgba(99,102,241,.15)!important;transform:scale(1.07);z-index:2}
.dc:active{transform:scale(.91)}
.pp{position:absolute;top:2px;right:2px;width:17px;height:17px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;border:none;font-size:14px;line-height:1;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;display:flex;align-items:center;justify-content:center;z-index:10;font-weight:700;box-shadow:0 2px 8px rgba(99,102,241,.5)}
.dc:hover .pp{opacity:1;pointer-events:all}
.pp:hover{transform:scale(1.25)!important;box-shadow:0 4px 14px rgba(99,102,241,.7)!important}
.nbtn{border:none;border-radius:50%;width:34px;height:34px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.nbtn:hover{transform:scale(1.18);background:rgba(99,102,241,.3)!important}
.ybtn{border:none;border-radius:8px;padding:4px 9px;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.4px}
.ybtn:hover{transform:scale(1.08);background:rgba(99,102,241,.25)!important}
.tbtn{border:none;border-radius:999px;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:.4px;transition:all .2s}
.tbtn:hover{transform:scale(1.05)}
.cnotes{width:100%;border-radius:14px;padding:12px 14px;font-size:13px;line-height:1.7;resize:none;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .25s}
.cnotes:focus{box-shadow:0 0 0 3px rgba(99,102,241,.35)!important}
.cnotes::placeholder{opacity:.35}
.ei{width:100%;border-radius:10px;padding:10px 14px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .2s}
.ei:focus{box-shadow:0 0 0 3px rgba(99,102,241,.35)!important}
.ui{width:100%;border-radius:8px;padding:8px 12px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .2s}
.ui:focus{box-shadow:0 0 0 2px rgba(99,102,241,.35)!important}
.sw{width:24px;height:24px;border-radius:50%;cursor:pointer;transition:all .15s;flex-shrink:0}
.sw:hover{transform:scale(1.25)}
.eb{border:none;border-radius:10px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s}
.eb:hover{transform:translateY(-1px)}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(99,102,241,.4);border-radius:99px}
`;

export default function WallCalendar() {
  const today=new Date();
  const [year,setYear]=useState(today.getFullYear());
  const [month,setMonth]=useState(today.getMonth());
  const [sDate,setSDate]=useState(null);
  const [eDate,setEDate]=useState(null);
  const [hov,setHov]=useState(null);
  const [notes,setNotes]=useState("");
  const [flip,setFlip]=useState(false);
  const [dark,setDark]=useState(true);
  const [vis,setVis]=useState(false);
  const [evs,setEvs]=useState({});
  const [modal,setModal]=useState(null);
  const [mIn,setMIn]=useState("");
  const [mCol,setMCol]=useState(EVC[0]);
  const [custImg,setCustImg]=useState(null);
  const [imgErr,setImgErr]=useState(false);
  const [imgPanel,setImgPanel]=useState(false);
  const [urlIn,setUrlIn]=useState("");
  const [loadingImg,setLoadingImg]=useState(false);
  const nav=useRef(null);
  const noted=useRef(false);
  const mRef=useRef(null);
  const fileRef=useRef(null);
  const sk=`cal-notes-${year}-${String(month+1).padStart(2,"0")}`;

  useEffect(()=>{setTimeout(()=>setVis(true),80);},[]);
  useEffect(()=>{if(localStorage.getItem("cal-dark")==="0")setDark(false);},[]);
  useEffect(()=>{try{const s=localStorage.getItem("cal-evs");if(s)setEvs(JSON.parse(s));}catch(_){};},[]);
  useEffect(()=>{try{const s=localStorage.getItem("cal-img");if(s)setCustImg(s);}catch(_){};},[]);
  useEffect(()=>{const s=localStorage.getItem(sk);setNotes(s!==null?s:"");},[sk]);
  useEffect(()=>{if(modal&&mRef.current)setTimeout(()=>mRef.current?.focus(),50);},[modal]);
  useEffect(()=>{
    if(noted.current||!Object.keys(evs).length||!("Notification"in window))return;
    noted.current=true;
    Notification.requestPermission().then(p=>{
      if(p!=="granted")return;
      for(let i=0;i<=7;i++){const d=new Date(today);d.setDate(d.getDate()+i);const k=ek(d.getFullYear(),d.getMonth(),d.getDate());
        if(evs[k])new Notification(i===0?`🎉 Today: ${evs[k].label}`:`⏰ In ${i} day${i>1?"s":""}: ${evs[k].label}`,{body:i===0?"Happening today!":`${SHORT[d.getMonth()]} ${d.getDate()}`});}
    });
  },[evs]);

  const saveEvs=e=>{setEvs(e);try{localStorage.setItem("cal-evs",JSON.stringify(e));}catch(_){}};
  const saveAndNav=useCallback((ny,nm)=>{
    try{localStorage.setItem(sk,notes);}catch(_){}
    setFlip(true);nav.current={ny,nm};
    setTimeout(()=>{setYear(nav.current.ny);setMonth(nav.current.nm);setImgErr(false);setTimeout(()=>setFlip(false),160);},160);
  },[sk,notes]);

  const fd=new Date(year,month,1).getDay(),off=fd===0?6:fd-1,dim=new Date(year,month+1,0).getDate();
  const cells=[...Array(off).fill(null),...Array.from({length:dim},(_,i)=>i+1)];
  const cd=d=>new Date(year,month,d);
  const isT=d=>today.getDate()===d&&today.getMonth()===month&&today.getFullYear()===year;
  const isS=d=>sDate&&cd(d).getTime()===sDate.getTime();
  const isE=d=>eDate&&cd(d).getTime()===eDate.getTime();
  const inR=d=>{const dt=cd(d);if(sDate&&eDate)return dt>sDate&&dt<eDate;if(sDate&&!eDate&&hov){const lo=sDate<hov?sDate:hov,hi=sDate<hov?hov:sDate;return dt>lo&&dt<hi;}return false;};
  const isH=d=>(!sDate||eDate)?false:hov&&cd(d).getTime()===hov.getTime();

  const handleCell=d=>{const c=new Date(year,month,d);
    if(!sDate||(sDate&&eDate)){setSDate(c);setEDate(null);setHov(null);}
    else if(c.getTime()===sDate.getTime()){setSDate(null);setEDate(null);setHov(null);}
    else if(c>sDate){setEDate(c);setHov(null);}
    else{setSDate(c);setEDate(null);setHov(null);}};

  const openModal=(day,e)=>{const k=ek(year,month,day),ex=evs[k];setMIn(ex?.label||"");setMCol(ex?.color||EVC[0]);setModal({key:k,day,rect:e.currentTarget.getBoundingClientRect()});};
  const saveEv=()=>{if(!modal)return;if(mIn.trim())saveEvs({...evs,[modal.key]:{label:mIn.trim(),color:mCol}});else{const{[modal.key]:_,...r}=evs;saveEvs(r);}setModal(null);};

  const applyUrl=async ()=>{
    const u=urlIn.trim();if(!u)return;
    let finalUrl=u;
    if(u.match(/^https?:\/\//) && !u.match(/\.(jpeg|jpg|gif|png|webp|mp4|webm)$/i) && !u.includes("youtube") && !u.includes("youtu.be") && !u.includes("spline.design")){
      setLoadingImg(true);
      try{
        const res=await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`);
        if(res.ok){
          const text=await res.text();
          const nodeMatch=text.match(/<meta[^>]+og:image[^>]+>/i);
          if(nodeMatch){
            const contentMatch=nodeMatch[0].match(/content=["']([^"']+)["']/i);
            if(contentMatch&&contentMatch[1]) finalUrl=contentMatch[1];
          }
        }
      }catch(e){}
      setLoadingImg(false);
    }
    setCustImg(finalUrl);setImgErr(false);try{localStorage.setItem("cal-img",finalUrl);}catch(_){};setUrlIn("");setImgPanel(false);
  };
  const clearImg=()=>{setCustImg(null);setImgErr(false);localStorage.removeItem("cal-img");setImgPanel(false);};
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setCustImg(ev.target.result);setImgErr(false);try{localStorage.setItem("cal-img",ev.target.result);}catch(_){};setImgPanel(false);};r.readAsDataURL(f);};

  const nc=sDate&&eDate?Math.round(Math.abs(eDate-sDate)/86400000):0;
  const nl=sDate&&eDate?`Notes for ${fmt(sDate)} – ${fmt(eDate)}`:`Notes for ${MONTHS[month]} ${year}`;
  const rs=sDate&&eDate?`${fmt(sDate)} – ${fmt(eDate)} · ${nc} night${nc!==1?"s":""}`:null;
  const mEvs=Object.entries(evs).filter(([k])=>k.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).sort(([a],[b])=>a.localeCompare(b));
  const heroSrc=custImg||`https://picsum.photos/seed/${year*100+month}/900/600`;
  let mPos={top:0,left:0};if(modal?.rect){const r=modal.rect,w=290;mPos={top:r.bottom+window.scrollY+10,left:Math.min(Math.max(r.left+r.width/2-w/2,8),window.innerWidth-w-8)};}

  const D=dark,tp=D?"#f1f5f9":"#000000",ts=D?"#94a3b8":"#444444";
  const nb=D?"rgba(255,255,255,.07)":"rgba(255,255,255,.8)";
  const ib=D?"rgba(255,255,255,.06)":"rgba(99,102,241,.05)";
  const ibr=D?"1.5px solid rgba(255,255,255,.1)":"1.5px solid rgba(99,102,241,.2)";
  const pb=D?"rgba(8,8,12,.95)":"rgba(255,255,255,.97)";
  const bdr=D?"1px solid rgba(255,255,255,.08)":"1px solid rgba(99,102,241,.15)";
  const btnGrad=D?"linear-gradient(135deg,#2563eb,#1d4ed8)":"linear-gradient(135deg,#4f46e5,#7c3aed)";

  return (
    <div onClick={e=>{if(modal&&!e.target.closest(".ev-modal"))setModal(null);if(imgPanel&&!e.target.closest(".img-panel")&&!e.target.closest(".img-btn"))setImgPanel(false);}}
      style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px",fontFamily:"'Plus Jakarta Sans',sans-serif",position:"relative",overflow:"hidden",
        background:D?"#02040a":"linear-gradient(135deg,#f0f0ff 0%,#e8eef8 50%,#f5f0ff 100%)"}}>
      <style>{CSS}</style>
      <div className="blob blob1" style={D?{background:"radial-gradient(circle,#1e3a8a,transparent 70%)",opacity:.15}:{}}/>
      <div className="blob blob2" style={D?{background:"radial-gradient(circle,#0f172a,transparent 70%)",opacity:.25}:{}}/>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>

      <div className={vis?"c-enter":"c-hide"} style={{width:"100%",maxWidth:1160,borderRadius:24,overflow:"hidden",backdropFilter:"blur(24px) saturate(180%)",background:pb,border:bdr,boxShadow:D?"0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.06)":"0 32px 80px rgba(99,102,241,.15),0 0 0 1px rgba(99,102,241,.1)",transition:"background .4s"}}>

        {/* Binding bar */}
        <div style={{display:"flex",alignItems:"center",padding:"13px 24px 11px",background:D?"rgba(255,255,255,.03)":"rgba(99,102,241,.04)",borderBottom:D?"1px solid rgba(255,255,255,.06)":"1px solid rgba(99,102,241,.1)",gap:16}}>
          <div style={{flex:1,display:"flex",justifyContent:"space-around"}}>
            {Array.from({length:20}).map((_,i)=>(
              <div key={i} className="bind-dot" style={{width:16,height:16,borderRadius:"50%",background:D?"linear-gradient(145deg,#f8fafc,#e2e8f0)":"linear-gradient(145deg,#ef4444,#b91c1c)",boxShadow:D?"inset 0 2px 4px rgba(255,255,255,.8),inset 0 -2px 4px rgba(0,0,0,.2),0 2px 4px rgba(0,0,0,.4)":"inset 0 2px 4px rgba(255,255,255,.5),inset 0 -2px 4px rgba(0,0,0,.2),0 2px 4px rgba(0,0,0,.2)"}}/>
            ))}
          </div>
          <button className="tbtn" onClick={()=>setDark(d=>{localStorage.setItem("cal-dark",!d?"1":"0");return !d;})}
            style={{flexShrink:0,background:D?"rgba(255,255,255,.08)":"rgba(99,102,241,.1)",color:D?"#e2e8f0":"#000000",border:bdr,whiteSpace:"nowrap"}}>
            {D?"☀️ Light mode":"🌙 Dark mode"}
          </button>
        </div>

        <div className="cmain" style={{display:"grid",gridTemplateColumns:"42% 58%",minHeight:580}}>

          {/* Hero */}
          <div className="chero" style={{position:"relative",overflow:"hidden",minHeight:520}}>
            {(() => {
              const src = custImg || heroSrc;
              const ytMatch = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
              if(ytMatch) return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytMatch[1]}`} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",border:"none"}} allow="autoplay; encrypted-media"/>;
              if(src.match(/\.(mp4|webm)$/i)) return <video src={src} autoPlay muted loop playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>;
              if(src.includes("spline.design")) return <iframe src={src} style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}/>;
              return !imgErr?<img src={src} alt="" onError={()=>setImgErr(true)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#6366f1,#a855f7,#3b82f6)"}}/>;
            })()}
            <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.2) 50%,transparent 100%)"}}/>

            {/* Change photo button */}
            <button className="img-btn" onClick={e=>{e.stopPropagation();setImgPanel(p=>!p);}}
              style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"7px 12px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,zIndex:10}}>
              🖼 Change Photo
            </button>

            {/* Image panel */}
            {imgPanel&&(
              <div className="img-panel pop-in" onClick={e=>e.stopPropagation()}
                style={{position:"absolute",top:52,right:14,width:275,background:pb,borderRadius:14,border:bdr,padding:16,zIndex:20,backdropFilter:"blur(20px)",boxShadow:"0 16px 48px rgba(0,0,0,.5)"}}>
                <p style={{fontSize:10,fontWeight:700,color:ts,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Hero Image</p>
                <button onClick={()=>fileRef.current?.click()} style={{width:"100%",background:btnGrad,color:"#fff",border:"none",borderRadius:10,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10}}>
                  📁 Upload from Device
                </button>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input className="ui" placeholder="Paste image URL (Pinterest, etc.)" value={urlIn} onChange={e=>setUrlIn(e.target.value)} onKeyDown={e=>{if(!loadingImg&&e.key==="Enter")applyUrl();}}
                    style={{flex:1,background:ib,border:ibr,color:tp}}/>
                  <button onClick={applyUrl} disabled={loadingImg} style={{background:loadingImg?"#64748b":btnGrad,color:"#fff",border:"none",borderRadius:8,padding:"0 12px",cursor:loadingImg?"wait":"pointer",fontWeight:700,fontSize:14}}>{loadingImg?"...":"→"}</button>
                </div>
                {custImg&&<button onClick={clearImg} style={{width:"100%",background:"rgba(244,63,94,.1)",color:"#f43f5e",border:"1px solid rgba(244,63,94,.25)",borderRadius:10,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer"}}>🗑 Remove Custom Image</button>}
              </div>
            )}

            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"32px 28px"}}>
              <p style={{color:"rgba(255,255,255,.55)",fontSize:12,fontWeight:600,letterSpacing:"3px",textTransform:"uppercase",marginBottom:4}}>{year}</p>
              <h1 style={{color:"#fff",fontSize:50,fontWeight:900,lineHeight:1,letterSpacing:"-2px",margin:"0 0 14px",textShadow:"0 4px 24px rgba(0,0,0,.4)",fontFamily:"'Playfair Display',serif"}}>{MONTHS[month]}</h1>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {mEvs.slice(0,3).map(([k,ev])=>(
                  <span key={k} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",borderRadius:999,padding:"4px 10px",fontSize:11,fontWeight:600,color:"#fff",border:"1px solid rgba(255,255,255,.2)"}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:ev.color,flexShrink:0}}/>{ev.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{padding:"26px 30px 30px",display:"flex",flexDirection:"column",gap:15,overflowY:"auto",maxHeight:"92vh"}}>

            {/* Year nav */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <button className="ybtn" onClick={()=>saveAndNav(year-1,month)} style={{background:nb,color:ts,border:D?"1px solid rgba(255,255,255,.1)":"1px solid rgba(99,102,241,.15)"}}>‹‹ {year-1}</button>
              <span style={{fontSize:14,fontWeight:800,color:tp}}>{year}</span>
              <button className="ybtn" onClick={()=>saveAndNav(year+1,month)} style={{background:nb,color:ts,border:D?"1px solid rgba(255,255,255,.1)":"1px solid rgba(99,102,241,.15)"}}>  {year+1} ››</button>
            </div>

            {/* Month nav */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <button className="nbtn" onClick={()=>month===0?saveAndNav(year-1,11):saveAndNav(year,month-1)} style={{background:nb,color:tp,border:D?"1px solid rgba(255,255,255,.1)":"1px solid rgba(99,102,241,.15)"}}>‹</button>
              <span style={{fontWeight:900,fontSize:24,color:tp,fontFamily:"'Playfair Display',serif"}}>{MONTHS[month]}</span>
              <button className="nbtn" onClick={()=>month===11?saveAndNav(year+1,0):saveAndNav(year,month+1)} style={{background:nb,color:tp,border:D?"1px solid rgba(255,255,255,.1)":"1px solid rgba(99,102,241,.15)"}}>›</button>
            </div>

            {/* Grid */}
            <div className={flip?"flip":"unflip"} style={{transformOrigin:"center"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:7}}>
                {WDAYS.map((d,i)=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:i>=5?"#f43f5e":ts,padding:"4px 0",letterSpacing:"1px"}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                {cells.map((day,i)=>{
                  if(day===null)return <div key={`e${i}`} style={{aspectRatio:"1/1"}}/>;
                  const col=i%7,wk=col===5||col===6,st=isS(day),en=isE(day),ir=inR(day),hv=isH(day),td=isT(day);
                  const hk=`${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const hol=!!HOLIDAYS[hk],ev=evs[ek(year,month,day)];
                  let bg="transparent",clr=wk?"#f43f5e":tp,bd2="none",sh="none";
                  if(st||en){bg=D?"linear-gradient(135deg,#2563eb,#1d4ed8)":"linear-gradient(135deg,#4f46e5,#7c3aed)";clr="#fff";sh=D?"0 4px 16px rgba(37,99,235,.5)":"0 4px 16px rgba(99,102,241,.5)";}
                  else if(ir){bg=D?"rgba(59,130,246,.15)":"rgba(99,102,241,.1)";}
                  else if(hv){bd2=D?"1.5px dashed #60a5fa":"1.5px dashed #818cf8";}
                  if(ev&&!st&&!en){bd2=`2px solid ${ev.color}`;sh=`0 0 10px ${ev.color}66`;}
                  else if(td&&!st&&!en){bd2=D?"2px solid #3b82f6":"2px solid #6366f1";sh=D?"0 0 12px rgba(59,130,246,.4)":"0 0 12px rgba(99,102,241,.4)";}
                  return (
                    <div key={day} className="dc" title={ev?ev.label:hol?HOLIDAYS[hk]:undefined}
                      onClick={()=>handleCell(day)}
                      onMouseEnter={()=>{if(sDate&&!eDate)setHov(cd(day));}}
                      onMouseLeave={()=>{if(sDate&&!eDate)setHov(null);}}
                      style={{background:bg,border:bd2,boxShadow:sh,fontWeight:td||st||en?700:400,color:clr}}>
                      <span style={{fontSize:13,lineHeight:1}}>{day}</span>
                      <span style={{fontSize:8,opacity:.7,marginTop:1}}>{mp(year,month,day)}</span>
                      <button className="pp" title="Pin event" onClick={e=>{e.stopPropagation();openModal(day,e);}}>+</button>
                      {ev&&<span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",background:ev.color,boxShadow:`0 0 6px ${ev.color}`}}/>}
                      {hol&&!ev&&<span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"#f43f5e"}}/>}
                    </div>
                  );
                })}
              </div>
            </div>

            {rs&&<div style={{fontSize:13,fontWeight:600,borderRadius:12,padding:"10px 16px",background:D?"linear-gradient(135deg,rgba(59,130,246,.12),rgba(29,78,216,.1))":"linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.1))",border:D?"1px solid rgba(59,130,246,.2)":"1px solid rgba(0,0,0,.1)",color:D?"#93c5fd":"#000000"}}>✦ {rs}</div>}

            {mEvs.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <span style={{fontSize:10,fontWeight:700,color:ts,textTransform:"uppercase",letterSpacing:"1.5px"}}>📌 Pinned Events</span>
                {mEvs.map(([k,ev])=>{const day=parseInt(k.split("-")[2]);return(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:9,background:D?"rgba(255,255,255,.04)":"rgba(99,102,241,.05)",borderRadius:10,padding:"7px 12px",border:D?"1px solid rgba(255,255,255,.06)":"1px solid rgba(99,102,241,.1)"}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:ev.color,boxShadow:`0 0 8px ${ev.color}`,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:700,color:D?"#60a5fa":"#6366f1",minWidth:22}}>{day}</span>
                    <span style={{fontSize:13,color:tp,flex:1}}>{ev.label}</span>
                    <button onClick={()=>{const{[k]:_,...r}=evs;saveEvs(r);}} style={{border:"none",background:"transparent",cursor:"pointer",fontSize:15,opacity:.4,color:tp,padding:0}}>×</button>
                  </div>
                );})}
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
              <label style={{fontSize:10,fontWeight:700,color:ts,textTransform:"uppercase",letterSpacing:"1px"}}>{nl}</label>
              <textarea className="cnotes" rows={4} value={notes} onChange={e=>{setNotes(e.target.value);try{localStorage.setItem(sk,e.target.value);}catch(_){}}} placeholder="Write something…"
                style={{background:D?"rgba(255,255,255,.04)":"rgba(99,102,241,.04)",border:D?"1.5px solid rgba(255,255,255,.08)":"1.5px solid rgba(99,102,241,.15)",color:tp,boxSizing:"border-box"}}/>
              {notes.length>0&&<span style={{fontSize:11,color:ts,textAlign:"right",opacity:.6}}>{notes.length} chars · saved</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Event modal */}
      {modal&&(
        <div className="ev-modal pop-in" style={{position:"fixed",top:mPos.top,left:mPos.left,width:290,background:pb,borderRadius:16,boxShadow:D?"0 24px 60px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.1)":"0 24px 60px rgba(99,102,241,.2)",border:bdr,padding:20,zIndex:1000,backdropFilter:"blur(20px)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:15}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:ts,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:2}}>📌 Pin Event</p>
              <span style={{fontWeight:800,fontSize:16,color:tp}}>{MONTHS[month]} {modal.day}, {year}</span>
            </div>
            <button onClick={()=>setModal(null)} style={{border:"none",background:D?"rgba(255,255,255,.08)":"rgba(99,102,241,.08)",cursor:"pointer",fontSize:13,color:ts,padding:"6px 8px",borderRadius:8}}>✕</button>
          </div>
          <input ref={mRef} className="ei" placeholder="e.g. Steve's birthday 🎂" value={mIn} onChange={e=>setMIn(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")saveEv();if(e.key==="Escape")setModal(null);}}
            style={{background:ib,border:ibr,color:tp,marginBottom:14}}/>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:17}}>
            <span style={{fontSize:11,fontWeight:700,color:ts}}>COLOR</span>
            {EVC.map(c=><div key={c} className="sw" onClick={()=>setMCol(c)} style={{background:c,boxShadow:mCol===c?`0 0 0 3px ${pb},0 0 0 5px ${c},0 0 12px ${c}66`:`0 2px 6px ${c}55`}}/>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="eb" onClick={saveEv} style={{flex:1,background:btnGrad,color:"#fff",boxShadow:D?"0 4px 16px rgba(37,99,235,.4)":"0 4px 16px rgba(99,102,241,.4)"}}>Save Event</button>
            {evs[modal.key]&&<button className="eb" onClick={()=>{const{[modal.key]:_,...r}=evs;saveEvs(r);setModal(null);}} style={{background:D?"rgba(244,63,94,.15)":"rgba(244,63,94,.08)",color:"#f43f5e",border:"1px solid rgba(244,63,94,.3)"}}>Remove</button>}
          </div>
          <p style={{marginTop:11,fontSize:11,color:ts,opacity:.7,lineHeight:1.5}}>💡 You'll get a browser notification when app opens on this day</p>
        </div>
      )}
    </div>
  );
}
