import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Staff = {
  full_name: string;
  employee_id: string;
  designation: string;
  subject: string | null;
  joining_date: string;
};

// Safe public fields from the school's Shala Darpan staff export.
// Personal identifiers and contact details are intentionally not displayed.
const shalaDarpanStaff: Staff[] = [
  { full_name: "ANJU YADAV", employee_id: "RJAL199802007150", designation: "Teacher (III Gr.) Level 1", subject: null, joining_date: "11 June 2016" },
  { full_name: "ARJUN KAUSHIK", employee_id: "RJAL202102016782", designation: "Lab Assistant (III Gr.)", subject: null, joining_date: "3 November 2021" },
  { full_name: "ARVIND LAKHARA", employee_id: "RJAL202302040251", designation: "PET (III Gr.)", subject: null, joining_date: "15 September 2023" },
  { full_name: "DHANI RAM VERMA", employee_id: "RJAL199002011127", designation: "Senior Teacher (II Gr.)", subject: "English", joining_date: "29 August 2022" },
  { full_name: "GHANSHYAM DASS GUPTA", employee_id: "RJAL199702017964", designation: "Lecturer (I Gr.)", subject: "Physics (Science Stream)", joining_date: "16 May 2026" },
  { full_name: "KAILASH CHAND BASWAL", employee_id: "RJAL199202007958", designation: "Principal & Equivalent", subject: null, joining_date: "1 October 2019" },
  { full_name: "KAVITA TAXAK", employee_id: "RJAL200802009697", designation: "Teacher (III Gr.) Level 2", subject: "Mathematics / Science", joining_date: "24 September 2018" },
  { full_name: "MAHESH PAL", employee_id: "RJBW202108014232", designation: "Lecturer (I Gr.)", subject: "Biology (Science Stream)", joining_date: "12 January 2026" },
  { full_name: "NEELAM JAIN", employee_id: "RJAL199602011679", designation: "Senior Teacher (II Gr.)", subject: "Hindi", joining_date: "1 July 2019" },
  { full_name: "NEELAM MALIK", employee_id: "RJAL199802014674", designation: "Teacher (III Gr.) Level 1", subject: null, joining_date: "14 June 2016" },
  { full_name: "PAPPU RAM GURJAR", employee_id: "RJJS202020030880", designation: "Senior Teacher (II Gr.)", subject: "Sanskrit", joining_date: "27 December 2022" },
  { full_name: "RAGHUVEER SINGH", employee_id: "RJAL202302058780", designation: "Teacher (III Gr.) Level 2", subject: "English", joining_date: "9 October 2023" },
  { full_name: "RAJNESH KUMARI", employee_id: "RJAL200502024483", designation: "Teacher (III Gr.) Level 2", subject: "Hindi", joining_date: "22 June 2016" },
  { full_name: "SUNIL KUMAR GUPTA", employee_id: "RJAL201202030755", designation: "Senior Teacher (II Gr.)", subject: "Mathematics", joining_date: "29 December 2014" },
  { full_name: "SURESH KUMAR", employee_id: "RJAL199602011680", designation: "Staff Member", subject: null, joining_date: "4 July 2024" },
  { full_name: "URMILA BAI MEENA", employee_id: "RJAL201202026951", designation: "Lecturer (I Gr.)", subject: "Chemistry (Science Stream)", joining_date: "17 April 2025" },
  { full_name: "VARSHA SHEKHAWAT", employee_id: "RJAL202402111353", designation: "Staff Member", subject: null, joining_date: "19 June 2024" },
  { full_name: "VERSHA LOMAR", employee_id: "RJGA202035027557", designation: "Junior Assistant", subject: null, joining_date: "9 January 2021" },
  { full_name: "VIMLA YADAV", employee_id: "RJAL199502007651", designation: "Teacher (III Gr.) Level 1", subject: null, joining_date: "22 June 2016" },
];

export default async function Teachers() {
  const db = supabaseAdmin();
  const { data } = db
    ? await db.from("staff_posts").select("full_name,designation,subject,qualification,photo_url,display_order").eq("active", true).order("display_order")
    : { data: [] };

  const dbStaff = (data || []).map((x) => ({
    full_name: x.full_name,
    employee_id: "",
    designation: x.designation,
    subject: x.subject,
    joining_date: "",
    qualification: x.qualification,
    photo_url: x.photo_url,
  }));
  const staff = dbStaff.length ? dbStaff : shalaDarpanStaff;

  return (
    <main className="gov-site">
      <div className="gov-top"><div className="wrap"><span>राजस्थान सरकार | माध्यमिक शिक्षा विभाग</span><span><Link href="/">मुख्य पृष्ठ</Link> <Link href="/portal/login">पोर्टल लॉगिन</Link></span></div></div>
      <header className="gov-header wrap"><div className="ashoka">सत्यमेव<br />जयते</div><div><h1>राजकीय उच्च माध्यमिक विद्यालय, घातला</h1><p>शिक्षक एवं कर्मचारी विवरण</p></div></header>
      <nav className="gov-nav"><div className="wrap"><Link href="/">मुख्य पृष्ठ</Link><Link href="/teachers">शिक्षक / स्टाफ</Link><Link href="/gallery">फोटो गैलरी</Link><Link href="/portal/login">विद्यार्थी/शिक्षक पोर्टल</Link></div></nav>
      <section className="gov-section wrap">
        <h2>शिक्षक एवं कर्मचारी</h2><div className="under" />
        <p>विद्यालय परिवार के शैक्षणिक एवं सहयोगी स्टाफ का विवरण। यह सूची विद्यालय के Shala Darpan staff export से तैयार की गई है।</p>
        <div className="activity-grid">
          {staff.map((x, i) => <article key={`${x.full_name}-${i}`}>
            {x.photo_url ? <img src={x.photo_url} alt={x.full_name} style={{ width: "100%", height: 180, objectFit: "cover", marginBottom: 15 }} /> : <div style={{ height: 180, background: "#e9f0f5", display: "grid", placeItems: "center", fontSize: 40, color: "#063e76", marginBottom: 15 }}>शि</div>}
            <h3>{x.full_name}</h3>
            <p><b>{x.designation}</b>{x.subject ? ` · ${x.subject}` : ""}</p>
            {x.joining_date && <p>सेवा आरंभ: {x.joining_date}</p>}
            {"qualification" in x && x.qualification && <p>{x.qualification}</p>}
          </article>)}
        </div>
      </section>
      <footer className="gov-footer"><div className="wrap">© {new Date().getFullYear()} राजकीय उच्च माध्यमिक विद्यालय, घातला</div></footer>
    </main>
  );
}
