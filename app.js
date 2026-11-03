/* Study Hub engine. Subjects register themselves with StudyHub.registerSubject({...}).
   See README.md for the subject data format. */
(function () {
  "use strict";

  const SUBJECTS = [];
  window.StudyHub = {
    registerSubject(s) { SUBJECTS.push(s); },
    addChapter(subjectId, ch) {
      const s = SUBJECTS.find((x) => x.id === subjectId);
      if (s) s.chapters.push(ch);
    },
    // Attach everyday examples to lessons by section title: { "Section title": "text" }.
    addExamples(subjectId, chapterId, map) {
      const s = SUBJECTS.find((x) => x.id === subjectId);
      const ch = s && s.chapters.find((c) => c.id === chapterId);
      if (!ch) return console.warn("addExamples: no chapter", subjectId, chapterId);
      for (const [title, ex] of Object.entries(map)) {
        const sec = ch.sections.find((x) => x.title === title);
        if (!sec) { console.warn("addExamples: no section", title); continue; }
        sec.example = ex;
      }
    },
    // Attach animated scenes to lessons by section title: { "Section title": scene | [scenes] }.
    addScenes(subjectId, chapterId, map) {
      const s = SUBJECTS.find((x) => x.id === subjectId);
      const ch = s && s.chapters.find((c) => c.id === chapterId);
      if (!ch) return console.warn("addScenes: no chapter", subjectId, chapterId);
      for (const [title, sc] of Object.entries(map)) {
        const sec = ch.sections.find((x) => x.title === title);
        if (!sec) { console.warn("addScenes: no section", title); continue; }
        sec.scenes = (sec.scenes || []).concat(sc);
      }
    },
    // Attach extra diagrams by section title, shown first: { "Section title": diagram | [diagrams] }.
    addDiagrams(subjectId, chapterId, map) {
      const s = SUBJECTS.find((x) => x.id === subjectId);
      const ch = s && s.chapters.find((c) => c.id === chapterId);
      if (!ch) return console.warn("addDiagrams: no chapter", subjectId, chapterId);
      for (const [title, d] of Object.entries(map)) {
        const sec = ch.sections.find((x) => x.title === title);
        if (!sec) { console.warn("addDiagrams: no section", title); continue; }
        const old = sec.diagrams || (sec.diagram ? [sec.diagram] : []);
        delete sec.diagram;
        sec.diagrams = [].concat(d, old);
      }
    },
    // Attach complete, runnable programs by section title: { "Section title": [{ file, lang, content, output }] }.
    // They replace the short code excerpts ("code" diagrams) of that section.
    addCode(subjectId, chapterId, map) {
      const s = SUBJECTS.find((x) => x.id === subjectId);
      const ch = s && s.chapters.find((c) => c.id === chapterId);
      if (!ch) return console.warn("addCode: no chapter", subjectId, chapterId);
      for (const [title, list] of Object.entries(map)) {
        const sec = ch.sections.find((x) => x.title === title);
        if (!sec) { console.warn("addCode: no section", title); continue; }
        if (sec.diagram && sec.diagram.type === "code") delete sec.diagram;
        if (sec.diagrams) sec.diagrams = sec.diagrams.filter((d) => d.type !== "code");
        sec.code = (sec.code || []).concat(list);
      }
    },
  };
  const DEFAULT_HUE = 258;

  // ---------- storage (per-browser convenience only) ----------
  const KEY = "studyhub:v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  let store = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* ignore */ } }
  function chState(sid, cid) {
    store[sid] = store[sid] || {};
    store[sid][cid] = store[sid][cid] || { read: [], best: null, known: [], again: [] };
    return store[sid][cid];
  }

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  const svgEl = (markup) => { const t = document.createElement("template"); t.innerHTML = markup.trim(); return t.content.firstChild; };
  // Light inline markup for content: **bold**, *italic*, `code`, line breaks.
  function rich(text) {
    const esc = String(text ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    return esc
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^\w*\/])\*(?![\s*])([^*\n]+?)\*(?![\w*])/g, "$1<em>$2</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }
  const R = (tag, text, cls) => h(tag, { class: cls, html: rich(text) });
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduced = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const centerOf = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const label = (icon, text) => h("div", { class: "block-label" }, h("span", { class: "ico" }, icon), text);
  // Keyboard shortcuts that live only as long as their view is on screen.
  function bindKeys(root, handler) {
    const fn = (e) => {
      if (!root.isConnected) return document.removeEventListener("keydown", fn);
      if (e.target.closest && e.target.closest("input, textarea")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      handler(e);
    };
    document.addEventListener("keydown", fn);
  }
  function countUp(el, to, ms = 900) {
    if (reduced() || !to) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function currentHue() {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--h"));
    return isNaN(v) ? DEFAULT_HUE : v;
  }

  // ---------- effects: confetti, floating XP, toasts ----------
  const fx = { parts: [], running: false };
  function confetti(x, y, n = 80, power = 1) {
    if (reduced()) return;
    const cv = $("#confetti");
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== innerWidth * dpr) { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    const hue = currentHue();
    const hues = [hue, hue + 42, hue - 48, 45, 150];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (2 + Math.random() * 7) * power;
      fx.parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * power, g: 0.22 + Math.random() * 0.1,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4, s: 5 + Math.random() * 6,
        c: `hsl(${hues[i % hues.length]} 85% 58%)`, life: 0, max: 70 + Math.random() * 50, round: Math.random() < 0.3,
      });
    }
    if (!fx.running) { fx.running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    const cv = $("#confetti");
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    fx.parts = fx.parts.filter((p) => p.life < p.max && p.y < innerHeight + 40);
    for (const p of fx.parts) {
      p.life++; p.vy += p.g; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (fx.parts.length) requestAnimationFrame(tick);
    else { fx.running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  const bigConfetti = () => { confetti(innerWidth * 0.25, innerHeight * 0.45, 90, 1.3); confetti(innerWidth * 0.75, innerHeight * 0.45, 90, 1.3); };
  function floatText(text, x, y) {
    const el = h("div", { class: "float-xp", style: `left:${x}px;top:${y}px` }, text);
    document.body.append(el);
    setTimeout(() => el.remove(), 1200);
  }
  function toast(msg) {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const el = h("div", { class: "toast", role: "status" }, msg);
    document.body.append(el);
    setTimeout(() => el.remove(), 3000);
  }

  // ---------- XP, level and daily streak ----------
  const LEVEL_XP = 250;
  function meta() { store._meta = store._meta || { xp: 0, streak: 0, last: null }; return store._meta; }
  const dayKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  function touchStreak() {
    const m = meta();
    const today = dayKey(new Date());
    if (m.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    m.streak = m.last === dayKey(y) ? (m.streak || 0) + 1 : 1;
    m.last = today;
    toast(m.streak > 1 ? `🔥 ${m.streak}-day streak! Keep it going.` : "🔥 Streak started. Come back tomorrow!");
  }
  function liveStreak() {
    const m = meta();
    if (!m.last) return 0;
    const y = new Date(); y.setDate(y.getDate() - 1);
    return m.last === dayKey(new Date()) || m.last === dayKey(y) ? m.streak : 0;
  }
  const levelOf = (xp) => Math.floor(xp / LEVEL_XP) + 1;
  function addXP(n, at) {
    const m = meta();
    const before = levelOf(m.xp);
    m.xp = Math.max(0, (m.xp || 0) + n);
    if (n > 0) touchStreak();
    save();
    renderXP(true);
    if (at && n) floatText(`${n > 0 ? "+" : ""}${n} XP`, at[0], at[1] - 10);
    if (levelOf(m.xp) > before) { setTimeout(() => { toast(`🎉 Level up! You're now level ${levelOf(m.xp)}`); bigConfetti(); }, 300); }
  }
  function renderXP(bump) {
    const el = $("#xp");
    if (!el) return;
    const m = meta();
    const streak = liveStreak();
    el.innerHTML = "";
    el.append(h("span", { class: "lvl" }, `Lv ${levelOf(m.xp || 0)}`), h("span", { class: "xp-num" }, `⚡ ${m.xp || 0}`));
    if (streak) el.append(h("span", { class: "streak" }, `🔥 ${streak}`));
    if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  }

  // ---------- mermaid (lazy) ----------
  let mermaidReady = null;
  function isDark() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function hex(hh, s, l) {
    s /= 100; l /= 100; hh = ((hh % 360) + 360) % 360;
    const f = (n) => { const k = (n + hh / 30) % 12; const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(c * 255).toString(16).padStart(2, "0"); };
    return "#" + f(0) + f(8) + f(4);
  }
  function mermaidConfig() {
    const hh = state.subject ? state.subject.hue ?? DEFAULT_HUE : DEFAULT_HUE;
    const d = isDark();
    const v = d ? {
      darkMode: true, background: "#18152b", primaryColor: hex(hh, 35, 24), primaryBorderColor: hex(hh, 75, 68), primaryTextColor: "#eeedf8",
      secondaryColor: hex(hh + 42, 35, 24), tertiaryColor: hex(hh - 48, 30, 20), lineColor: hex(hh, 35, 72), textColor: "#eeedf8",
      clusterBkg: hex(hh, 30, 15), clusterBorder: hex(hh, 35, 38), edgeLabelBackground: "#221e3a", nodeTextColor: "#eeedf8",
    } : {
      background: "#ffffff", primaryColor: hex(hh, 90, 95), primaryBorderColor: hex(hh, 60, 55), primaryTextColor: "#1b1733",
      secondaryColor: hex(hh + 42, 85, 94), tertiaryColor: hex(hh - 48, 80, 95), lineColor: hex(hh, 30, 45), textColor: "#1b1733",
      clusterBkg: hex(hh, 70, 98), clusterBorder: hex(hh, 45, 80), edgeLabelBackground: "#ffffff", nodeTextColor: "#1b1733",
    };
    return {
      startOnLoad: false, securityLevel: "strict", theme: "base",
      themeVariables: { ...v, fontFamily: "Atkinson Hyperlegible, sans-serif", fontSize: "15px" },
      flowchart: { curve: "basis", padding: 18, nodeSpacing: 46, rankSpacing: 56 },
      sequence: { actorMargin: 60, boxMargin: 12, noteMargin: 12, messageMargin: 40 },
    };
  }
  function getMermaid() {
    if (!mermaidReady) {
      mermaidReady = new Promise((res, rej) => {
        if (window.mermaid) return res(window.mermaid);
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
        s.onload = () => res(window.mermaid);
        s.onerror = rej;
        document.head.append(s);
      });
    }
    return mermaidReady;
  }
  // ---------- complete code listings ----------
  const JAVA_KW = "abstract|assert|boolean|break|byte|case|catch|char|class|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|new|null|package|private|protected|public|record|return|short|static|super|switch|synchronized|this|throw|throws|true|false|try|var|void|volatile|while";
  const TOKEN = new RegExp(String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)')|(@[A-Za-z]+)|\b(${JAVA_KW})\b|\b(\d+(?:\.\d+)?)\b|\b([A-Z][A-Za-z0-9_]*)\b`, "g");
  const esc = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  // YAML / HCL / shell: # comments, strings, "key:" or "key =" names, $ commands, numbers, booleans.
  const TOKEN_CONF = /(#[^\n]*|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'[^'\n]*')|(^\s*(?:- )?\$ [^\n]*)|\b(true|false|null|resource|variable|provider|module|output|data)\b|\b(\d+(?:\.\d+)?)\b|((?:^|(?<=\n))\s*(?:- )?[A-Za-z_][\w.-]*(?=\s*[:=]))/gm;
  function highlight(src, lang) {
    if (lang && lang !== "java") {
      let out = "", last = 0;
      src.replace(TOKEN_CONF, (m, com, str, cmd, kw, num, key, at) => {
        out += esc(src.slice(last, at));
        const cls = com ? "c" : str ? "s" : cmd ? "a" : kw ? "k" : num ? "n" : "t";
        out += `<span class="tk-${cls}">${esc(m)}</span>`;
        last = at + m.length;
        return m;
      });
      return out + esc(src.slice(last));
    }
    let out = "", last = 0;
    src.replace(TOKEN, (m, com, str, ann, kw, num, type, at) => {
      out += esc(src.slice(last, at));
      const cls = com ? "c" : str ? "s" : ann ? "a" : kw ? "k" : num ? "n" : "t";
      out += `<span class="tk-${cls}">${esc(m)}</span>`;
      last = at + m.length;
      return m;
    });
    return out + esc(src.slice(last));
  }
  function codeEl(c) {
    const pre = h("pre", { class: "code-src" });
    pre.innerHTML = highlight(c.content, c.lang);
    const copy = h("button", { class: "code-btn", type: "button", title: "Copier le code" }, "📋 Copier");
    copy.addEventListener("click", () => {
      const done = () => { copy.textContent = "✓ Copié"; setTimeout(() => (copy.textContent = "📋 Copier"), 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(c.content).then(done, () => {});
    });
    const lines = c.content.split("\n").length;
    const body = h("div", { class: "code-body" }, pre);
    const wrap = h("div", { class: "code-card" + (lines > 90 ? " folded" : "") },
      h("div", { class: "code-head" },
        h("span", { class: "code-dots" }, h("i"), h("i"), h("i")),
        h("span", { class: "code-file" }, c.file),
        h("span", { class: "code-lang" }, (c.lang || "").toUpperCase()),
        copy),
      body);
    if (lines > 90) {
      const more = h("button", { class: "code-more", type: "button" }, `Afficher tout le code (${lines} lignes) ↓`);
      more.addEventListener("click", () => { wrap.classList.remove("folded"); more.remove(); });
      wrap.append(more);
    }
    if (c.output) {
      wrap.append(h("details", { class: "code-out" },
        h("summary", {}, "Sortie console (", h("code", {}, `java ${c.file}`), ")"),
        h("pre", {}, c.output)));
    }
    return h("div", { class: "block" }, label("💻", c.caption || (c.lang === "java" ? "Code Java complet" : "Code")), wrap);
  }

  let mid = 0;
  let mermaidQueue = Promise.resolve();
  function diagramEl(d) {
    if (!d) return null;
    const box = h("div", { class: "diagram" });
    if (d.type === "mermaid") {
      box.append(h("pre", {}, d.content));
      const id = "mmd" + ++mid;
      // Render one at a time so each uses the current subject's colours.
      mermaidQueue = mermaidQueue.then(() => getMermaid()).then((m) => { m.initialize(mermaidConfig()); return m.render(id, d.content); })
        .then(({ svg }) => { box.innerHTML = svg; modernise(box); keepReadable(box); animateMermaid(box); })
        .catch(() => { /* keep the source text visible as a fallback */ });
    } else if (d.type === "svg") {
      box.innerHTML = d.content;
    } else if (d.type === "table") {
      box.className = "table-wrap";
      box.append(tableEl(d));
    } else {
      box.append(h("pre", {}, d.content));
    }
    const wrap = h("div", { class: "block" });
    if (d.caption || d.type === "mermaid") {
      const lb = label("📊", d.caption || "Diagram");
      if (d.type === "mermaid") lb.append(h("button", { class: "replay", type: "button", title: "Replay the animation", onclick: () => replayMermaid(box) }, "↻ Replay"));
      wrap.append(lb);
    }
    wrap.append(box);
    return wrap;
  }
  // Modern look: rounded cards with a soft gradient (nodeGrad, defined in index.html), pill-shaped
  // subgraphs and actors. The colours come from CSS, so they follow the subject hue and dark mode.
  function modernise(box) {
    const svg = box.querySelector("svg");
    if (!svg) return;
    svg.classList.add("mmd-modern");
    const round = (sel, r) => svg.querySelectorAll(sel).forEach((el) => { el.setAttribute("rx", r); el.setAttribute("ry", r); });
    round("g.node rect.basic, g.node rect.label-container, g.node > rect", 14);
    round("g.cluster rect", 18);
    round("rect.actor, rect.note, g.classGroup rect", 12);
  }
  // On a phone a wide diagram would shrink until its text is unreadable: keep it at 70% of its
  // natural size at least, and let the box scroll sideways instead.
  function keepReadable(box) {
    const svg = box.querySelector("svg");
    const vb = svg && svg.viewBox && svg.viewBox.baseVal;
    if (vb && vb.width) svg.style.minWidth = Math.round(vb.width * 0.7) + "px";
  }
  function tableEl(d) {
    return h("table", { class: "data" },
      h("thead", {}, h("tr", {}, d.headers.map((x) => R("th", x)))),
      h("tbody", {}, d.rows.map((r) => h("tr", {}, r.map((c) => R("td", c))))));
  }

  // ---------- motion for mermaid diagrams: nodes materialise, edges draw, data flows, hover explains ----------
  function animateMermaid(box) {
    const svg = box.querySelector("svg");
    if (!svg || reduced()) return;
    const nodes = svg.querySelectorAll("g.cluster, g.node, g.classGroup, g.actor, rect.actor, g.note, rect.note");
    nodes.forEach((n, i) => n.style.setProperty("--d", Math.min(i, 16) * 85));
    const start = Math.min(nodes.length, 16) * 85 + 150;
    const edges = svg.querySelectorAll("path.flowchart-link, path.relation, .edgePaths path, line[class^='messageLine'], path[class^='messageLine']");
    edges.forEach((e, i) => {
      let len = 200;
      try { len = Math.ceil(e.getTotalLength()) || 200; } catch (err) { /* keep default */ }
      e.style.setProperty("--len", len);
      e.style.setProperty("--d", start + Math.min(i, 20) * 110);
      const flows = e.matches("path.flowchart-link, line[class^='messageLine'], path[class^='messageLine']");
      if (flows && !e.nextElementSibling?.classList?.contains("mmd-flow")) {
        const f = e.cloneNode(false);
        f.removeAttribute("id"); f.removeAttribute("marker-end"); f.removeAttribute("marker-start"); f.removeAttribute("style");
        f.setAttribute("class", "mmd-flow");
        f.style.setProperty("--d", start + Math.min(i, 20) * 110 + 600);
        e.after(f);
      }
    });
    svg.querySelectorAll("g.edgeLabel, .messageText, text.relationshipLabel").forEach((l, i) => l.style.setProperty("--d", start + 300 + Math.min(i, 20) * 110));
    box.classList.add("mmd-anim");
    // Hover a flowchart node: light up it, its links and its neighbours.
    const nameOf = (g) => { const m = /^flowchart-(.+)-\d+$/.exec(g.id || ""); return m && m[1]; };
    svg.addEventListener("pointerover", (ev) => {
      const g = ev.target.closest && ev.target.closest("g.node");
      const name = g && nameOf(g);
      svg.querySelectorAll(".on").forEach((x) => x.classList.remove("on"));
      if (!name) return svg.classList.remove("mmd-focus");
      svg.classList.add("mmd-focus");
      g.classList.add("on");
      svg.querySelectorAll(`path.LS-${CSS.escape(name)}, path.LE-${CSS.escape(name)}`).forEach((p) => {
        p.classList.add("on");
        if (p.nextElementSibling?.classList?.contains("mmd-flow")) p.nextElementSibling.classList.add("on");
        p.classList.forEach((c) => {
          const m = /^L[SE]-(.+)$/.exec(c);
          if (m && m[1] !== name) svg.querySelectorAll(`g.node[id^="flowchart-${CSS.escape(m[1])}-"]`).forEach((n) => n.classList.add("on"));
        });
      });
    });
    svg.addEventListener("pointerleave", () => { svg.classList.remove("mmd-focus"); svg.querySelectorAll(".on").forEach((x) => x.classList.remove("on")); });
  }
  function replayMermaid(box) {
    box.classList.remove("mmd-anim");
    void box.offsetWidth;
    box.classList.add("mmd-anim");
  }

  // ---------- animated scenes: step-by-step explainers with moving messages ----------
  const NS = "http://www.w3.org/2000/svg";
  function sv(tag, attrs, parent) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs || {}) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    if (parent) parent.append(el);
    return el;
  }
  function svText(parent, x, y, str, cls) {
    const lines = String(str).split("\n");
    const t = sv("text", { x, y: y - ((lines.length - 1) * 15) / 2, class: cls }, parent);
    lines.forEach((ln, i) => { const ts = sv("tspan", { x, dy: i ? 15 : 0 }, t); ts.textContent = ln; });
    return t;
  }
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  function sceneEl(sc, opts = {}) {
    const scrollMode = !!opts.scroll;
    const W = sc.w || 620, H = sc.h || 300;
    const uid = "sc" + ++mid;
    const svg = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "scene-svg", role: "img", "aria-label": sc.title || "Animated diagram" });
    const defs = sv("defs", {}, svg);
    const mk = sv("marker", { id: uid + "-a", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
    sv("path", { d: "M0,0 L10,5 L0,10 z", class: "sc-arrow" }, mk);
    const zonesG = sv("g", {}, svg), edgesG = sv("g", {}, svg), nodesG = sv("g", {}, svg), packG = sv("g", {}, svg);
    const steps = sc.steps || [];
    const byId = {};
    (sc.zones || []).forEach((z) => {
      z._el = sv("g", { class: "sc-zone" }, zonesG);
      sv("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 14 }, z._el);
      sv("text", { x: z.x + 12, y: z.y + 18 }, z._el).textContent = z.label || "";
    });
    sc.nodes.forEach((n) => {
      n.w = n.w || 128; n.h = n.h || (String(n.label).includes("\n") ? 72 : 58);
      byId[n.id] = n;
      n._el = sv("g", { class: "sc-node" + (n.kind ? " " + n.kind : ""), transform: `translate(${n.x} ${n.y})` }, nodesG);
      const inner = sv("g", { class: "sc-inner" }, n._el);
      sv("rect", { class: "halo", x: -n.w / 2, y: -n.h / 2, width: n.w, height: n.h, rx: 12 }, inner);
      sv("rect", { class: "box", x: -n.w / 2, y: -n.h / 2, width: n.w, height: n.h, rx: n.round ? n.h / 2 : 12 }, inner);
      if (n.icon) {
        sv("text", { x: 0, y: -n.h / 2 + 18, class: "ico" }, inner).textContent = n.icon;
        svText(inner, 0, 10 + (n.h - 58) / 2, n.label, "lbl");
      } else svText(inner, 0, 0, n.label, "lbl");
      n._note = sv("text", { x: 0, y: n.h / 2 + 17, class: "sc-note" }, n._el);
    });
    const clip = (n, tx, ty) => {
      const dx = tx - n.x, dy = ty - n.y;
      if (!dx && !dy) return [n.x, n.y];
      const k = Math.min(dx ? (n.w / 2 + 5) / Math.abs(dx) : Infinity, dy ? (n.h / 2 + 5) / Math.abs(dy) : Infinity);
      return [n.x + dx * k, n.y + dy * k];
    };
    function geom(a, b, bend) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
      const cx = mx + (-dy / L) * (bend || 0), cy = my + (dx / L) * (bend || 0);
      const p1 = clip(a, bend ? cx : b.x, bend ? cy : b.y), p2 = clip(b, bend ? cx : a.x, bend ? cy : a.y);
      const d = bend ? `M${p1[0]},${p1[1]} Q${cx},${cy} ${p2[0]},${p2[1]}` : `M${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`;
      return { d, lx: bend ? (mx + cx) / 2 : mx, ly: bend ? (my + cy) / 2 : my };
    }
    const edges = (sc.edges || []).map((e) => {
      const a = byId[e.from], b = byId[e.to];
      const g = geom(a, b, e.bend);
      const el = sv("g", { class: "sc-edge" + (e.dashed ? " dashed" : "") }, edgesG);
      const p = sv("path", { d: g.d, class: "line", "marker-end": e.noArrow ? null : `url(#${uid}-a)`, "marker-start": e.both ? `url(#${uid}-a)` : null }, el);
      if (e.label) { const t = sv("text", { x: g.lx, y: g.ly - 6, class: "sc-elabel" }, el); t.textContent = e.label; }
      if (e.at == null) e.at = Math.max(a.at || 0, b.at || 0);
      return { ...e, el, path: p };
    });
    // which nodes/edges/zones are visible at step k, and what marks they carry
    const visible = (o, k) => (o.at || 0) <= k && (o.until == null || k < o.until);
    function stateAt(k) {
      const marks = {}, notes = {}, cut = new Set();
      for (let i = 0; i <= k; i++) {
        const st = steps[i] || {};
        if (st.clear) for (const id of (st.clear === true ? Object.keys(marks) : st.clear)) delete marks[id];
        (st.ok || []).forEach((id) => (marks[id] = "ok"));
        (st.fail || []).forEach((id) => (marks[id] = "fail"));
        Object.assign(notes, st.note || {});
        (st.cut || []).forEach((i2) => cut.add(i2));
        (st.mend || []).forEach((i2) => cut.delete(i2));
      }
      return { marks, notes, cut };
    }
    // ---- player ----
    let cur = 0, playing = false, timer = null, token = 0;
    const say = h("div", { class: "scene-say" });
    const num = h("span", { class: "scene-step" });
    const timerBar = h("span");
    const dots = h("div", { class: "scene-dots" });
    const playBtn = h("button", { class: "sc-btn primary", type: "button" });
    const prevBtn = h("button", { class: "sc-btn", type: "button", title: "Previous step", "aria-label": "Previous step" }, "◀");
    const nextBtn = h("button", { class: "sc-btn", type: "button", title: "Next step", "aria-label": "Next step" }, "▶");
    steps.forEach((_, i) => dots.append(h("button", { type: "button", "aria-label": `Step ${i + 1}`, onclick: () => {
      if (scrollMode && cards[i]) return cards[i].scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
      stop(); show(i);
    } })));
    const cards = scrollMode ? steps.map((st, i) => h("div", { class: "scrolly-card", "data-i": i }, h("span", { class: "scene-step" }, `${i + 1} / ${steps.length}`), R("div", st.say || ""))) : [];
    function packet(sd, myToken) {
      let e = edges.find((x) => x.from === sd.from && x.to === sd.to), rev = false;
      if (!e) { e = edges.find((x) => x.from === sd.to && x.to === sd.from); rev = !!e; }
      let path = e && e.path;
      if (!path) { const a = byId[sd.from], b = byId[sd.to]; path = sv("path", { d: geom(a, b, 0).d, class: "sc-ghost" }, edgesG); }
      if (e) e.el.classList.add("active");
      const L = path.getTotalLength();
      const g = sv("g", { class: "sc-pack" + (sd.tone ? " " + sd.tone : "") }, packG);
      const text = String(sd.label || "");
      const pw = Math.max(18, text.length * 6.6 + 16);
      sv("rect", { x: -pw / 2, y: -11, width: pw, height: 22, rx: 11 }, g);
      if (text) sv("text", { x: 0, y: 1 }, g).textContent = text;
      g.style.opacity = 0;
      const dur = reduced() ? 1 : sd.dur || 1100, delay = reduced() ? 0 : sd.delay || 0;
      const t0 = performance.now() + delay;
      const frame = (now) => {
        if (myToken !== token || !svg.isConnected) return g.remove();
        const t = (now - t0) / dur;
        if (t < 0) return requestAnimationFrame(frame);
        const k = ease(Math.min(1, t));
        const pt = path.getPointAtLength(rev ? L * (1 - k) : L * k);
        g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        g.style.opacity = t < 0.08 ? t / 0.08 : t > 1 ? Math.max(0, 1 - (t - 1) * 4) : 1;
        if (t >= 1 && !g._hit) {
          g._hit = true;
          const dest = byId[sd.to]._el;
          dest.classList.remove("hit"); void dest.getBBox(); dest.classList.add("hit");
          if (sd.then) sd.then();
        }
        if (t < 1.25) requestAnimationFrame(frame); else g.remove();
      };
      requestAnimationFrame(frame);
      return delay + dur;
    }
    function show(k) {
      token++;
      packG.innerHTML = "";
      edgesG.querySelectorAll(".sc-ghost").forEach((p) => p.remove());
      cur = Math.max(0, Math.min(steps.length - 1, k));
      const st = steps[cur] || {};
      const { marks, notes, cut } = stateAt(cur);
      (sc.zones || []).forEach((z) => z._el.classList.toggle("is-on", visible(z, cur)));
      sc.nodes.forEach((n) => {
        const c = n._el.classList;
        c.toggle("is-on", visible(n, cur));
        c.toggle("ok", marks[n.id] === "ok");
        c.toggle("fail", marks[n.id] === "fail");
        c.toggle("hl", (st.hl || []).includes(n.id));
        c.toggle("dim", (st.dim || []).includes(n.id));
        n._note.textContent = notes[n.id] || "";
      });
      edges.forEach((e, i) => {
        e.el.classList.toggle("is-on", visible(e, cur) && visible(byId[e.from], cur) && visible(byId[e.to], cur));
        e.el.classList.toggle("cut", cut.has(i));
        e.el.classList.remove("active");
      });
      say.innerHTML = rich(st.say || "");
      say.classList.remove("in"); void say.offsetWidth; say.classList.add("in");
      num.textContent = `${cur + 1} / ${steps.length}`;
      [...dots.children].forEach((d, i) => { d.classList.toggle("on", i === cur); d.classList.toggle("done", i < cur); });
      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur === steps.length - 1;
      const myToken = token;
      let end = 0;
      (st.send || []).forEach((sd) => { end = Math.max(end, packet(sd, myToken)); });
      const wait = Math.max(2600, 1400 + (st.say || "").length * 42, end + 1200);
      timerBar.style.animation = "none"; void timerBar.offsetWidth;
      clearTimeout(timer);
      if (playing) {
        timerBar.style.animation = `scTimer ${wait}ms linear forwards`;
        timer = setTimeout(() => {
          if (myToken !== token || !svg.isConnected) return;
          if (cur < steps.length - 1) show(cur + 1);
          else { playing = false; syncPlay(); }
        }, wait);
      }
      syncPlay();
    }
    function syncPlay() {
      playBtn.textContent = playing ? "⏸ Pause" : cur === steps.length - 1 ? "↻ Replay" : cur === 0 ? "▶ Play" : "▶ Resume";
    }
    function stop() { playing = false; clearTimeout(timer); timerBar.style.animation = "none"; syncPlay(); }
    function play() {
      playing = true;
      root._started = true;
      show(cur === steps.length - 1 ? 0 : cur);
    }
    playBtn.addEventListener("click", () => { if (playing) stop(); else play(); });
    prevBtn.addEventListener("click", () => { stop(); show(cur - 1); });
    nextBtn.addEventListener("click", () => { stop(); show(cur + 1); });
    if (scrollMode) {
      // Scroll-driven: the diagram stays pinned while the step cards scroll past; the card in the middle drives it.
      const sroot = h("div", { class: "scrolly" },
        h("div", { class: "scrolly-stage" }, h("div", { class: "scene-stage" }, svg), h("div", { class: "scrolly-dots" }, dots)),
        h("div", { class: "scrolly-steps" }, cards, h("div", { class: "scrolly-end" }, "✓ Fin de l'animation : continue la leçon ↓")));
      show(0);
      let active = -1;
      const activate = (i) => {
        if (i === active) return;
        active = i;
        cards.forEach((c, j) => c.classList.toggle("on", j === i));
        show(i);
      };
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) activate(Number(e.target.dataset.i)); }),
          { rootMargin: "-42% 0px -48% 0px" });
        cards.forEach((c) => io.observe(c));
      } else cards.forEach((c, i) => c.addEventListener("click", () => activate(i)));
      cards.forEach((c, i) => c.addEventListener("click", () => activate(i)));
      return sroot;
    }
    const root = h("div", { class: "scene" },
      h("div", { class: "scene-stage" }, svg),
      h("div", { class: "scene-timer" }, timerBar),
      h("div", { class: "scene-caption" }, num, say),
      h("div", { class: "scene-controls" }, playBtn, prevBtn, nextBtn, dots));
    show(0);
    // Start playing the first time the scene is mostly on screen.
    if ("IntersectionObserver" in window && !reduced()) {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting && !root._started) { io.disconnect(); playing = true; root._started = true; show(0); }
      }), { threshold: 0.55 });
      io.observe(root);
    }
    return root;
  }
  function sceneBlock(sc) {
    const scroll = !!(state.subject && state.subject.scrollScenes);
    const text = scroll ? "Fais défiler pour animer" : "Watch it step by step";
    return h("div", { class: "block" }, label(scroll ? "🎞️" : "🎬", text + (sc.title ? " : " + sc.title : "")), sceneEl(sc, { scroll }));
  }

  // ---------- routing (in-page state) ----------
  const state = { subject: null, chapter: null, tab: "learn" };
  const app = () => $("#app");
  const TABS = [
    ["learn", "📖 Learn"], ["cheat", "⚡ Cheat sheet"], ["cards", "🃏 Flashcards"], ["quiz", "🎯 Quiz"], ["written", "✍️ Exam questions"],
  ];
  // The URL hash mirrors the state (#/subject/chapter/tab), so the browser's back button works too.
  function toHash() {
    if (!state.subject) return "#/";
    if (!state.chapter) return "#/" + state.subject.id;
    if (state.chapter === "exam") return "#/" + state.subject.id + "/exam";
    return "#/" + state.subject.id + "/" + state.chapter.id + "/" + state.tab;
  }
  function fromHash() {
    const [sid, cid, tab] = (location.hash || "").replace(/^#\/?/, "").split("/").map(decodeURIComponent);
    const subject = SUBJECTS.find((x) => x.id === sid) || null;
    let chapter = null;
    if (subject && cid === "exam") chapter = "exam";
    else if (subject && cid) chapter = subject.chapters.find((c) => c.id === cid) || null;
    const okTab = TABS.some(([k]) => k === tab) ? tab : "learn";
    Object.assign(state, { subject, chapter, tab: okTab });
  }
  function go(next, { replace = false } = {}) {
    Object.assign(state, next);
    const hash = toHash();
    try {
      if (location.hash !== hash) {
        if (replace) history.replaceState(null, "", hash);
        else history.pushState(null, "", hash);
      }
    } catch (e) { /* history unavailable: in-page state still works */ }
    render();
    if (!replace) window.scrollTo({ top: 0, behavior: "instant" });
    else {
      const body = $(".tab-body");
      if (body) {
        const target = body.getBoundingClientRect().top + scrollY - 140;
        if (scrollY > target) window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
      }
    }
  }
  function back() {
    if (state.chapter) go({ chapter: null });
    else go({ subject: null, chapter: null });
  }

  function crumbLink(text, next) {
    return h("button", { class: "crumb", onclick: () => go(next) }, text);
  }
  function crumbs() {
    const c = $("#crumbs");
    c.innerHTML = "";
    const parts = [];
    if (state.subject) parts.push(state.chapter ? crumbLink(state.subject.title, { chapter: null }) : h("span", {}, state.subject.title));
    if (state.chapter === "exam") parts.push(h("span", {}, "Final exam"));
    else if (state.chapter) parts.push(h("span", {}, state.chapter.short || state.chapter.title));
    parts.forEach((p, i) => { if (i) c.append(h("span", { class: "crumb-sep", "aria-hidden": "true" }, "/")); c.append(p); });
  }
  function backBar() {
    if (!state.subject) return null;
    const text = state.chapter ? "Back to chapters" : "All subjects";
    return h("div", { class: "row backbar" },
      h("button", { class: "btn back", onclick: back }, h("span", { class: "arrow" }, "←"), text),
      state.chapter ? h("button", { class: "btn ghost", onclick: () => go({ subject: null, chapter: null }) }, "🏠 Home") : null);
  }

  // Each direct child of a view rises in, one after another; grids stagger their cards too.
  function stagger(view) {
    [...view.children].forEach((c, i) => { c.classList.add("anim"); c.style.setProperty("--i", Math.min(i, 8)); });
    view.querySelectorAll(".grid, .stats, .cheat").forEach((g) =>
      [...g.children].forEach((c, i) => { c.classList.add("anim"); c.style.setProperty("--i", Math.min(i + 1, 10)); }));
  }
  let revealObs = null;
  function reveal(root) {
    if (!("IntersectionObserver" in window) || reduced()) return;
    if (revealObs) revealObs.disconnect();
    revealObs = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px" });
    root.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
  }

  let lastViewKey = "";
  function render() {
    crumbs();
    const hue = state.subject ? state.subject.hue ?? DEFAULT_HUE : DEFAULT_HUE;
    document.documentElement.style.setProperty("--h", hue);
    const key = (state.subject ? state.subject.id : "") + "/" + (state.chapter === "exam" ? "exam" : state.chapter ? state.chapter.id : "");
    const root = app();
    root.classList.toggle("same-view", key === lastViewKey);
    lastViewKey = key;
    root.innerHTML = "";
    let view;
    if (!state.subject) view = homeView();
    else if (!state.chapter) view = subjectView(state.subject);
    else if (state.chapter === "exam") view = examView(state.subject);
    else view = chapterView(state.subject, state.chapter);
    const bb = backBar();
    if (bb) view.prepend(bb);
    view.classList.add("view");
    root.append(view);
    stagger(view);
    reveal(view);
    onScroll();
  }

  // ---------- views ----------
  const TIPS = [
    "Explaining a concept out loud is the fastest way to find what you don't know yet.",
    "Short sessions with breaks beat one long cram. Try 25 minutes on, 5 off.",
    "Get a question wrong? Great: that's exactly the one you'll remember tomorrow.",
    "Flashcards work best when you say the answer before you flip.",
    "Draw the diagram from memory, then compare. It sticks far better than rereading.",
  ];
  function greeting() {
    const hr = new Date().getHours();
    return hr < 5 ? "Late-night session" : hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  }
  function totals() {
    let known = 0, read = 0, lessons = 0, cards = 0;
    for (const s of SUBJECTS) for (const ch of s.chapters) {
      const st = (store[s.id] || {})[ch.id];
      lessons += ch.sections.length; cards += (ch.flashcards || []).length;
      if (st) { known += st.known.length; read += st.read.length; }
    }
    return { known, read, lessons, cards };
  }
  function statTile(ico, value, lbl, color, extra) {
    const num = h("div", { class: "num" }, "0");
    countUp(num, value);
    return h("div", { class: "stat", style: color ? `--c:${color}` : null }, h("div", { class: "ico" }, ico), num, h("div", { class: "lbl" }, lbl), extra || null);
  }
  function homeView() {
    const m = meta();
    const t = totals();
    const lvlPct = Math.round(((m.xp || 0) % LEVEL_XP) / LEVEL_XP * 100);
    return h("div", {},
      h("div", { class: "hero" },
        h("div", { class: "eyebrow" }, greeting(), " ", h("span", { class: "wave" }, "👋")),
        h("h1", { html: 'What are we <span class="grad-text">studying</span> today?' }),
        h("p", { class: "lede" }, "Pick a subject. Each one has plain-language lessons, analogies, diagrams, a cheat sheet, flashcards and quizzes that score you and explain every answer.")),
      h("div", { class: "stats" },
        statTile("⚡", m.xp || 0, `XP · level ${levelOf(m.xp || 0)}`, null, h("div", { class: "level-bar", title: `${lvlPct}% to next level` }, h("span", { style: `width:${lvlPct}%` }))),
        statTile("🔥", liveStreak(), "day streak", "linear-gradient(90deg,#ff9a3c,#ff4d6d)"),
        statTile("🧠", t.known, `of ${t.cards} cards known`, "linear-gradient(90deg,#22c55e,#14b8a6)"),
        statTile("📖", t.read, `of ${t.lessons} lessons done`, "linear-gradient(90deg,#3b82f6,#8b5cf6)")),
      h("div", { class: "grid" },
        SUBJECTS.map((s) => {
          const total = s.chapters.length;
          const qn = s.chapters.reduce((n, c) => n + (c.quiz || []).length, 0);
          const pct = subjectProgress(s);
          return h("button", { class: "card hued", style: `--h:${s.hue ?? DEFAULT_HUE}`, onclick: () => go({ subject: s, chapter: null }) },
            h("div", { class: "card-band" }, h("span", { class: "card-emoji" }, s.emoji || "📘"), h("span", { class: "card-code" }, s.code || "Subject")),
            h("h2", {}, s.title),
            s.description ? h("p", { class: "meta" }, s.description) : null,
            h("div", { class: "row" },
              h("span", { class: "pill" }, `${total} chapter${total === 1 ? "" : "s"}`),
              h("span", { class: "pill" }, `${qn} questions`),
              pct ? h("span", { class: "pill hot" }, `${pct}% studied`) : null),
            h("div", { class: "progress", title: `${pct}% studied` }, h("span", { style: `width:${pct}%` })));
        }),
        h("div", { class: "card add" },
          h("div", { style: "font-size:1.8rem" }, "➕"),
          h("h3", {}, "Add another subject"),
          h("p", { class: "meta", html: "Drop a new file in <code>subjects/</code> and list it in <code>index.html</code>. The README shows the format." }))),
      h("div", { class: "section tip" }, label("💡", "Study tip"), h("p", {}, TIPS[Math.floor(Math.random() * TIPS.length)])));
  }

  function subjectProgress(s) {
    let done = 0, all = 0;
    for (const ch of s.chapters) {
      const st = (store[s.id] || {})[ch.id];
      all += ch.sections.length;
      done += st ? st.read.length : 0;
    }
    return all ? Math.round((done / all) * 100) : 0;
  }
  function ring(pct) {
    const r = 23, len = 2 * Math.PI * r;
    return h("div", { class: "ring", title: `${pct}% read` },
      svgEl(`<svg viewBox="0 0 54 54" aria-hidden="true"><circle class="track" cx="27" cy="27" r="${r}"/><circle class="val" cx="27" cy="27" r="${r}" style="--len:${len};stroke-dasharray:${len};stroke-dashoffset:${len * (1 - pct / 100)}"/></svg>`),
      h("span", {}, `${pct}%`));
  }

  function subjectView(s) {
    const totalQ = s.chapters.reduce((n, c) => n + (c.quiz || []).length, 0);
    return h("div", {},
      h("div", { class: "hero" },
        h("div", { class: "eyebrow" }, `${s.emoji || "📘"}  ${s.code || "Subject"}`),
        h("h1", { class: "grad-text" }, s.title),
        s.description ? h("p", { class: "lede" }, s.description) : null),
      s.studyPlan ? h("div", { class: "section" },
        h("h3", {}, "🗺️ Suggested plan for tonight"),
        h("ol", { class: "steps" }, s.studyPlan.map((p) => R("li", p)))) : null,
      h("div", { class: "grid" },
        s.chapters.map((ch, i) => {
          const st = chState(s.id, ch.id);
          const pct = ch.sections.length ? Math.round((st.read.length / ch.sections.length) * 100) : 0;
          return h("button", { class: "card", onclick: () => go({ chapter: ch, tab: "learn" }) },
            h("div", { class: "ch-top" },
              h("div", { class: "stack", style: "gap:4px" },
                h("span", { class: "eyebrow" }, "Chapter"),
                h("span", { class: "ch-num" }, String(ch.number ?? i + 1).padStart(2, "0"))),
              ring(pct)),
            h("h2", {}, ch.title),
            ch.overview ? R("p", ch.overview, "meta") : null,
            h("div", { class: "row" },
              h("span", { class: "pill" }, `📖 ${ch.sections.length}`),
              h("span", { class: "pill" }, `🃏 ${(ch.flashcards || []).length}`),
              h("span", { class: "pill" }, `🎯 ${(ch.quiz || []).length}`),
              st.best != null ? h("span", { class: "pill " + (st.best >= 70 ? "good" : "bad") }, `Best ${st.best}%`) : null));
        })),
      totalQ ? h("div", { class: "section cta" },
        h("div", { class: "cta-emoji" }, "🏁"),
        h("h2", {}, "Final exam simulation"),
        h("p", { class: "meta" }, `A mixed quiz drawn from every chapter (${totalQ} questions in the bank), plus written exam-style questions with model answers.`),
        h("div", { class: "row" }, h("button", { class: "btn", onclick: () => go({ chapter: "exam" }) }, "Start the final exam →"))) : null);
  }

  function chapterView(s, ch) {
    const tabs = h("div", { class: "tabs", role: "tablist" },
      TABS.filter(([k]) => k !== "written" || (ch.written || []).length).map(([k, text]) =>
        h("button", { class: "tab", role: "tab", "aria-selected": String(state.tab === k), onclick: () => go({ tab: k }, { replace: true }) }, text)));
    const body = { learn: learnTab, cheat: cheatTab, cards: cardsTab, quiz: quizTab, written: writtenTab }[state.tab](s, ch);
    body.classList.add("tab-body");
    return h("div", {},
      h("div", { class: "hero" },
        h("div", { class: "eyebrow" }, `${s.emoji || "📘"}  Chapter ${ch.number ?? ""}`),
        h("h1", {}, ch.title),
        ch.overview ? R("p", ch.overview, "lede") : null),
      tabs, body);
  }

  function learnTab(s, ch) {
    const st = chState(s.id, ch.id);
    const total = ch.sections.length;
    const counter = h("span", { class: "pill hot" }, `${st.read.length}/${total} understood`);
    const bar = h("span", { style: `width:${total ? (st.read.length / total) * 100 : 0}%` });
    const refresh = () => { counter.textContent = `${st.read.length}/${total} understood`; bar.style.width = `${(st.read.length / total) * 100}%`; };
    return h("div", { class: "stack", style: "gap:18px" },
      h("div", { class: "stack", style: "gap:8px" },
        h("div", { class: "bar-meta" }, h("span", {}, "Your progress in this chapter"), counter),
        h("div", { class: "progress" }, bar)),
      ch.bigPicture ? h("div", { class: "section big-picture" },
        label("🔭", "The big picture"),
        R("p", ch.bigPicture),
        diagramEl(ch.bigPictureDiagram)) : null,
      ch.sections.map((sec, i) => {
        const fr = !!(state.subject && state.subject.lang === "fr");
        let done = st.read.includes(i);
        const btn = h("button", { class: "btn" + (done ? " done" : "") }, done ? "✓ Understood" : "Mark as understood");
        const badge = h("span", { class: "done-badge", hidden: !done }, "✓ Done");
        const art = h("article", { class: "section lesson reveal" + (done ? " is-done" : "") },
          h("div", { class: "section-head" }, h("span", { class: "section-num" }, `${ch.number ?? ""}.${i + 1}`), badge),
          h("h2", {}, sec.title),
          // Diagram-first: one line of text, then the visuals, then the essentials; the long text is folded.
          sec.simple ? h("div", { class: "block lead" }, R("p", sec.simple)) : null,
          (sec.diagrams || (sec.diagram ? [sec.diagram] : [])).map(diagramEl),
          (sec.scenes || []).map(sceneBlock),
          sec.table ? h("div", { class: "table-wrap" }, tableEl(sec.table)) : null,
          sec.analogy ? h("div", { class: "block analogy" }, label("💡", fr ? "Comme…" : "Think of it like"), R("p", sec.analogy)) : null,
          (sec.code || []).map(codeEl),
          sec.examTip ? h("div", { class: "block tip" }, label("🎯", fr ? "À l'examen" : "Exam tip"), R("p", sec.examTip)) : null,
          (sec.points && sec.points.length) || sec.example ? h("details", { class: "more" },
            h("summary", {}, fr ? "📖 Lire le détail (points clés, exemple concret)" : "📖 Read the details (key points, real-life example)"),
            sec.points && sec.points.length ? h("div", { class: "block" }, label("📌", fr ? "Points clés" : "Key points"), h("ul", { class: "points" }, sec.points.map((p) => R("li", p)))) : null,
            sec.example ? h("div", { class: "block example" }, label("🧪", fr ? "Exemple concret" : "Real-life example"), R("p", sec.example)) : null) : null,
          h("div", { class: "row" }, btn));
        btn.addEventListener("click", () => {
          const at = st.read.indexOf(i);
          if (at >= 0) st.read.splice(at, 1); else st.read.push(i);
          done = st.read.includes(i);
          save();
          btn.textContent = done ? "✓ Understood" : "Mark as understood";
          btn.classList.toggle("done", done);
          art.classList.toggle("is-done", done);
          badge.hidden = !done;
          refresh();
          const pt = centerOf(btn);
          if (done) {
            confetti(pt[0], pt[1], 24, 0.6);
            addXP(15, pt);
            if (st.read.length === total) setTimeout(() => { toast("📚 Chapter fully read! Time for the flashcards."); bigConfetti(); }, 400);
          } else addXP(-15, pt);
        });
        return art;
      }),
      h("div", { class: "row" },
        h("button", { class: "btn primary", onclick: () => go({ tab: "cards" }, { replace: true }) }, "Next: flashcards 🃏"),
        h("button", { class: "btn", onclick: () => go({ tab: "quiz" }, { replace: true }) }, "Skip to the quiz 🎯")));
  }

  function cheatTab(s, ch) {
    const items = ch.cheatsheet || [];
    const list = h("div", { class: "cheat" });
    const draw = (q) => {
      list.innerHTML = "";
      const f = q.trim().toLowerCase();
      const shown = items.filter((x) => !f || (x.term + " " + x.def).toLowerCase().includes(f));
      if (!shown.length) list.append(h("div", { class: "empty" }, "No term matches that search."));
      shown.forEach((x, k) => list.append(h("div", { class: "cheat-item anim", style: `--k:${k % 6};--i:${Math.min(k, 10)}` }, R("div", x.term, "term"), R("div", x.def))));
    };
    draw("");
    return h("div", { class: "stack" },
      h("div", { class: "search-wrap" }, h("input", { id: "cheat-search", class: "search", type: "search", placeholder: "Filter terms…", oninput: (e) => draw(e.target.value) })),
      list,
      ch.compare ? ch.compare.map((t) => h("div", { class: "section reveal" }, h("h3", {}, "⚖️ " + t.title), h("div", { class: "table-wrap" }, tableEl(t)))) : null,
      ch.mnemonics && ch.mnemonics.length ? h("div", { class: "section reveal tip" }, h("h3", {}, "🧩 Memory hooks"), h("ul", { class: "points" }, ch.mnemonics.map((m) => R("li", m)))) : null);
  }

  function cardsTab(s, ch) {
    const st = chState(s.id, ch.id);
    const all = (ch.flashcards || []).map((c, i) => ({ ...c, i }));
    if (!all.length) return h("div", { class: "empty" }, "No flashcards in this chapter yet.");
    let mode = "all";
    let deck = [], pos = 0, busy = false, flipCard = null, markCard = null;
    let sessionKnown = 0;
    const root = h("div", { class: "stack" });
    function build() {
      deck = mode === "weak" ? all.filter((c) => st.again.includes(c.i)) : shuffle(all);
      pos = 0; sessionKnown = 0; draw();
    }
    function draw() {
      root.innerHTML = "";
      flipCard = markCard = null;
      const controls = h("div", { class: "row", style: "justify-content:space-between" },
        h("div", { class: "row" },
          h("button", { class: "btn" + (mode === "all" ? " primary" : ""), onclick: () => { mode = "all"; build(); } }, "All cards"),
          h("button", { class: "btn" + (mode === "weak" ? " primary" : ""), onclick: () => { mode = "weak"; build(); } }, `Review mistakes (${st.again.length})`)),
        h("span", { class: "pill good" }, `🧠 ${st.known.length}/${all.length} known`));
      root.append(controls);
      if (!deck.length) return root.append(h("div", { class: "empty" }, "No cards to review here. Mark cards as “Again” to collect them."));
      if (pos >= deck.length) {
        const pct = Math.round((sessionKnown / deck.length) * 100);
        if (pct >= 70) setTimeout(bigConfetti, 150);
        return root.append(h("div", { class: "section result" },
          h("div", { class: "verdict-emoji" }, pct >= 85 ? "🏆" : pct >= 60 ? "🎉" : "💪"),
          h("h2", {}, "Deck finished"),
          h("p", {}, `You knew ${sessionKnown} of ${deck.length} this round. ${st.again.length} card${st.again.length === 1 ? "" : "s"} still need another pass.`),
          h("div", { class: "row", style: "justify-content:center" },
            h("button", { class: "btn primary", onclick: build }, "Go again"),
            st.again.length ? h("button", { class: "btn", onclick: () => { mode = "weak"; build(); } }, "Review mistakes only") : null,
            h("button", { class: "btn", onclick: () => go({ tab: "quiz" }, { replace: true }) }, "Take the quiz 🎯"))));
      }
      const c = deck[pos];
      const card = h("div", { class: "flash", tabindex: "0", role: "button", "aria-label": "Flip card" },
        h("div", { class: "flash-face front" }, R("div", c.q, "flash-q"), h("div", { class: "flash-hint" }, "Tap to reveal · swipe → if you knew it, ← if not")),
        h("div", { class: "flash-face back" }, h("div", { class: "block-label", style: "justify-content:center" }, "Answer"), R("div", c.a)));
      const mover = h("div", { class: "flash-mover" }, card);
      flipCard = () => card.classList.toggle("flipped");
      markCard = (known) => {
        if (busy) return;
        busy = true;
        const rm = (arr) => { const k = arr.indexOf(c.i); if (k >= 0) arr.splice(k, 1); };
        rm(st.known); rm(st.again);
        (known ? st.known : st.again).push(c.i);
        if (known) sessionKnown++;
        save();
        const pt = centerOf(mover);
        addXP(known ? 5 : 1, pt);
        if (known) confetti(pt[0], pt[1], 14, 0.5);
        mover.style.transform = "";
        mover.classList.add(known ? "out-right" : "out-left");
        setTimeout(() => { busy = false; pos++; draw(); }, reduced() ? 0 : 330);
      };
      // drag / swipe
      let x0 = null, dx = 0, dragged = false;
      mover.addEventListener("pointerdown", (e) => { x0 = e.clientX; dx = 0; dragged = false; mover.setPointerCapture(e.pointerId); mover.style.transition = "none"; });
      mover.addEventListener("pointermove", (e) => {
        if (x0 == null) return;
        dx = e.clientX - x0;
        if (Math.abs(dx) > 6) dragged = true;
        mover.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
        mover.style.setProperty("--swipe", Math.max(-1, Math.min(1, dx / 120)));
      });
      const release = () => {
        if (x0 == null) return;
        x0 = null;
        mover.style.transition = "";
        if (Math.abs(dx) > 90) return markCard(dx > 0);
        mover.style.transform = "";
        mover.style.setProperty("--swipe", 0);
        if (!dragged) flipCard();
      };
      mover.addEventListener("pointerup", release);
      mover.addEventListener("pointercancel", release);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); flipCard(); } });
      root.append(
        h("div", { class: "bar-meta" }, h("span", {}, `Card ${pos + 1} of ${deck.length}`), h("span", {}, mode === "weak" ? "Mistakes deck" : "🔀 Shuffled")),
        h("div", { class: "progress" }, h("span", { style: `width:${(pos / deck.length) * 100}%` })),
        h("div", { class: "flash-stage" }, mover),
        h("div", { class: "row", style: "justify-content:center" },
          h("button", { class: "btn again", onclick: () => markCard(false) }, "↺ Again"),
          h("button", { class: "btn primary", onclick: () => markCard(true) }, "✓ I knew it")),
        h("div", { class: "flash-keys", html: 'Keyboard: <span class="kbd">Space</span> flip · <span class="kbd">→</span> knew it · <span class="kbd">←</span> again' }));
    }
    bindKeys(root, (e) => {
      if (!flipCard) return;
      if (e.key === " ") { e.preventDefault(); flipCard(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); markCard(true); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); markCard(false); }
    });
    build();
    return root;
  }

  // ---------- quiz engine ----------
  function quizRunner(questions, { onFinish, title }) {
    const root = h("div", { class: "stack" });
    let qs, pos, score, wrong, combo, bestCombo;
    let pick = null, advance = null;
    function start(list) {
      qs = shuffle(list).map((q) => q.type === "tf" ? q : { ...q, _order: shuffle(q.options.map((_, i) => i)) });
      pos = 0; score = 0; wrong = []; combo = 0; bestCombo = 0; draw();
    }
    function draw() {
      root.innerHTML = "";
      pick = advance = null;
      if (pos >= qs.length) return finish();
      const q = qs[pos];
      const fb = h("div");
      const scoreChip = h("span", { class: "score-chip" }, `✓ ${score}`);
      const comboEl = h("span", {});
      const next = h("button", { class: "btn primary", hidden: true, onclick: () => { pos++; draw(); } }, pos + 1 < qs.length ? "Next question →" : "See my score 🏁");
      let btns = [];
      let answered = false;
      const answer = (picked, correctIdx) => {
        if (answered) return;
        answered = true;
        const ok = picked === correctIdx;
        const pt = centerOf(btns[picked]);
        if (ok) {
          score++; combo++; bestCombo = Math.max(bestCombo, combo);
          addXP(10 + Math.min(combo - 1, 5) * 2, pt);
          confetti(pt[0], pt[1], combo >= 3 ? 30 : 16, combo >= 3 ? 0.8 : 0.55);
        } else { combo = 0; wrong.push({ q, picked }); }
        btns.forEach((b, k) => {
          b.disabled = true;
          if (k === correctIdx) b.classList.add("correct");
          else if (k === picked) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        scoreChip.textContent = `✓ ${score}`;
        scoreChip.classList.add("bump");
        comboEl.innerHTML = "";
        if (combo >= 2) comboEl.append(h("span", { class: "combo" }, `🔥 ${combo} in a row!`));
        fb.className = "feedback " + (ok ? "good" : "bad");
        const praise = ["Correct!", "Nice!", "Exactly!", "You got it!", "Spot on!"];
        fb.innerHTML = `<strong>${ok ? praise[Math.floor(Math.random() * praise.length)] : "Not quite."}</strong> ` + rich(q.explain || "");
        next.hidden = false; next.focus({ preventScroll: true });
        advance = () => { pos++; draw(); };
      };
      if (q.type === "tf") {
        const correctIdx = q.answer ? 0 : 1;
        btns = ["True", "False"].map((l, k) => h("button", { class: "opt", style: `--i:${k}`, onclick: () => answer(k, correctIdx) }, h("span", { class: "key" }, k === 0 ? "✓" : "✗"), h("span", {}, l)));
        pick = (k) => { if (k < 2) answer(k, correctIdx); };
      } else {
        const correctIdx = q._order.indexOf(q.answer);
        btns = q._order.map((oi, k) => h("button", { class: "opt", style: `--i:${k}`, onclick: () => answer(k, correctIdx) }, h("span", { class: "key" }, "ABCDEFG"[k]), R("span", q.options[oi])));
        pick = (k) => { if (k < btns.length) answer(k, correctIdx); };
      }
      if (combo >= 2) comboEl.append(h("span", { class: "combo" }, `🔥 ${combo} in a row!`));
      root.append(
        h("div", { class: "bar-meta" }, h("span", {}, `${title || "Quiz"} · ${pos + 1} / ${qs.length}`), comboEl, scoreChip),
        h("div", { class: "progress" }, h("span", { style: `width:${(pos / qs.length) * 100}%` })),
        h("div", { class: "q-card enter" },
          q.topic ? h("div", { class: "eyebrow" }, q.topic) : null,
          R("div", q.type === "tf" ? "True or false: " + q.q : q.q, "q-text"), h("div", { class: "opts" }, btns), fb,
          h("div", { class: "row", style: "justify-content:space-between" }, next,
            h("span", { class: "flash-keys", html: 'Keys: <span class="kbd">A</span>–<span class="kbd">D</span> answer · <span class="kbd">Enter</span> next' }))));
    }
    function finish() {
      const pct = Math.round((score / qs.length) * 100);
      onFinish && onFinish(pct);
      const verdict = pct >= 85 ? "Exam ready on this material." : pct >= 70 ? "Solid. Review the misses below once more." : pct >= 50 ? "Getting there. Re-read the lessons for the topics you missed." : "Go back to the lessons and flashcards, then retry.";
      const emoji = pct >= 85 ? "🏆" : pct >= 70 ? "🎉" : pct >= 50 ? "💪" : "📚";
      const r = 72, len = 2 * Math.PI * r;
      const ringSvg = svgEl(`<svg viewBox="0 0 170 170" aria-hidden="true"><circle class="track" cx="85" cy="85" r="${r}"/><circle class="val" cx="85" cy="85" r="${r}" style="stroke-dasharray:${len};stroke-dashoffset:${len}"/></svg>`);
      const num = h("div", { class: "num" }, "0%");
      root.append(h("div", { class: "section result" },
        h("div", { class: "eyebrow" }, "Result"),
        h("div", { class: "score-ring" }, ringSvg, num),
        h("div", { class: "verdict-emoji" }, emoji),
        h("h2", {}, `${score} of ${qs.length} correct`),
        h("p", { class: "meta" }, verdict),
        bestCombo >= 3 ? h("span", { class: "pill hot" }, `🔥 Best streak: ${bestCombo} in a row`) : null,
        h("div", { class: "row", style: "justify-content:center" },
          h("button", { class: "btn primary", onclick: () => start(questions) }, "↻ Retake"),
          wrong.length ? h("button", { class: "btn", onclick: () => start(wrong.map((w) => stripOrder(w.q))) }, `Retry my ${wrong.length} mistakes`) : null)));
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ringSvg.querySelector(".val").style.strokeDashoffset = len * (1 - pct / 100);
        if (reduced()) { num.textContent = pct + "%"; return; }
        const t0 = performance.now();
        const step = (t) => { const k = Math.min(1, (t - t0) / 1400); num.textContent = Math.round(pct * (1 - Math.pow(1 - k, 3))) + "%"; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }));
      if (pct >= 70) setTimeout(bigConfetti, 700);
      if (wrong.length) {
        root.append(h("h3", {}, "🔍 Review your mistakes"));
        wrong.forEach(({ q }) => {
          const right = q.type === "tf" ? (q.answer ? "True" : "False") : q.options[q.answer];
          root.append(h("div", { class: "q-card reveal" }, R("div", q.q, "q-text"),
            h("div", { class: "feedback good", html: "<strong>Answer:</strong> " + rich(right) }),
            q.explain ? R("p", q.explain) : null));
        });
        reveal(root);
      }
    }
    const stripOrder = (q) => { const { _order, ...rest } = q; return rest; };
    bindKeys(root, (e) => {
      const k = e.key.toLowerCase();
      if (pick && "abcdefg".includes(k) && k.length === 1) { e.preventDefault(); pick("abcdefg".indexOf(k)); }
      else if (pick && /^[1-7]$/.test(k)) { e.preventDefault(); pick(Number(k) - 1); }
      else if (advance && e.key === "Enter" && !(e.target.closest && e.target.closest("button"))) { e.preventDefault(); advance(); }
    });
    start(questions);
    return root;
  }

  function quizTab(s, ch) {
    const qs = ch.quiz || [];
    if (!qs.length) return h("div", { class: "empty" }, "No quiz questions in this chapter yet.");
    const st = chState(s.id, ch.id);
    return quizRunner(qs, {
      title: "Chapter quiz",
      onFinish: (pct) => {
        const prev = st.best;
        st.best = Math.max(st.best ?? 0, pct); save();
        if (prev != null && pct > prev) setTimeout(() => toast(`⭐ New best on this chapter: ${pct}%`), 900);
      },
    });
  }

  function writtenList(items) {
    return h("div", { class: "stack" },
      h("p", { class: "lede" }, "Answer in your own words first, then reveal the model answer and grade yourself honestly."),
      items.map((w, i) => {
        const model = h("div", { class: "feedback good", hidden: true }, label("✅", "Model answer"), R("div", w.answer));
        const ta = h("textarea", { class: "answer", id: "written-" + i, placeholder: "Write your answer here…" });
        let rewarded = false;
        return h("div", { class: "q-card reveal" },
          h("div", { class: "row", style: "justify-content:space-between" }, h("span", { class: "pill" }, `✍️ Question ${i + 1}`), w.topic ? h("span", { class: "eyebrow" }, w.topic) : null),
          R("div", w.q, "q-text"), ta,
          h("div", { class: "row" }, h("button", {
            class: "btn", onclick: (e) => {
              model.hidden = !model.hidden;
              e.currentTarget.textContent = model.hidden ? "Show model answer" : "Hide model answer";
              if (!model.hidden && !rewarded && ta.value.trim().length > 20) { rewarded = true; addXP(8, centerOf(e.currentTarget)); }
            },
          }, "Show model answer")),
          model);
      }));
  }
  function writtenTab(s, ch) { return writtenList(ch.written || []); }

  function examView(s) {
    const bank = s.chapters.flatMap((c) => (c.quiz || []).map((q) => ({ ...q, topic: q.topic || `Ch. ${c.number ?? ""} ${c.short || c.title}` })));
    const written = s.chapters.flatMap((c) => (c.written || []).map((w) => ({ ...w, topic: w.topic || `Ch. ${c.number ?? ""} ${c.short || c.title}` })));
    let tab = "mcq";
    const body = h("div", { class: "tab-body" });
    const tabs = h("div", { class: "tabs" });
    const draw = () => {
      tabs.innerHTML = "";
      [["mcq", "🎲 Mixed quiz (20)"], ["full", "📚 Full bank (" + bank.length + ")"], ["written", "✍️ Written questions"]].forEach(([k, l]) =>
        tabs.append(h("button", { class: "tab", "aria-selected": String(tab === k), onclick: () => { tab = k; draw(); } }, l)));
      body.innerHTML = "";
      if (tab === "written") { body.append(written.length ? writtenList(written) : h("div", { class: "empty" }, "No written questions yet.")); reveal(body); }
      else body.append(quizRunner(tab === "mcq" ? shuffle(bank).slice(0, 20) : bank, { title: "Final exam" }));
    };
    draw();
    return h("div", {},
      h("div", { class: "hero" }, h("div", { class: "eyebrow" }, `🏁  ${s.title}`), h("h1", { class: "grad-text" }, "Final exam simulation"),
        h("p", { class: "lede" }, "Questions are drawn from every chapter and shuffled. Each answer is explained right away.")),
      tabs, body);
  }

  // ---------- global interactions ----------
  function onScroll() {
    const bar = $("#read-progress");
    if (!bar) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty("--p", max > 40 ? Math.min(1, scrollY / max) : 0);
  }
  let tilted = null;
  function onPointerMove(e) {
    if (e.pointerType !== "mouse" || reduced()) return;
    const card = e.target.closest && e.target.closest(".card:not(.add)");
    if (tilted && tilted !== card) { tilted.style.removeProperty("--rx"); tilted.style.removeProperty("--ry"); tilted = null; }
    if (!card) return;
    tilted = card;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", px * 100 + "%");
    card.style.setProperty("--my", py * 100 + "%");
    card.style.setProperty("--ry", ((px - 0.5) * 7).toFixed(2) + "deg");
    card.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
  }
  function onPointerDown(e) {
    const b = e.target.closest && e.target.closest(".btn, .opt, .tab");
    if (!b || reduced() || b.disabled) return;
    const r = b.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const dot = h("span", { class: "ripple", style: `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px` });
    if (getComputedStyle(b).position === "static") b.style.position = "relative";
    b.style.overflow = "hidden";
    b.append(dot);
    setTimeout(() => dot.remove(), 650);
  }

  // ---------- boot ----------
  function boot() {
    $("#home").addEventListener("click", () => go({ subject: null, chapter: null }));
    const tbtn = $("#theme");
    const setTheme = (t) => { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); try { localStorage.setItem("studyhub:theme", t || ""); } catch (e) {} };
    const syncIcon = () => { tbtn.textContent = isDark() ? "☀️" : "🌙"; };
    try { const t = localStorage.getItem("studyhub:theme"); if (t) setTheme(t); } catch (e) {}
    syncIcon();
    tbtn.addEventListener("click", () => { setTheme(isDark() ? "light" : "dark"); syncIcon(); render(); });
    window.addEventListener("popstate", () => { fromHash(); render(); });
    window.addEventListener("hashchange", () => { fromHash(); render(); });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.subject && !e.target.closest("input, textarea")) back();
    });
    renderXP(false);
    fromHash();
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
