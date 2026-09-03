import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { shalaDarpanStaff, type ShalaDarpanStaff } from "@/lib/shala-darpan-staff";

export const dynamic = "force-dynamic";

type Staff = ShalaDarpanStaff & {
  qualification?: string | null;
  photo_url?: string | null;
};

export default async function Teachers() {
  const db = supabaseAdmin();
  const { data } = db
    ? await db.from("staff_posts").select("full_name,designation,subject,qualification,photo_url,display_order").eq("active", true).order("display_order")
    : { data: [] };

  const dbStaff: Staff[] = (data || []).map((x) => ({
    full_name: x.full_name,
    employee_id: "",
    designation: x.designation,
    subject: x.subject,
    joining_date: "",
    qualification: x.qualification,
    photo_url: x.photo_url,
  }));
  const staff: Staff[] = dbStaff.length ? dbStaff : shalaDarpanStaff;

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
            {x.qualification && <p>{x.qualification}</p>}
          </article>)}
        </div>
      </section>
      <footer className="gov-footer"><div className="wrap">© {new Date().getFullYear()} राजकीय उच्च माध्यमिक विद्यालय, घातला</div></footer>
    </main>
  );
}
