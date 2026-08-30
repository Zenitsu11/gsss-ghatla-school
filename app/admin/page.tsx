import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validSession } from "@/lib/session";
import LogoutButton from "./logout-button";
import ContentEditor from "./content-editor";
export default async function AdminPage(){const store=await cookies();if(!validSession(store.get("gsss_admin")?.value))redirect("/login");return <main className="dashboard"><header><div className="wrap dash-header"><div className="brand"><span className="crest">ग</span><span>रा.उ.मा.वि. <b>घातला</b><small>विद्यालय व्यवस्थापन</small></span></div><LogoutButton/></div></header><section className="wrap dash-main"><p className="eyebrow">विद्यालय लॉगिन</p><h1>प्रशासन डैशबोर्ड</h1><p>विद्यालय की मुख्य जानकारी, सूचनाएँ और गतिविधियाँ यहाँ से बदलें।</p><ContentEditor/></section></main>}
