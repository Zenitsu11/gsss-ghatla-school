import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage(){
  return (
    <main className="login-page">
      <section className="login-card">
        <Link href="/" className="brand"><span className="crest">G</span><span>GSSS <b>GHATLA</b><small>Government Senior Secondary School</small></span></Link>
        <h1>Staff portal</h1>
        <p>Sign in to access the school administration dashboard.</p>
        <LoginForm/>
        <Link href="/portal/login" className="back">Teacher / Student Portal →</Link>
        <Link href="/" className="back">← Back to school website</Link>
      </section>
    </main>
  )
}
