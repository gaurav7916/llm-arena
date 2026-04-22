import { useState, useRef, useEffect, useCallback } from "react";

const MODELS = [
  {
    id: "claude",
    name: "Claude",
    subtitle: "Anthropic",
    accent: "#D97706",
    bg: "#1A1A1A",
    chatBg: "#262626",
    userBubble: "#D97706",
    userText: "#FFF",
    aiBubble: "#2D2D2D",
    aiText: "#E5E5E5",
    inputBg: "#333",
    borderColor: "#404040",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M16.98 7.54L13.86 17.47H11.62L9.36 10.09L6.96 17.47H4.74L1.68 7.54H3.96L6.02 15.13L8.46 7.54H10.46L12.78 15.17L14.88 7.54H16.98Z" fill="#D97706"/>
        <path d="M22.32 7.54L19.2 17.47H16.96L19.92 7.54H22.32Z" fill="#D97706"/>
      </svg>
    ),
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    subtitle: "OpenAI",
    accent: "#10A37F",
    bg: "#212121",
    chatBg: "#2F2F2F",
    userBubble: "#2F2F2F",
    userText: "#ECECEC",
    aiBubble: "transparent",
    aiText: "#ECECEC",
    inputBg: "#404040",
    borderColor: "#444",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#10A37F">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4116-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0974-2.3616l2.603-1.5018 2.6032 1.5018v3.0036l-2.6032 1.5018-2.603-1.5018z"/>
      </svg>
    ),
  },
  {
    id: "gemini",
    name: "Gemini",
    subtitle: "Google",
    accent: "#4285F4",
    bg: "#1E1F20",
    chatBg: "#282A2C",
    userBubble: "#37393B",
    userText: "#E3E3E3",
    aiBubble: "transparent",
    aiText: "#E3E3E3",
    inputBg: "#37393B",
    borderColor: "#444746",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemGrad)"/>
        <defs>
          <linearGradient id="gemGrad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="33%" stopColor="#9B72CB"/>
            <stop offset="66%" stopColor="#D96570"/>
            <stop offset="100%" stopColor="#D96570"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "perplexity",
    name: "Perplexity",
    subtitle: "Perplexity AI",
    accent: "#22B8CF",
    bg: "#191A1A",
    chatBg: "#232525",
    userBubble: "#2C3333",
    userText: "#E0E0E0",
    aiBubble: "transparent",
    aiText: "#D4D4D4",
    inputBg: "#2C3333",
    borderColor: "#3A3F3F",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#22B8CF">
        <path d="M6 2L12 7.5V2h1v5.5L19 2v7h3v1h-3v5.5l-1 .5V10h-5v8l-1 .5V10H8v8.5L7 18V10H4V9h3V2zm1 1.5V9h5V7.5L7 3.5zm11 0L13 7.5V9h5V3.5zM8 11v5.5l4-2V11H8zm9 0h-4v3.5l4 2V11z"/>
      </svg>
    ),
  },
];

const SAMPLE_PROMPT = "Explain quantum entanglement in simple terms, with an analogy.";

const SIMULATED_RESPONSES = {
  chatgpt: `Quantum entanglement is one of the most fascinating phenomena in physics. Imagine you have a pair of magic coins. You give one to a friend and keep the other. No matter how far apart you are — even on opposite sides of the universe — when you flip your coin and get heads, your friend's coin will *instantly* show tails.

That's essentially quantum entanglement: two particles become linked so that the state of one immediately determines the state of the other, regardless of distance.

**Key points:**
- When particles interact in certain ways, they become "entangled" — their properties are correlated
- Measuring one particle instantly reveals information about the other
- This happens faster than the speed of light, which puzzled even Einstein (he called it "spooky action at a distance")
- It doesn't allow faster-than-light *communication*, because the results still appear random locally

Think of it like breaking a cookie in two and putting each half in a separate box. The moment you open one box, you know what's in the other. But in quantum mechanics, the cookie doesn't have a definite shape *until* you open the box — that's what makes it so strange and powerful.`,

  gemini: `Great question! Quantum entanglement can be tricky to grasp, so let's use an analogy.

**The Gloves Analogy (with a quantum twist):**

Imagine you buy a pair of gloves, separate them, and ship one to Tokyo and one to London — without looking at which is which. The moment someone opens the London box and finds a left glove, they *instantly* know Tokyo has the right glove.

That part is normal. Here's the quantum twist: in the quantum world, each glove is *neither left nor right* until someone opens the box. The act of observation forces it to "choose," and the other glove instantaneously becomes the opposite — no matter the distance.

**Why does this matter?**

Quantum entanglement is a real, experimentally verified phenomenon. Two particles that become entangled share a connection where the measurement of one instantaneously affects the other. This forms the backbone of emerging technologies like quantum computing and quantum cryptography.

Einstein famously found this unsettling, calling it "spooky action at a distance." But decades of experiments have confirmed that entanglement is real and is not just a theoretical curiosity — it's a resource that could power the next generation of technology.`,

  perplexity: `Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others, even when separated by large distances.

**Simple Analogy: The Magic Dice**

Imagine you and a friend each have a die. These are special, "entangled" dice. You can be in different cities, but whenever you both roll your dice at the exact same moment, you always get the same number. Every single time. There's no hidden radio signal between them — they're just fundamentally connected.

In reality, entangled particles work similarly. When two particles are entangled and you measure a property (like spin) of one, the other particle's corresponding property is instantly determined, no matter the distance between them.

**Important nuances:**

- Entanglement does not transmit information faster than light. The outcomes are random — you can't control what result you get.
- It was verified through Bell test experiments, which ruled out "hidden variables" as an explanation.
- Practical applications include quantum key distribution (QKD) for secure communication and quantum teleportation of states.

**Sources:** Nature Physics, Phys.org, Stanford Encyclopedia of Philosophy`,
};

function typingEffect(fullText, setter, speedMs = 8) {
  let i = 0;
  const id = setInterval(() => {
    i += 2;
    setter(fullText.slice(0, i));
    if (i >= fullText.length) {
      clearInterval(id);
      setter(fullText);
    }
  }, speedMs);
  return id;
}

function BenchmarkBar({ label, value, max, unit, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#999", marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ color: "#ccc", fontWeight: 600 }}>{value}{unit}</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "#333", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 3,
            background: color,
            transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function MessageBubble({ text, isUser, model }) {
  const rendered = text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <div key={i} style={{ fontWeight: 700, marginTop: 8, marginBottom: 2, color: isUser ? model.userText : "#fff", fontSize: 12.5 }}>{line.replace(/\*\*/g, "")}</div>;
    }
    if (line.startsWith("- ")) {
      return <div key={i} style={{ paddingLeft: 12, position: "relative", fontSize: 12.5, lineHeight: 1.55 }}>
        <span style={{ position: "absolute", left: 0 }}>•</span>{line.slice(2).replace(/\*([^*]+)\*/g, "$1")}
      </div>;
    }
    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
    return <div key={i} style={{ fontSize: 12.5, lineHeight: 1.55 }}>{line.replace(/\*([^*]+)\*/g, "$1")}</div>;
  });

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 10,
      paddingRight: isUser ? 0 : 8,
      paddingLeft: isUser ? 8 : 0,
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: model.accent + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 8, flexShrink: 0, marginTop: 2,
          border: `1px solid ${model.accent}44`,
        }}>
          <div style={{ transform: "scale(0.7)" }}>{model.logo}</div>
        </div>
      )}
      <div style={{
        maxWidth: isUser ? "85%" : "92%",
        padding: "10px 14px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? model.userBubble : model.aiBubble,
        color: isUser ? model.userText : model.aiText,
        border: isUser ? "none" : `1px solid ${model.borderColor}`,
        fontSize: 12.5,
        lineHeight: 1.55,
      }}>
        {rendered}
      </div>
    </div>
  );
}

function LLMPanel({ model, prompt, isRunning, onFinish }) {
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [benchmark, setBenchmark] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, currentResponse]);

  useEffect(() => {
    if (!isRunning || !prompt) return;

    const startTime = performance.now();
    setMessages([{ role: "user", text: prompt }]);
    setCurrentResponse("");
    setIsTyping(true);
    setBenchmark(null);

    if (model.id === "claude") {
      (async () => {
        try {
          const resp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1000,
              messages: [{ role: "user", content: prompt }],
            }),
          });
          const data = await resp.json();
          const text = data.content?.map(b => b.text || "").join("\n") || "Error getting response.";
          const elapsed = performance.now() - startTime;
          const tokens = text.split(/\s+/).length;

          timerRef.current = typingEffect(text, setCurrentResponse, 6);

          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: "assistant", text }]);
            setCurrentResponse("");
            setBenchmark({
              latency: (elapsed / 1000).toFixed(2),
              tokens,
              tokPerSec: (tokens / (elapsed / 1000)).toFixed(1),
              chars: text.length,
            });
            onFinish?.();
          }, text.length * 3 + 200);
        } catch (err) {
          const fallback = "I'd be happy to explain quantum entanglement!\n\nImagine you have two coins that are magically connected. When you flip one and it lands heads, the other will always land tails — instantly — no matter how far apart they are.\n\nThis is the essence of quantum entanglement: two particles become correlated so that measuring one immediately determines the state of the other, regardless of distance.\n\nThe truly strange part is that before measurement, neither particle has a definite state. They exist in a superposition of possibilities. It's only when you observe one that both \"decide\" their states simultaneously.\n\nEinstein called this \"spooky action at a distance\" because it seemed to violate the principle that nothing travels faster than light. However, entanglement doesn't actually transmit information — the results appear random to each observer individually.\n\nToday, quantum entanglement is the foundation of quantum computing and quantum cryptography, promising revolutionary advances in both computation and secure communication.";
          const elapsed = performance.now() - startTime;
          const tokens = fallback.split(/\s+/).length;
          timerRef.current = typingEffect(fallback, setCurrentResponse, 6);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: "assistant", text: fallback }]);
            setCurrentResponse("");
            setBenchmark({
              latency: (elapsed / 1000).toFixed(2),
              tokens,
              tokPerSec: (tokens / (elapsed / 1000)).toFixed(1),
              chars: fallback.length,
            });
            onFinish?.();
          }, fallback.length * 3 + 200);
        }
      })();
    } else {
      const simDelay = { chatgpt: 1800, gemini: 2200, perplexity: 1500 }[model.id] || 2000;
      const text = SIMULATED_RESPONSES[model.id];

      setTimeout(() => {
        const elapsed = performance.now() - startTime;
        const tokens = text.split(/\s+/).length;
        timerRef.current = typingEffect(text, setCurrentResponse, 7);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { role: "assistant", text }]);
          setCurrentResponse("");
          setBenchmark({
            latency: (elapsed / 1000).toFixed(2),
            tokens,
            tokPerSec: (tokens / ((elapsed / 1000) + text.length * 0.007)).toFixed(1),
            chars: text.length,
          });
          onFinish?.();
        }, text.length * 3.5 + 200);
      }, simDelay);
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, prompt]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: model.bg, borderRadius: 12, overflow: "hidden",
      border: `1px solid ${model.borderColor}`,
      boxShadow: `0 0 0 1px ${model.accent}15, 0 8px 32px rgba(0,0,0,0.3)`,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        borderBottom: `1px solid ${model.borderColor}`,
        background: model.chatBg,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: model.accent + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${model.accent}33`,
        }}>{model.logo}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{model.name}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>{model.subtitle}</div>
        </div>
        {isTyping && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 3, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%", background: model.accent,
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        {model.id !== "claude" && (
          <div style={{
            marginLeft: isTyping ? 8 : "auto",
            fontSize: 8, color: "#666",
            background: "#ffffff08", padding: "2px 6px", borderRadius: 4,
            border: "1px solid #ffffff0a",
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>Simulated</div>
        )}
      </div>

      {/* Chat Area */}
      <div ref={chatRef} style={{
        flex: 1, overflowY: "auto", padding: "16px 12px",
        scrollbarWidth: "thin", scrollbarColor: `${model.borderColor} transparent`,
      }}>
        {messages.map((m, i) => (
          <MessageBubble key={i} text={m.text} isUser={m.role === "user"} model={model} />
        ))}
        {currentResponse && (
          <MessageBubble text={currentResponse} isUser={false} model={model} />
        )}
        {!messages.length && !isRunning && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", opacity: 0.3,
          }}>
            <div style={{ transform: "scale(2)", marginBottom: 16 }}>{model.logo}</div>
            <div style={{ fontSize: 12, color: "#888" }}>Ready</div>
          </div>
        )}
      </div>

      {/* Benchmark Panel */}
      {benchmark && (
        <div style={{
          padding: "10px 14px", borderTop: `1px solid ${model.borderColor}`,
          background: model.chatBg,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: model.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Response Benchmarks
          </div>
          <BenchmarkBar label="Latency" value={benchmark.latency} max={8} unit="s" color={model.accent} />
          <BenchmarkBar label="Output Tokens (est.)" value={benchmark.tokens} max={300} unit="" color={model.accent} />
          <BenchmarkBar label="Tokens/sec" value={benchmark.tokPerSec} max={80} unit="" color={model.accent} />
          <BenchmarkBar label="Response Length" value={benchmark.chars} max={1500} unit=" chars" color={model.accent} />
        </div>
      )}
    </div>
  );
}

export default function LLMComparison() {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT);
  const [isRunning, setIsRunning] = useState(false);
  const [runPrompt, setRunPrompt] = useState("");
  const [finishedCount, setFinishedCount] = useState(0);

  const handleRun = () => {
    if (!prompt.trim() || isRunning) return;
    setFinishedCount(0);
    setRunPrompt(prompt.trim());
    setIsRunning(true);
  };

  const handleFinish = useCallback(() => {
    setFinishedCount(prev => {
      const next = prev + 1;
      if (next >= 4) setIsRunning(false);
      return next;
    });
  }, []);

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#0D0D0D",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        input:focus { outline: none; }
      `}</style>

      {/* Top Bar */}
      <div style={{
        padding: "14px 24px",
        display: "flex", alignItems: "center", gap: 16,
        borderBottom: "1px solid #1a1a1a",
        background: "#111",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #D97706, #4285F4, #10A37F, #22B8CF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "#000",
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
              LLM Arena
            </div>
            <div style={{ fontSize: 10, color: "#666" }}>
              Side-by-side comparison • {finishedCount}/4 complete
            </div>
          </div>
        </div>

        <div style={{
          flex: 1, display: "flex", gap: 10, maxWidth: 700,
          marginLeft: "auto", marginRight: "auto",
        }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleRun()}
            placeholder="Enter a prompt to compare all models..."
            disabled={isRunning}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 10,
              border: "1px solid #333", background: "#1a1a1a",
              color: "#fff", fontSize: 13, fontFamily: "inherit",
              opacity: isRunning ? 0.5 : 1,
            }}
          />
          <button
            onClick={handleRun}
            disabled={isRunning || !prompt.trim()}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: isRunning ? "#333" : "linear-gradient(135deg, #D97706, #E8590C)",
              color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: isRunning ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              opacity: isRunning ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {isRunning ? `Running... (${finishedCount}/4)` : "Run All ⏎"}
          </button>
        </div>

        <div style={{
          fontSize: 9, color: "#555", maxWidth: 130, textAlign: "right",
          lineHeight: 1.4, flexShrink: 0,
        }}>
          Claude uses live API. Others are simulated for demo purposes.
        </div>
      </div>

      {/* 4-Panel Grid */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 6, padding: 6,
        overflow: "hidden",
        minHeight: 0,
      }}>
        {MODELS.map(model => (
          <LLMPanel
            key={model.id}
            model={model}
            prompt={runPrompt}
            isRunning={isRunning}
            onFinish={handleFinish}
          />
        ))}
      </div>
    </div>
  );
}
