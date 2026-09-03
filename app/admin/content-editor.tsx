"use client";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

type NoticeDraft = { id: string; date: string; title: string; important?: boolean };

const fieldStyle = { width: "100%", minHeight: 64, resize: "vertical" as const, padding: 12, boxSizing: "border-box" as const };

function noticesToText(notices: NoticeDraft[]) {
  return notices.map((n) => `${n.date} | ${n.title}`).join("\n\n");
}

function textToNotices(value: string): NoticeDraft[] {
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) => {
      const lines = block.split("\n");
      const first = lines.shift() || "";
      const [date, ...titleParts] = first.split("|");
      return { id: String(i + 1), date: date.trim(), title: [...titleParts, ...lines].join("\n").trim() };
    });
}

export default function ContentEditor() {
  const [data, setData] = useState<SiteContent | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((content: SiteContent) => {
      const activities = [...(content.activities || [])];
      if (!activities.includes("सूर्य नमस्कार")) activities.splice(Math.min(2, activities.length), 0, "सूर्य नमस्कार");
      setData({ ...content, activities });
    });
  }, []);

  if (!data) return <p>सामग्री लोड हो रही है…</p>;

  const set = (key: keyof SiteContent, value: string) => setData({ ...data, [key]: value });

  const save = async () => {
    setMessage("सहेजा जा रहा है…");
    const r = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setMessage(r.ok ? "✓ परिवर्तन स्थायी रूप से सहेज दिए गए हैं।" : "परिवर्तन सहेजे नहीं जा सके।");
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("फ़ाइल अपलोड हो रही है…");
    const f = new FormData();
    f.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: f });
    const d = await r.json();
    if (r.ok) {
      setData({ ...data, gallery: [...(data.gallery || []), d.url] });
      setMessage("फ़ाइल जुड़ गई है।");
    } else setMessage(d.error || "अपलोड नहीं हो सका।");
  };

  const removeUpload = async (url: string) => {
    if (!window.confirm("क्या आप इस अपलोड की गई फ़ाइल को स्थायी रूप से हटाना चाहते हैं?")) return;
    setMessage("फ़ाइल हटाई जा रही है…");
    const r = await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    const d = await r.json();
    if (r.ok) {
      setData({ ...data, gallery: (data.gallery || []).filter((x) => x !== url) });
      setMessage("✓ फ़ाइल स्थायी रूप से हटा दी गई है।");
    } else setMessage(d.error || "फ़ाइल हटाई नहीं जा सकी।");
  };

  return (
    <section className="editor">
      <h2>वेबसाइट सामग्री संपादित करें</h2>
      <p>यहाँ किया गया परिवर्तन वेबसाइट के मुख्य पृष्ठ पर दिखाई देगा। सभी टेक्स्ट बॉक्स में अब आप कई पंक्तियाँ लिख सकते हैं।</p>
      <div className="editor-grid">
        <label>विद्यालय का नाम<textarea rows={2} value={data.schoolName} onChange={e => set("schoolName", e.target.value)} style={fieldStyle} /></label>
        <label>स्थान<textarea rows={2} value={data.location} onChange={e => set("location", e.target.value)} style={fieldStyle} /></label>
        <label>प्रधानाचार्य का नाम<textarea rows={2} value={data.principal} onChange={e => set("principal", e.target.value)} style={fieldStyle} /></label>
        <label>यू-डाइस कोड<textarea rows={2} value={data.udise} onChange={e => set("udise", e.target.value)} style={fieldStyle} /></label>
        <label>दूरभाष<textarea rows={2} value={data.phone} onChange={e => set("phone", e.target.value)} style={fieldStyle} /></label>
        <label>ई-मेल<textarea rows={2} value={data.email} onChange={e => set("email", e.target.value)} style={fieldStyle} /></label>
        <label className="wide">पता<textarea rows={4} value={data.address} onChange={e => set("address", e.target.value)} style={fieldStyle} /></label>
        <label className="wide">विद्यालय परिचय<textarea rows={6} value={data.about} onChange={e => set("about", e.target.value)} style={fieldStyle} /></label>
        <label className="wide">प्रधानाचार्य का संदेश<textarea rows={5} value={data.principalMessage} onChange={e => set("principalMessage", e.target.value)} style={fieldStyle} /></label>
        <label className="wide">प्रवेश सूचना<textarea rows={5} value={data.admissionText} onChange={e => set("admissionText", e.target.value)} style={fieldStyle} /></label>
        <label className="wide">
          सूचनाएँ (हर अलग सूचना के बीच एक खाली लाइन रखें)
          <textarea rows={8} value={noticesToText(data.notices)} onChange={e => setData({ ...data, notices: textToNotices(e.target.value) })} placeholder={'29 अगस्त 2026 | नवीन प्रवेश संबंधी सूचना\nअधिक जानकारी के लिए कार्यालय से संपर्क करें।\n\n30 अगस्त 2026 | दूसरी सूचना'} style={fieldStyle} />
          <small>एक ही सूचना को कई पंक्तियों में लिख सकते हैं। अगली सूचना शुरू करने के लिए एक खाली लाइन छोड़ें।</small>
        </label>
        <label className="wide">
          गतिविधियाँ (एक लाइन में एक गतिविधि)
          <textarea rows={7} value={data.activities.join("\n")} onChange={e => setData({ ...data, activities: e.target.value.split("\n").map(x => x.trim()).filter(Boolean) })} placeholder="प्रार्थना सभा एवं नैतिक शिक्षा\nखेलकूद एवं योग गतिविधियाँ\nसूर्य नमस्कार\nविज्ञान एवं कला प्रदर्शनी" style={fieldStyle} />
          <small>नई गतिविधि जोड़ने के लिए बस अगली लाइन में उसका नाम लिखें।</small>
        </label>
        <label className="wide">फोटो / दस्तावेज अपलोड करें<input type="file" accept="image/*,.pdf" onChange={upload} /></label>
        {(data.gallery || []).length > 0 && <div className="wide uploads">{(data.gallery || []).map((u, i) => <div key={u} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}><a href={u} target="_blank" rel="noreferrer">अपलोड की गई फ़ाइल {i + 1} ↗</a><button type="button" onClick={() => removeUpload(u)} style={{ background: "#b42318", color: "white", border: 0, padding: "7px 12px", borderRadius: 4, cursor: "pointer" }}>🗑️ हटाएँ</button></div>)}</div>}
      </div>
      <button className="save" onClick={save}>सभी परिवर्तन सहेजें</button>
      <span className="save-message">{message}</span>
    </section>
  );
}
