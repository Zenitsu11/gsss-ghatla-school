"use client";
import Link from "next/link";
import { useState } from "react";

export default function PortalLogin() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");try{const r=await fetch("/api/portal/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password}),credentials:"same-origin"});const d=await r.json();if(!r.ok){setError(d.error||"लॉगिन नहीं हो सका।");return}window.location.href=d.role==="teacher"?"/portal/teacher":"/portal/student"}catch{setError("सर्वर से संपर्क नहीं हो पाया।")}finally{setLoading(false)}}
  return <main className="portal-shell"><div className="portal-card"><div className="portal-brand"><span>ग</span><div><b>GSSS GHATLA</b><small>विद्यार्थी एवं शिक्षक पोर्टल</small></div></div><h1>विद्यालय पोर्टल में लॉगिन</h1><p>शिक्षक उपस्थिति व गृहकार्य प्रबंधित करें। विद्यार्थी अपना गृहकार्य और उपस्थिति देखें।</p><form onSubmit={submit}><label>ई-मेल<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username"/></label><label>पासवर्ड<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label>{error&&<div className="portal-error">{error}</div>}<button disabled={loading}>{loading?"लॉगिन हो रहा है…":"लॉगिन करें"}</button></form><div className="portal-links"><Link href="/portal/signup">विद्यार्थी नया खाता बनाएँ</Link><Link href="/">← मुख्य वेबसाइट</Link></div></div></main>
}
