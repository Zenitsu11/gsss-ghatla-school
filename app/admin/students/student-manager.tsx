"use client";
import { useEffect, useState } from "react";

type Student = { id:string; sr_no:string; full_name:string; class_name:string; section:string|null; roll_number:string|null; admission_date:string|null; active:boolean };
const empty = { sr_no:"", full_name:"", class_name:"", section:"A", roll_number:"", admission_date:"", active:true };

export default function StudentManager(){
  const [items,setItems]=useState<Student[]>([]); const [form,setForm]=useState(empty); const [editing,setEditing]=useState<string|null>(null); const [file,setFile]=useState<File|null>(null); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true); const r=await fetch("/api/admin/students"); const j=await r.json(); if(r.ok)setItems(j.items||[]); else setMsg(j.error||"लोड नहीं हुआ"); setLoading(false)};
  useEffect(()=>{load()},[]);
  const save=async(e:React.FormEvent)=>{e.preventDefault();setMsg(""); const r=await fetch("/api/admin/students",{method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(editing?{id:editing,...form}:form)}); const j=await r.json(); if(!r.ok){setMsg(j.error||"Save failed");return} setForm(empty);setEditing(null);setMsg("सहेज दिया गया");load()};
  const edit=(x:Student)=>{setEditing(x.id);setForm({sr_no:x.sr_no,full_name:x.full_name,class_name:x.class_name,section:x.section||"",roll_number:x.roll_number||"",admission_date:x.admission_date||"",active:x.active})};
  const remove=async(id:string)=>{if(!confirm("इस विद्यार्थी को हटाना है?"))return; const r=await fetch("/api/admin/students",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); const j=await r.json(); if(!r.ok)setMsg(j.error||"Delete failed"); else load()};
  const importFile=async()=>{if(!file)return;setMsg("Import हो रहा है…");const fd=new FormData();fd.append("file",file);const r=await fetch("/api/admin/students/import",{method:"POST",body:fd});const j=await r.json();if(!r.ok){setMsg(j.error||"Import failed");return}setMsg(`${j.imported} विद्यार्थी import/update हो गए`);setFile(null);load()};
  return <div style={{display:"grid",gap:24}}>
    <section style={{background:"#fff",padding:22,border:"1px solid #dfe5ea",borderRadius:12}}>
      <h2 style={{marginTop:0,color:"#063e76"}}>Shala Darpan Student Import</h2>
      <p>Shala Darpan की Excel सीधे यहाँ upload करें। केवल Class, Section, SRNO, Name, ClassRollNo और DOA जैसे आवश्यक fields लिए जाएंगे; sensitive fields import नहीं होंगे.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><input type="file" accept=".xlsx,.xls" onChange={e=>setFile(e.target.files?.[0]||null)}/><button type="button" onClick={importFile} disabled={!file} className="button dark">Excel Import करें</button></div>
    </section>
    <section style={{background:"#fff",padding:22,border:"1px solid #dfe5ea",borderRadius:12}}>
      <h2 style={{marginTop:0,color:"#063e76"}}>{editing?"विद्यार्थी संपादित करें":"विद्यार्थी जोड़ें"}</h2>
      <form onSubmit={save} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        <input placeholder="SR No." required value={form.sr_no} onChange={e=>setForm({...form,sr_no:e.target.value})}/><input placeholder="पूरा नाम" required value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/><input placeholder="कक्षा" required value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})}/><input placeholder="Section" value={form.section} onChange={e=>setForm({...form,section:e.target.value})}/><input placeholder="Roll No." value={form.roll_number} onChange={e=>setForm({...form,roll_number:e.target.value})}/><input type="date" value={form.admission_date} onChange={e=>setForm({...form,admission_date:e.target.value})}/>
        <div style={{gridColumn:"1/-1",display:"flex",gap:10}}><button className="button dark" type="submit">{editing?"Update":"Add Student"}</button>{editing&&<button type="button" className="button ghost" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}</div>
      </form>
    </section>
    {msg&&<p style={{background:"#eef6ff",padding:12,borderRadius:8}}>{msg}</p>}
    <section style={{background:"#fff",padding:22,border:"1px solid #dfe5ea",borderRadius:12,overflowX:"auto"}}>
      <h2 style={{marginTop:0,color:"#063e76"}}>विद्यार्थी सूची ({items.length})</h2>
      {loading?<p>लोड हो रहा है…</p>:<table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["SR No.","नाम","कक्षा","Section","Roll","DOA","स्थिति","Action"].map(h=><th key={h} style={{textAlign:"left",padding:10,borderBottom:"1px solid #ddd"}}>{h}</th>)}</tr></thead><tbody>{items.map(x=><tr key={x.id}>{[x.sr_no,x.full_name,x.class_name,x.section||"—",x.roll_number||"—",x.admission_date||"—",x.active?"Active":"Inactive"].map((v,i)=><td key={i} style={{padding:10,borderBottom:"1px solid #eee"}}>{v}</td>)}<td style={{padding:10,borderBottom:"1px solid #eee",whiteSpace:"nowrap"}}><button onClick={()=>edit(x)} className="button ghost">Edit</button> <button onClick={()=>remove(x.id)} className="button ghost">Delete</button></td></tr>)}</tbody></table>}
    </section>
  </div>
}
