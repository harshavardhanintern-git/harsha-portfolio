/* =========================================================
   Mini AI Chatbot — Vanilla JS
   Simulates structured AI-style replies with pattern matching.
   ========================================================= */

(function () {
  'use strict';

  const chatWindow = document.getElementById('chatWindow');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const resetBtn = document.getElementById('resetBtn');
  const suggestions = document.getElementById('chatSuggestions');

  /* ---------- Knowledge base ---------- */
  const replies = [
    {
      patterns: [/^hi\b|^hello\b|^hey\b|^yo\b|^hola\b/i],
      answers: [
        "Hey there! I'm a small AI-style chatbot built by Harsha. Ask me anything — try the suggestions below if you're not sure where to start.",
        "Hi! Nice to meet you. What would you like to talk about?",
        "Hello! I can chat about Harsha, his work, or just say hi back. Your call.",
      ],
    },
    {
      patterns: [/who (made|built|created|coded) you|who.* (developer|creator|owner)/i, /who built you/i],
      answers: [
        "I was built by **Harsha Vardhan Villuri** — a frontend developer and AIML student. I'm written in plain HTML, CSS, and JavaScript, no frameworks involved.",
      ],
    },
    {
      patterns: [/who (are|r) you|what (are|r) you|your name|introduce yourself/i],
      answers: [
        "I'm **Mini Assistant** — a lightweight chatbot designed to feel like a real AI conversation, but running entirely in your browser. Think of me as a frontend-only experiment.",
      ],
    },
    {
      patterns: [/what can you do|help|capabilities|features|how do you work/i],
      answers: [
        "Here's what I can do:\n- Chat about **Harsha** and his portfolio\n- Explain basic **AI concepts** in plain language\n- Share quick info on **HTML, CSS, JavaScript**\n- Tell a joke if you ask nicely\n- Respond with structured, multi-line answers\n\nGo ahead — try a question.",
      ],
    },
    {
      patterns: [/tell me about harsha|about harsha|who is harsha|harsha vardhan/i],
      answers: [
        "**Harsha Vardhan Villuri** is a Diploma AIML student and frontend developer from India. He builds clean, modern web interfaces and is currently exploring the overlap between frontend and AI. He's interned at **Oasis Infobyte** as a Web Development Intern and is currently an **AI Technical Content Writer Intern at GAO Tek Inc.**",
      ],
    },
    {
      patterns: [/what.* (skills|tech|stack)|skills/i],
      answers: [
        "Harsha's core skills include:\n- **HTML, CSS, JavaScript** (frontend foundations)\n- **GitHub** for version control\n- **AI Basics** — LLMs, prompting, tooling\n- **Problem Solving** & **UI Design Thinking**\n\nHe's currently exploring React and TypeScript next.",
      ],
    },
    {
      patterns: [/projects?|portfolio|work/i],
      answers: [
        "Harsha has shipped a few standout projects:\n- **AI SaaS Landing Page** — a polished marketing page for an AI product\n- **Mini AI Chatbot** — the one you're using right now\n\nCheck out the Projects section on the main portfolio for live demos and source code.",
      ],
    },
    {
      patterns: [/contact|email|reach|hire|connect|linkedin|github/i],
      answers: [
        "You can reach Harsha here:\n- **Email:** harshavardhan.intern@gmail.com\n- **LinkedIn:** linkedin.com/in/harsha-vardhan-villuri-76b1b9380\n- **GitHub:** github.com/harshavardhanintern-git\n\nHe's open to internships, freelance work, and collaborations.",
      ],
    },
    {
      patterns: [/experience|internship|job|work history/i],
      answers: [
        "Harsha's experience so far:\n- **AI Technical Content Writer Intern** at **GAO Tek Inc.** (current)\n- **Web Development Intern** at **Oasis Infobyte**\n\nBoth roles helped him bridge writing, design, and code.",
      ],
    },
    {
      patterns: [/what is ai|define ai|explain ai|artificial intelligence/i],
      answers: [
        "**AI (Artificial Intelligence)** is the field of building systems that can perform tasks that usually require human intelligence — like understanding language, recognizing images, or making decisions.\n\nMost modern AI today is powered by **machine learning**, where models learn patterns from data instead of being explicitly programmed.",
      ],
    },
    {
      patterns: [/what is (html|css|javascript|js)|explain (html|css|javascript|js)/i],
      answers: [
        "Quick definitions:\n- **HTML** — the structure and content of web pages\n- **CSS** — how things look (layout, colors, motion)\n- **JavaScript** — how things behave (interactions, logic, data)\n\nTogether, they're the foundation of basically every website you visit.",
      ],
    },
    {
      patterns: [/joke|funny|laugh/i],
      answers: [
        "Sure — here's one:\n\nWhy do programmers prefer dark mode?\n\n*Because light attracts bugs.* 🐛",
        "Okay, try this:\n\nWhy did the developer go broke?\n\n*Because he used up all his cache.* 💸",
        "How many programmers does it take to change a light bulb?\n\n*None — that's a hardware problem.*",
      ],
    },
    {
      patterns: [/thank|thanks|thx|appreciate/i],
      answers: [
        "You're very welcome! Anything else you'd like to know?",
        "Anytime. Glad to help.",
        "No problem at all — ask away if you have more questions.",
      ],
    },
    {
      patterns: [/bye|goodbye|see you|cya|later/i],
      answers: [
        "Bye! Thanks for chatting — feel free to head back to the portfolio when you're done.",
        "Take care! Don't forget to check out the rest of Harsha's work.",
      ],
    },
    {
      patterns: [/how are you|how.s it going|wassup|sup/i],
      answers: [
        "Doing great — just sitting here in the browser, ready to chat. How about you?",
        "All good on my end. What's on your mind?",
      ],
    },
    {
      patterns: [/age|how old|birthday/i],
      answers: [
        "I don't have an age — I'm just a small JavaScript program. But I was freshly written for this portfolio, so I guess I'm pretty new!",
      ],
    },
    {
      patterns: [/are you (real|human|ai|a bot|smart)/i],
      answers: [
        "I'm a **simulated chatbot** — not a real AI model. I match your message against patterns and return structured replies. No machine learning involved, just clean JavaScript logic.",
      ],
    },
  ];

  const fallbacks = [
    "Hmm, I don't have a great answer for that one. Try one of the suggestions below — or ask me about Harsha, his projects, or AI basics.",
    "I'm not sure how to answer that. I'm a small demo bot, so my range is limited. Try asking about **skills**, **projects**, or **contact info**.",
    "That's a bit outside my range. I can talk about Harsha's work, his experience, or basic web/AI topics.",
  ];

  /* ---------- Helpers ---------- */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function timeNow() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Lightweight markdown: **bold**, lists with "- ", line breaks
  function formatMessage(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Convert "- " lists
    const lines = html.split('\n');
    let out = '';
    let inList = false;
    for (const line of lines) {
      if (/^- /.test(line)) {
        if (!inList) { out += '<ul>'; inList = true; }
        out += '<li>' + line.replace(/^- /, '') + '</li>';
      } else {
        if (inList) { out += '</ul>'; inList = false; }
        out += line + '\n';
      }
    }
    if (inList) out += '</ul>';
    return out.trim().replace(/\n/g, '<br>');
  }

  function getReply(input) {
    const text = input.trim();
    for (const r of replies) {
      if (r.patterns.some((p) => p.test(text))) {
        return pick(r.answers);
      }
    }
    return pick(fallbacks);
  }

  /* ---------- Render ---------- */
  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = 'msg ' + sender;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = sender === 'bot' ? 'AI' : 'You';

    const wrap = document.createElement('div');
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = formatMessage(text);

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = timeNow();

    wrap.appendChild(bubble);
    wrap.appendChild(time);
    msg.appendChild(avatar);
    msg.appendChild(wrap);

    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function appendTyping() {
    const msg = document.createElement('div');
    msg.className = 'msg bot';
    msg.id = 'typingMsg';
    msg.innerHTML =
      '<div class="msg-avatar">AI</div>' +
      '<div><div class="msg-bubble typing-bubble"><span></span><span></span><span></span></div></div>';
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingMsg');
    if (t) t.remove();
  }

  function botReply(userText) {
    const reply = getReply(userText);
    const delay = Math.min(900 + reply.length * 8, 1800);
    appendTyping();
    setTimeout(() => {
      removeTyping();
      appendMessage(reply, 'bot');
    }, delay);
  }

  function send(text) {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    chatInput.value = '';
    suggestions.classList.add('hidden');
    sendBtn.disabled = true;
    setTimeout(() => { sendBtn.disabled = false; }, 600);
    botReply(text);
  }

  /* ---------- Events ---------- */
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    send(chatInput.value);
  });

  suggestions.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      send(chip.dataset.q);
    });
  });

  resetBtn.addEventListener('click', () => {
    chatWindow.innerHTML = '';
    suggestions.classList.remove('hidden');
    setTimeout(greet, 200);
  });

  /* ---------- Greeting ---------- */
  function greet() {
    appendTyping();
    setTimeout(() => {
      removeTyping();
      appendMessage(
        "Hey! I'm **Mini Assistant** — a small AI-style chatbot built by Harsha. Ask me anything, or tap one of the suggestions below to get started.",
        'bot'
      );
    }, 800);
  }

  greet();
})();
