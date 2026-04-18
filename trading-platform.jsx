import { useState, useEffect, useCallback, useRef } from "react";

const FONT =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap";

// ─────────────────────────────────────────
// MARKETS (UNIFIED + CLEAN)
// ─────────────────────────────────────────
const MARKETS = {
  Stocks: {
    color: "#10e5a0",
    tickers: ["AAPL", "MSFT", "NVDA", "AMD", "TSLA"],
  },
  Futures: {
    color: "#f59e0b",
    tickers: ["CME:ES1!", "COMEX:GC1!", "NYMEX:CL1!"],
  },
  Crypto: {
    color: "#f97316",
    tickers: ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT"],
  },
};

// ─────────────────────────────────────────
// SAFE AUDIO
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
// UTIL
// ─────────────────────────────────────────
const rand = (a, b) => Math.random() * (b - a) + a;

const formatSymbol = (s) =>
  s.includes(":") ? s : `NASDAQ:${s}`;

// ─────────────────────────────────────────
// SIGNAL ENGINE (SIMULATED)
// ─────────────────────────────────────────
function simulateSignal(symbol) {
  const entry = rand(1, 5);
  const target = entry * rand(1.5, 3);
  const stop = entry * rand(0.5, 0.8);

  return {
    id: Math.random().toString(36).slice(2),
    symbol,
    entry: entry.toFixed(2),
    target: target.toFixed(2),
    stop: stop.toFixed(2),
    pct: Math.round(((target - entry) / entry) * 100),
  };
}

// ─────────────────────────────────────────
// TRADINGVIEW CHART (FIXED + STABLE)
// ─────────────────────────────────────────
function TradingViewChart({ symbol, timeframe }) {
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
      symbol,
      interval: timeframe,
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#03050e",
      gridColor: "#0f1828",
      studies: ["STD;RSI", "STD;MACD"],
    });

    ref.current.appendChild(script);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [symbol, timeframe]);

  return <div ref={ref} style={{ height: "100%" }} />;
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function TradingPlatform() {
  const [signals, setSignals] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");
  const [timeframe, setTimeframe] = useState("5");
  const [scanning, setScanning] = useState(false);

  // RUN SCAN
  const runScan = useCallback(() => {
    setScanning(true);

    setTimeout(() => {
      const results = [];

      Object.values(MARKETS).forEach((mkt) => {
        mkt.tickers.forEach((t) => {
          results.push(simulateSignal(t));
        });
      });

      setSignals(results);
      setScanning(false);
      playAlert();
    }, 1200);
  }, []);

  useEffect(() => {
    runScan();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: "#03050e",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <link href={FONT} rel="stylesheet" />

      {/* ───────── LEFT PANEL ───────── */}
      <div
        style={{
          width: 320,
          borderRight: "1px solid #0f1828",
          padding: 12,
          overflowY: "auto",
        }}
      >
        {/* Controls */}
        <div style={{ marginBottom: 10 }}>
          <button onClick={runScan} disabled={scanning}>
            {scanning ? "Scanning..." : "Run Scan"}
          </button>
        </div>

        {/* Signals */}
        {signals.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSymbol(formatSymbol(s.symbol))}
            style={{
              padding: 10,
              marginBottom: 8,
              border: "1px solid #0f1828",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{s.symbol}</div>
            <div style={{ fontSize: 12 }}>
              Entry ${s.entry} → ${s.target}
            </div>
            <div style={{ color: "#10e5a0" }}>+{s.pct}%</div>
          </div>
        ))}
      </div>

      {/* ───────── RIGHT PANEL (CHART) ───────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div
          style={{
            padding: 10,
            borderBottom: "1px solid #0f1828",
            display: "flex",
            gap: 6,
          }}
        >
          {["1", "5", "15", "60", "D"].map((tf) => (
            <button key={tf} onClick={() => setTimeframe(tf)}>
              {tf}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{ flex: 1 }}>
          <TradingViewChart
            symbol={selectedSymbol}
            timeframe={timeframe}
          />
        </div>
      </div>
    </div>
  );
}
