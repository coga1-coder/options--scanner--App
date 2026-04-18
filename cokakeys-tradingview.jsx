import { useState, useEffect, useCallback, useRef } from "react";

const FONT =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700;800&display=swap";

// ─────────────────────────────────────────────────────────────
// MARKETS (normalized symbols)
// ─────────────────────────────────────────────────────────────
const MARKETS = {
  "S&P 500": {
    color: "#10e5a0",
    tickers: [
      { s: "SPY" },
      { s: "AAPL" },
      { s: "MSFT" },
      { s: "NVDA" },
    ],
  },
  Futures: {
    color: "#f59e0b",
    tickers: [
      { s: "GC", tv: "COMEX:GC1!", label: "Gold" },
      { s: "CL", tv: "NYMEX:CL1!", label: "Oil" },
      { s: "ES", tv: "CME:ES1!", label: "S&P Futures" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// SAFE AUDIO CONTEXT (fixed leak)
// ─────────────────────────────────────────────────────────────
let audioCtx;
function playAlert() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.frequency.value = 600;
    g.gain.value = 0.05;
    o.start();
    o.stop(audioCtx.currentTime + 0.2);
  } catch {}
}

// ─────────────────────────────────────────────────────────────
// TRADINGVIEW CHART (FIXED)
// ─────────────────────────────────────────────────────────────
function TradingViewChart({ symbol }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = `<div class="tv-widget"></div>`;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "5",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#03050e",
      gridColor: "#0f1828",
      studies: ["STD;RSI"],
    });

    ref.current.appendChild(script);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [symbol]);

  return <div ref={ref} style={{ height: "100%" }} />;
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [symbol, setSymbol] = useState("NASDAQ:AAPL");

  const formatSymbol = (s) =>
    s.includes(":") ? s : `NASDAQ:${s}`;

  const runScan = useCallback(() => {
    playAlert();
  }, []);

  return (
    <div style={{ height: "100vh", background: "#03050e", color: "#fff" }}>
      <link href={FONT} rel="stylesheet" />

      {/* Controls */}
      <div style={{ padding: 10 }}>
        <input
          placeholder="AAPL or NASDAQ:AAPL"
          onChange={(e) => setSymbol(formatSymbol(e.target.value))}
        />
        <button onClick={runScan}>Scan</button>
      </div>

      {/* Chart */}
      <div style={{ height: "90%" }}>
        <TradingViewChart symbol={symbol} />
      </div>
    </div>
  );
}
