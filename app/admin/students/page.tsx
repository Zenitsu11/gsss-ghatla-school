import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { validSession } from "@/lib/session";
import StudentManager from "./student-manager";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage(){
  if(!validSession((await cookies()).get("gsss_admin")?.value)) redirect("/login");
  return <main className="dashboard"><header><div className="wrap dash-header"><div className="brand"><span className="crest">ग</span><span>रा.उ.मा.वि. <b>घातला</b><small>विद्यार्थी प्रबंधन</small></span></div></div></header><section className="wrap dash-main"><Link href="/admin">← प्रशासन डैशबोर्ड</Link><p className="eyebrow" style={{marginTop:24}}>शाला दर्पण</p><h1>विद्यार्थी प्रबंधन</h1><p>यहाँ से Shala Darpan export import करके विद्यार्थी सूची को बाद में Admin द्वारा add, edit या delete किया जा सकता है। विद्यार्थी खुद को register नहीं करेंगे और teachers को master list maintain नहीं करनी होगी।</p><StudentManager/></section></main>
}
