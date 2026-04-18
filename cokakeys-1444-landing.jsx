import { useState } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap";

export default function CoKaKeysLanding() {
  const [activeTab, setActiveTab] = useState("whop");
  const [socialPlatform, setSocialPlatform] = useState("twitter");

  const C = {
    bg:"#03050e", surface:"#07091a", card:"#0b0f20",
    border:"#0f1828", green:"#10e5a0", gold:"#f59e0b",
    red:"#f43f5e", blue:"#38bdf8", purple:"#a78bfa",
    text:"#f1f5f9", mid:"#94a3b8", dim:"#334155",
  };

  const SOCIAL_CONTENT = {
    twitter: ["Post 1", "Post 2"],
    instagram: ["IG Post 1"],
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      
      {/* ✅ Fixed font import */}
      <link href={FONT} rel="stylesheet" />

      <style>{`
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:3px; }
      `}</style>

      <div style={{ padding: 20 }}>
        <h1>CoKaKeys Dashboard</h1>

        <Section title="Social Content">
          {SOCIAL_CONTENT[socialPlatform]?.map((item, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              {item}
              <CopyButton text={item} />
            </div>
          ))}
        </Section>
      </div>

    </div>
  );
}

/* ✅ Fallback Components (prevent crashes) */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function CopyButton({ text }) {
  return (
    <button onClick={() => navigator.clipboard.writeText(text)}>
      Copy
    </button>
  );
}
