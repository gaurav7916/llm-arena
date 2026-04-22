import streamlit as st
import streamlit.components.v1 as components


st.set_page_config(page_title="LLM Arena", layout="wide")


HTML = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LLM Arena</title>
    <style>
      :root {
        color-scheme: dark;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        min-height: 100%;
        background: #0d0d0d;
        color: #ececec;
        font-family: "DM Sans", "Segoe UI", system-ui, sans-serif;
      }

      body {
        overflow: hidden;
      }

      .app {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: #0d0d0d;
      }

      .topbar {
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        border-bottom: 1px solid #1a1a1a;
        background: #111;
        flex-shrink: 0;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        min-width: 180px;
      }

      .brand-badge {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #d97706, #4285f4, #10a37f, #22b8cf);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 800;
        color: #000;
      }

      .brand-title {
        font-size: 15px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.02em;
      }

      .brand-subtitle {
        font-size: 10px;
        color: #666;
        margin-top: 1px;
      }

      .controls {
        flex: 1;
        display: flex;
        gap: 10px;
        max-width: 760px;
        margin-left: auto;
        margin-right: auto;
      }

      .prompt-input {
        flex: 1;
        padding: 10px 16px;
        border-radius: 10px;
        border: 1px solid #333;
        background: #1a1a1a;
        color: #fff;
        font-size: 13px;
        font-family: inherit;
      }

      .prompt-input:focus {
        outline: none;
        border-color: #555;
      }

      .run-btn {
        padding: 10px 24px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #d97706, #e8590c);
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.2s ease;
        white-space: nowrap;
      }

      .run-btn:disabled,
      .prompt-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .note {
        font-size: 9px;
        color: #555;
        max-width: 170px;
        text-align: right;
        line-height: 1.4;
        flex-shrink: 0;
      }

      .grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 6px;
        padding: 6px;
        min-height: 0;
      }

      .panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--panel-bg);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--panel-border);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--panel-accent) 12%, transparent), 0 8px 32px rgba(0, 0, 0, 0.3);
        min-height: 0;
      }

      .panel-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-bottom: 1px solid var(--panel-border);
        background: var(--panel-chat-bg);
      }

      .panel-logo-box {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--panel-accent) 12%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--panel-accent) 20%, transparent);
        flex-shrink: 0;
      }

      .panel-logo-box svg {
        width: 22px;
        height: 22px;
      }

      .panel-title {
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.01em;
      }

      .panel-subtitle {
        font-size: 10px;
        color: #888;
        margin-top: 1px;
      }

      .typing-indicator {
        margin-left: auto;
        display: flex;
        gap: 3px;
        align-items: center;
      }

      .typing-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--panel-accent);
        animation: pulse 1.2s ease-in-out infinite;
      }

      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      .sim-badge {
        margin-left: auto;
        font-size: 8px;
        color: #666;
        background: #ffffff08;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid #ffffff0a;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .chat {
        flex: 1;
        overflow-y: auto;
        padding: 16px 12px;
        min-height: 0;
        scrollbar-width: thin;
        scrollbar-color: var(--panel-border) transparent;
      }

      .chat::-webkit-scrollbar {
        width: 4px;
      }

      .chat::-webkit-scrollbar-track {
        background: transparent;
      }

      .chat::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 4px;
      }

      .ready {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        opacity: 0.3;
      }

      .ready-logo {
        transform: scale(2);
        margin-bottom: 16px;
      }

      .message-row {
        display: flex;
        margin-bottom: 10px;
      }

      .message-row.user {
        justify-content: flex-end;
        padding-left: 8px;
      }

      .message-row.assistant {
        justify-content: flex-start;
        padding-right: 8px;
      }

      .assistant-avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--panel-accent) 12%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        flex-shrink: 0;
        margin-top: 2px;
        border: 1px solid color-mix(in srgb, var(--panel-accent) 25%, transparent);
      }

      .assistant-avatar svg {
        width: 16px;
        height: 16px;
      }

      .bubble {
        max-width: 92%;
        padding: 10px 14px;
        border-radius: 16px 16px 16px 4px;
        font-size: 12.5px;
        line-height: 1.55;
        color: var(--assistant-text);
        border: 1px solid var(--panel-border);
        background: var(--assistant-bubble);
        white-space: normal;
      }

      .message-row.user .bubble {
        max-width: 85%;
        border-radius: 16px 16px 4px 16px;
        color: var(--user-text);
        background: var(--user-bubble);
        border: none;
      }

      .line {
        font-size: 12.5px;
        line-height: 1.55;
      }

      .line + .line {
        margin-top: 2px;
      }

      .line.heading {
        font-weight: 700;
        margin-top: 8px;
        margin-bottom: 2px;
        color: #fff;
      }

      .message-row.user .line.heading {
        color: var(--user-text);
      }

      .line.empty {
        height: 6px;
      }

      .line.bullet {
        padding-left: 12px;
        position: relative;
      }

      .line.bullet::before {
        content: "•";
        position: absolute;
        left: 0;
      }

      .benchmark {
        padding: 10px 14px;
        border-top: 1px solid var(--panel-border);
        background: var(--panel-chat-bg);
      }

      .benchmark-title {
        font-size: 9px;
        font-weight: 700;
        color: var(--panel-accent);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 8px;
      }

      .bar-wrap {
        margin-bottom: 6px;
      }

      .bar-meta {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #999;
        margin-bottom: 2px;
      }

      .bar-value {
        color: #ccc;
        font-weight: 600;
      }

      .bar-track {
        height: 5px;
        border-radius: 3px;
        background: #333;
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        border-radius: 3px;
        background: var(--panel-accent);
        transition: width 1.2s cubic-bezier(.4, 0, .2, 1);
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      @media (max-width: 900px) {
        body {
          overflow: auto;
        }

        .app {
          height: auto;
          min-height: 100vh;
        }

        .topbar {
          flex-direction: column;
          align-items: stretch;
        }

        .controls {
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .grid {
          grid-template-columns: 1fr;
          grid-template-rows: repeat(4, minmax(360px, 1fr));
        }

        .note {
          max-width: none;
          text-align: left;
        }
      }
    </style>
  </head>
  <body>
    <div id="app"></div>

    <script>
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
          borderColor: "#404040",
          simulated: false,
          logo: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M16.98 7.54L13.86 17.47H11.62L9.36 10.09L6.96 17.47H4.74L1.68 7.54H3.96L6.02 15.13L8.46 7.54H10.46L12.78 15.17L14.88 7.54H16.98Z" fill="#D97706"></path>
              <path d="M22.32 7.54L19.2 17.47H16.96L19.92 7.54H22.32Z" fill="#D97706"></path>
            </svg>
          `,
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
          borderColor: "#444",
          simulated: true,
          logo: `
            <svg viewBox="0 0 24 24" fill="#10A37F" aria-hidden="true">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4116-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0974-2.3616l2.603-1.5018 2.6032 1.5018v3.0036l-2.6032 1.5018-2.603-1.5018z"></path>
            </svg>
          `,
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
          borderColor: "#444746",
          simulated: true,
          logo: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id="gemGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stop-color="#4285F4"></stop>
                  <stop offset="33%" stop-color="#9B72CB"></stop>
                  <stop offset="66%" stop-color="#D96570"></stop>
                  <stop offset="100%" stop-color="#D96570"></stop>
                </linearGradient>
              </defs>
              <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemGrad)"></path>
            </svg>
          `,
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
          borderColor: "#3A3F3F",
          simulated: true,
          logo: `
            <svg viewBox="0 0 24 24" fill="#22B8CF" aria-hidden="true">
              <path d="M6 2L12 7.5V2h1v5.5L19 2v7h3v1h-3v5.5l-1 .5V10h-5v8l-1 .5V10H8v8.5L7 18V10H4V9h3V2zm1 1.5V9h5V7.5L7 3.5zm11 0L13 7.5V9h5V3.5zM8 11v5.5l4-2V11H8zm9 0h-4v3.5l4 2V11z"></path>
            </svg>
          `,
        },
      ];

      const SAMPLE_PROMPT = "Explain quantum entanglement in simple terms, with an analogy.";

      const RESPONSES = {
        claude: `I'd be happy to explain quantum entanglement!\\n\\nImagine you have two coins that are magically connected. When you flip one and it lands heads, the other will always land tails instantly, no matter how far apart they are.\\n\\nThis is the essence of quantum entanglement: two particles become correlated so that measuring one immediately determines the state of the other, regardless of distance.\\n\\nThe truly strange part is that before measurement, neither particle has a definite state. They exist in a superposition of possibilities. It's only when you observe one that both "decide" their states simultaneously.\\n\\nEinstein called this "spooky action at a distance" because it seemed to violate the principle that nothing travels faster than light. However, entanglement doesn't actually transmit information because the results appear random to each observer individually.\\n\\nToday, quantum entanglement is one of the foundations of quantum computing and quantum cryptography.`,
        chatgpt: `Quantum entanglement is one of the most fascinating phenomena in physics. Imagine you have a pair of magic coins. You give one to a friend and keep the other. No matter how far apart you are, even on opposite sides of the universe, when you flip your coin and get heads, your friend's coin will instantly show tails.\\n\\nThat's essentially quantum entanglement: two particles become linked so that the state of one immediately determines the state of the other, regardless of distance.\\n\\n**Key points:**\\n- When particles interact in certain ways, they become "entangled" and their properties are correlated\\n- Measuring one particle instantly reveals information about the other\\n- This puzzled even Einstein, who called it "spooky action at a distance"\\n- It does not allow faster-than-light communication because the results still appear random locally\\n\\nThink of it like opening one half of a mystery pair and instantly knowing the other, except in quantum mechanics the pair does not settle into a definite state until measurement.`,
        gemini: `Great question! Quantum entanglement can be tricky to grasp, so let's use an analogy.\\n\\n**The Gloves Analogy (with a quantum twist):**\\n\\nImagine you buy a pair of gloves, separate them, and ship one to Tokyo and one to London without looking at which is which. The moment someone opens the London box and finds a left glove, they instantly know Tokyo has the right glove.\\n\\nThat part is normal. Here's the quantum twist: in the quantum world, each glove is neither left nor right until someone opens the box. The act of observation forces it to "choose," and the other glove instantaneously becomes the opposite, no matter the distance.\\n\\n**Why does this matter?**\\n\\nQuantum entanglement is a real, experimentally verified phenomenon. Two particles that become entangled share a connection where measuring one instantaneously affects the other. This powers ideas behind quantum computing and quantum cryptography.`,
        perplexity: `Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others, even when separated by large distances.\\n\\n**Simple Analogy: The Magic Dice**\\n\\nImagine you and a friend each have a die. These are special, entangled dice. You can be in different cities, but whenever you both roll your dice at the exact same moment, you always get matching or perfectly linked outcomes. There is no hidden radio signal between them. They are just fundamentally connected.\\n\\nIn reality, entangled particles work similarly. When two particles are entangled and you measure a property like spin of one, the other particle's corresponding property is instantly determined, no matter the distance.\\n\\n**Important nuances:**\\n- Entanglement does not transmit information faster than light\\n- Bell test experiments ruled out simple hidden-variable explanations\\n- Practical applications include secure communication and quantum state transfer`,
      };

      const state = {
        prompt: SAMPLE_PROMPT,
        isRunning: false,
        runPrompt: "",
        finishedCount: 0,
        panels: Object.fromEntries(MODELS.map((model) => [model.id, {
          messages: [],
          currentResponse: "",
          benchmark: null,
          isTyping: false,
        }])),
      };

      const timers = [];

      function escapeHtml(text) {
        return text
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
      }

      function renderInline(text) {
        return escapeHtml(text).replace(/\\*([^*]+)\\*/g, "$1");
      }

      function clearTimers() {
        while (timers.length) {
          const timer = timers.pop();
          clearTimeout(timer);
          clearInterval(timer);
        }
      }

      function panelTheme(model) {
        return [
          `--panel-accent:${model.accent}`,
          `--panel-bg:${model.bg}`,
          `--panel-chat-bg:${model.chatBg}`,
          `--panel-border:${model.borderColor}`,
          `--user-bubble:${model.userBubble}`,
          `--user-text:${model.userText}`,
          `--assistant-bubble:${model.aiBubble}`,
          `--assistant-text:${model.aiText}`,
        ].join(";");
      }

      function formatLines(text) {
        return text.split("\\n").map((line) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return `<div class="line heading">${renderInline(line.replace(/\\*\\*/g, ""))}</div>`;
          }
          if (line.startsWith("- ")) {
            return `<div class="line bullet">${renderInline(line.slice(2))}</div>`;
          }
          if (!line.trim()) {
            return '<div class="line empty"></div>';
          }
          return `<div class="line">${renderInline(line)}</div>`;
        }).join("");
      }

      function renderMessage(model, message) {
        const assistantAvatar = message.role === "assistant"
          ? `<div class="assistant-avatar">${model.logo}</div>`
          : "";
        return `
          <div class="message-row ${message.role === "user" ? "user" : "assistant"}" style="${panelTheme(model)}">
            ${assistantAvatar}
            <div class="bubble">${formatLines(message.text)}</div>
          </div>
        `;
      }

      function renderBenchmark(model, benchmark) {
        if (!benchmark) {
          return "";
        }

        const bars = [
          ["Latency", benchmark.latency, 8, "s"],
          ["Output Tokens (est.)", benchmark.tokens, 300, ""],
          ["Tokens/sec", benchmark.tokPerSec, 80, ""],
          ["Response Length", benchmark.chars, 1500, " chars"],
        ];

        return `
          <div class="benchmark" style="${panelTheme(model)}">
            <div class="benchmark-title">Response Benchmarks</div>
            ${bars.map(([label, value, max, unit]) => {
              const numeric = Number(value);
              const pct = Math.min((numeric / max) * 100, 100);
              return `
                <div class="bar-wrap">
                  <div class="bar-meta">
                    <span>${label}</span>
                    <span class="bar-value">${value}${unit}</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill" style="width:${pct}%"></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `;
      }

      function renderPanel(model) {
        const panel = state.panels[model.id];
        const current = panel.currentResponse
          ? renderMessage(model, { role: "assistant", text: panel.currentResponse })
          : "";
        const ready = !panel.messages.length && !state.isRunning
          ? `
            <div class="ready">
              <div class="ready-logo">${model.logo}</div>
              <div style="font-size:12px;color:#888;">Ready</div>
            </div>
          `
          : "";

        return `
          <div class="panel" style="${panelTheme(model)}">
            <div class="panel-header">
              <div class="panel-logo-box">${model.logo}</div>
              <div>
                <div class="panel-title">${model.name}</div>
                <div class="panel-subtitle">${model.subtitle}</div>
              </div>
              ${panel.isTyping ? `
                <div class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              ` : ""}
              ${model.simulated ? '<div class="sim-badge">Simulated</div>' : ""}
            </div>
            <div class="chat" id="chat-${model.id}">
              ${panel.messages.map((message) => renderMessage(model, message)).join("")}
              ${current}
              ${ready}
            </div>
            ${renderBenchmark(model, panel.benchmark)}
          </div>
        `;
      }

      function render() {
        document.getElementById("app").innerHTML = `
          <div class="app">
            <div class="topbar">
              <div class="brand">
                <div class="brand-badge">⚡</div>
                <div>
                  <div class="brand-title">LLM Arena</div>
                  <div class="brand-subtitle">Side-by-side comparison • ${state.finishedCount}/4 complete</div>
                </div>
              </div>

              <div class="controls">
                <input
                  id="prompt-input"
                  class="prompt-input"
                  value="${escapeHtml(state.prompt)}"
                  placeholder="Enter a prompt to compare all models..."
                  ${state.isRunning ? "disabled" : ""}
                />
                <button
                  id="run-btn"
                  class="run-btn"
                  ${state.isRunning || !state.prompt.trim() ? "disabled" : ""}
                >
                  ${state.isRunning ? `Running... (${state.finishedCount}/4)` : "Run All ⏎"}
                </button>
              </div>

              <div class="note">
                Streamlit demo. Responses are simulated for deployment safety.
              </div>
            </div>

            <div class="grid">
              ${MODELS.map((model) => renderPanel(model)).join("")}
            </div>
          </div>
        `;

        const input = document.getElementById("prompt-input");
        const runBtn = document.getElementById("run-btn");

        input.addEventListener("input", (event) => {
          state.prompt = event.target.value;
          render();
        });

        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleRun();
          }
        });

        runBtn.addEventListener("click", handleRun);

        MODELS.forEach((model) => {
          const chat = document.getElementById(`chat-${model.id}`);
          if (chat) {
            chat.scrollTop = chat.scrollHeight;
          }
        });
      }

      function finishModel() {
        state.finishedCount += 1;
        if (state.finishedCount >= MODELS.length) {
          state.isRunning = false;
        }
        render();
      }

      function typeResponse(model, text, elapsedMs, speedMs, typingDelayFactor) {
        const panel = state.panels[model.id];
        panel.isTyping = true;
        panel.currentResponse = "";
        render();

        let index = 0;
        const intervalId = setInterval(() => {
          index += 2;
          panel.currentResponse = text.slice(0, index);
          render();
          if (index >= text.length) {
            clearInterval(intervalId);
          }
        }, speedMs);
        timers.push(intervalId);

        const finishDelay = Math.round(text.length * typingDelayFactor + 200);
        const doneId = setTimeout(() => {
          panel.isTyping = false;
          panel.currentResponse = "";
          panel.messages.push({ role: "assistant", text });
          const tokens = text.split(/\\s+/).filter(Boolean).length;
          const elapsedSeconds = elapsedMs / 1000;
          panel.benchmark = {
            latency: elapsedSeconds.toFixed(2),
            tokens,
            tokPerSec: (tokens / Math.max(elapsedSeconds, 0.01)).toFixed(1),
            chars: text.length,
          };
          render();
          finishModel();
        }, finishDelay);
        timers.push(doneId);
      }

      function startModel(model) {
        const panel = state.panels[model.id];
        const startTime = performance.now();
        panel.messages = [{ role: "user", text: state.runPrompt }];
        panel.currentResponse = "";
        panel.benchmark = null;
        panel.isTyping = false;
        render();

        const delay = {
          claude: 1000,
          chatgpt: 1800,
          gemini: 2200,
          perplexity: 1500,
        }[model.id] || 1800;

        const delayId = setTimeout(() => {
          const text = RESPONSES[model.id];
          const elapsed = performance.now() - startTime;
          typeResponse(
            model,
            text,
            elapsed,
            model.id === "claude" ? 6 : 7,
            model.id === "claude" ? 3 : 3.5
          );
        }, delay);
        timers.push(delayId);
      }

      function handleRun() {
        if (!state.prompt.trim() || state.isRunning) {
          return;
        }

        clearTimers();
        state.finishedCount = 0;
        state.runPrompt = state.prompt.trim();
        state.isRunning = true;

        MODELS.forEach((model) => {
          state.panels[model.id] = {
            messages: [],
            currentResponse: "",
            benchmark: null,
            isTyping: false,
          };
        });

        render();
        MODELS.forEach(startModel);
      }

      render();
    </script>
  </body>
</html>
"""


st.markdown(
    """
    <style>
      .block-container {
        padding-top: 1rem;
        padding-bottom: 1rem;
        max-width: 100%;
      }
    </style>
    """,
    unsafe_allow_html=True,
)

components.html(HTML, height=1120, scrolling=False)
