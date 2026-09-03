"use client";
import { useActionState, useEffect, useState } from "react";
import { addHomework, markAttendance } from "./actions";
import styles from "../portal.module.css";

type Student={id:string;full_name:string;class_name:string|null;roll_number:string|null};
type Homework={id:number;title:string;description:string;subject:string;class_name:string;due_date:string|null};
type ActionState={ok:boolean;message:string};
const initialState:ActionState={ok:false,message:""};

export default function TeacherPanel(){
  const [students,setStudents]=useState<Student[]>([]);
  const [homework,setHomework]=useState<Homework[]>([]);
  const [attState,attAction]=useActionState(markAttendance,initialState);
  const [hwState,hwAction]=useActionState(addHomework,initialState);
  const [attDate,setAttDate]=useState(new Date().toISOString().slice(0,10));
  const [hwKey,setHwKey]=useState(0);

  async function load(){
    const [s,h]=await Promise.all([
      fetch("/api/portal/students",{credentials:"include"}),
      fetch("/api/portal/homework",{credentials:"include"})
    ]);
    if(s.ok)setStudents((await s.json()).items);
    if(h.ok)setHomework((await h.json()).items);
  }

  useEffect(()=>{load()},[]);
  useEffect(()=>{if(hwState.ok){setHwKey(k=>k+1);load()}},[hwState.ok]);

  const message=attState.message||hwState.message;

  return <div className={styles.main}>
    <h1>शिक्षक डैशबोर्ड</h1>
    <p className={styles.muted}>गृहकार्य प्रकाशित करें और विद्यार्थियों की दैनिक उपस्थिति दर्ज करें।</p>
    <div className={styles.cards}>
      <div className={styles.stat}><small>विद्यार्थी</small><b>{students.length}</b></div>
      <div className={styles.stat}><small>गृहकार्य</small><b>{homework.length}</b></div>
      <div className={styles.stat}><small>आज</small><b>{new Date().toLocaleDateString("hi-IN")}</b></div>
    </div>
    {message&&<div className={message.includes("Unauthorized")||message.includes("required")?styles.error:styles.success}>{message}</div>}

    <section className={styles.panel}>
      <h2>दैनिक उपस्थिति</h2>
      <form className={styles.form} action={attAction}>
        <div className={styles.two}>
          <label>विद्यार्थी<select name="studentId" required><option value="">विद्यार्थी चुनें</option>{students.map(s=><option key={s.id} value={s.id}>{s.full_name} — {s.class_name||""} {s.roll_number?`(${s.roll_number})`:""}</option>)}</select></label>
          <label>तारीख<input name="attendanceDate" type="date" value={attDate} onChange={e=>setAttDate(e.target.value)} required/></label>
        </div>
        <div className={styles.two}>
          <label>स्थिति<select name="status" defaultValue="present"><option value="present">उपस्थित</option><option value="absent">अनुपस्थित</option><option value="late">विलंब से</option><option value="leave">अवकाश</option></select></label>
          <label>टिप्पणी<input name="note"/></label>
        </div>
        <button className={styles.button}>उपस्थिति सेव करें</button>
      </form>
    </section>

    <section className={styles.panel}>
      <h2>नया गृहकार्य</h2>
      <form key={hwKey} className={styles.form} action={hwAction}>
        <label>शीर्षक<input name="title" required/></label>
        <label>विवरण<textarea name="description" required/></label>
        <div className={styles.two}>
          <label>विषय<input name="subject" required/></label>
          <label>कक्षा<input name="className" required/></label>
        </div>
        <label>अंतिम तिथि<input name="dueDate" type="date"/></label>
        <button className={`${styles.button} ${styles.alt}`}>गृहकार्य प्रकाशित करें</button>
      </form>
    </section>
  </div>
}
