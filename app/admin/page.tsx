import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { validSession } from "@/lib/session";
import LogoutButton from "./logout-button";
import ContentEditor from "./content-editor";

export default async function AdminPage() {
  const store = await cookies();
  if (!validSession(store.get("gsss_admin")?.value)) redirect("/login");

  return (
    <main className="dashboard">
      <style>{`
        .admin-actions { display:flex; gap:12px; flex-wrap:wrap; margin:25px 0; }
        .admin-actions .button { border-radius:7px; min-height:46px; justify-content:center; }
        .admin-actions .button.ghost { color:#172b47; border:1px solid #9aa7b4; }
        @media (max-width:720px) {
          .dash-header { gap:14px; }
          .dash-main h1 { font-size:36px; line-height:1.1; }
          .dash-main { padding-top:30px; padding-bottom:45px; }
          .admin-actions { display:grid; grid-template-columns:1fr; gap:10px; margin:22px 0 30px; }
          .admin-actions .button { width:100%; padding:14px 16px; font-size:13px; }
        }
      `}</style>
      <header>
        <div className="wrap dash-header">
          <div className="brand">
            <span className="crest">ग</span>
            <span>रा.उ.मा.वि. <b>घातला</b><small>विद्यालय व्यवस्थापन</small></span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <section className="wrap dash-main">
        <p className="eyebrow">विद्यालय लॉगिन</p>
        <h1>प्रशासन डैशबोर्ड</h1>
        <p>विद्यालय की मुख्य जानकारी, सूचनाएँ, गतिविधियाँ और विद्यार्थी रिकॉर्ड यहाँ से बदलें।</p>
        <div className="admin-actions">
          <Link href="/admin/portal" className="button dark">शिक्षक खाता प्रबंधन →</Link>
          <Link href="/admin/students" className="button dark">विद्यार्थी प्रबंधन →</Link>
          <Link href="/admin/gallery" className="button dark">फोटो गैलरी प्रबंधन →</Link>
          <Link href="/teachers" className="button ghost">सार्वजनिक स्टाफ देखें →</Link>
          <Link href="/gallery" className="button ghost">सार्वजनिक गैलरी देखें →</Link>
          <Link href="/portal/login" className="button ghost">पोर्टल देखें →</Link>
        </div>
        <ContentEditor />
      </section>
    </main>
  );
}
