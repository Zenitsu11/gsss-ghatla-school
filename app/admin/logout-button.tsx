"use client";
import { useRouter } from "next/navigation";
export default function LogoutButton(){const router=useRouter();return <button className="logout" onClick={async()=>{await fetch("/api/logout",{method:"POST"});router.push("/")}}>Sign out</button>}
