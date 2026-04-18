import { useState } from "react";

export default function CoKaKeysSetupGuide() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Create Account",
      content: "Sign up and verify your account.",
    },
    {
      title: "Connect Platform",
      content: "Link your social or selling platform.",
    },
    {
      title: "Start Selling",
      content: "Upload your product and launch.",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Setup Guide</h1>

      <div style={{ marginBottom: 20 }}>
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            style={{
              marginRight: 10,
              background: step === i + 1 ? "#000" : "#ccc",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div>
        <h2>{steps[step - 1].title}</h2>
        <p>{steps[step - 1].content}</p>
      </div>
    </div>
  );
}
