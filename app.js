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
  };

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
  // Light inline markup for content: **bold**, `code`, line breaks.
  function rich(text) {
    const esc = String(text ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    return esc
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }
  const R = (tag, text, cls) => h(tag, { class: cls, html: rich(text) });
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- mermaid (lazy) ----------
  let mermaidReady = null;
  function isDark() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
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
      }).then((m) => {
        m.initialize({ startOnLoad: false, securityLevel: "strict", theme: isDark() ? "dark" : "neutral", fontFamily: "Atkinson Hyperlegible, sans-serif" });
        return m;
      });
    }
    return mermaidReady;
  }
  let mid = 0;
  function diagramEl(d) {
    if (!d) return null;
    const box = h("div", { class: "diagram" });
    if (d.type === "mermaid") {
      box.append(h("pre", {}, d.content));
      const id = "mmd" + ++mid;
      getMermaid().then((m) => m.render(id, d.content)).then(({ svg }) => { box.innerHTML = svg; })
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
    if (d.caption) wrap.append(h("div", { class: "block-label" }, d.caption));
    wrap.append(box);
    return wrap;
  }
  function tableEl(d) {
    return h("table", { class: "data" },
      h("thead", {}, h("tr", {}, d.headers.map((x) => R("th", x)))),
      h("tbody", {}, d.rows.map((r) => h("tr", {}, r.map((c) => R("td", c))))));
  }

  // ---------- routing (in-page state) ----------
  const state = { subject: null, chapter: null, tab: "learn" };
  const app = () => $("#app");
  function go(next) {
    Object.assign(state, next);
    render();
    window.scrollTo({ top: 0 });
  }

  function crumbs() {
    const c = $("#crumbs");
    const parts = [];
    if (state.subject) parts.push(state.subject.title);
    if (state.chapter && state.chapter !== "exam") parts.push(state.chapter.short || state.chapter.title);
    if (state.chapter === "exam") parts.push("Final exam");
    c.textContent = parts.join("  /  ");
  }

  function render() {
    crumbs();
    const root = app();
    root.innerHTML = "";
    if (!state.subject) return root.append(homeView());
    if (!state.chapter) return root.append(subjectView(state.subject));
    if (state.chapter === "exam") return root.append(examView(state.subject));
    root.append(chapterView(state.subject, state.chapter));
  }

  // ---------- views ----------
  function homeView() {
    const frag = h("div", { class: "stack", style: "gap:24px" },
      h("div", { class: "stack" },
        h("div", { class: "eyebrow" }, "Choose a subject"),
        h("h1", {}, "What are we studying today?"),
        h("p", { class: "lede" }, "Each subject has plain-language lessons, analogies, diagrams, a cheat sheet, flashcards and quizzes that score you and explain every answer.")),
      h("div", { class: "grid" },
        SUBJECTS.map((s) => {
          const total = s.chapters.length;
          const pct = subjectProgress(s);
          return h("button", { class: "card", onclick: () => go({ subject: s, chapter: null }) },
            h("div", { class: "row", style: "justify-content:space-between" },
              h("span", { class: "eyebrow" }, s.code || "Subject"),
              h("span", { class: "pill" }, `${total} chapter${total === 1 ? "" : "s"}`)),
            h("h2", {}, s.title),
            s.description ? h("p", { class: "meta" }, s.description) : null,
            h("div", { class: "progress", title: `${pct}% studied` }, h("span", { style: `width:${pct}%` })));
        }),
        h("div", { class: "card add" },
          h("h3", {}, "Add another subject"),
          h("p", { class: "meta", html: "Drop a new file in <code>subjects/</code> and list it in <code>index.html</code>. The README shows the format." }))));
    return frag;
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

  function subjectView(s) {
    const totalQ = s.chapters.reduce((n, c) => n + (c.quiz || []).length, 0);
    return h("div", { class: "stack", style: "gap:24px" },
      h("div", { class: "stack" },
        h("div", { class: "eyebrow" }, s.code || "Subject"),
        h("h1", {}, s.title),
        s.description ? h("p", { class: "lede" }, s.description) : null),
      s.studyPlan ? h("div", { class: "section" },
        h("h3", {}, "Suggested plan for tonight"),
        h("ul", { class: "points" }, s.studyPlan.map((p) => R("li", p)))) : null,
      h("div", { class: "grid" },
        s.chapters.map((ch, i) => {
          const st = chState(s.id, ch.id);
          const pct = ch.sections.length ? Math.round((st.read.length / ch.sections.length) * 100) : 0;
          return h("button", { class: "card", onclick: () => go({ chapter: ch, tab: "learn" }) },
            h("div", { class: "row", style: "justify-content:space-between" },
              h("span", { class: "eyebrow" }, `Chapter ${ch.number ?? i + 1}`),
              st.best != null ? h("span", { class: "pill " + (st.best >= 70 ? "good" : "bad") }, `Best quiz ${st.best}%`) : h("span", { class: "pill" }, "Not quizzed")),
            h("h2", {}, ch.title),
            ch.overview ? R("p", ch.overview, "meta") : null,
            h("div", { class: "meta" }, `${ch.sections.length} lessons · ${(ch.flashcards || []).length} flashcards · ${(ch.quiz || []).length} questions`),
            h("div", { class: "progress" }, h("span", { style: `width:${pct}%` })));
        })),
      totalQ ? h("div", { class: "section" },
        h("h3", {}, "Final exam simulation"),
        h("p", { class: "meta" }, `A mixed quiz drawn from every chapter (${totalQ} questions in the bank), plus written exam-style questions with model answers.`),
        h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => go({ chapter: "exam" }) }, "Start the final exam"))) : null);
  }

  const TABS = [
    ["learn", "Learn"], ["cheat", "Cheat sheet"], ["cards", "Flashcards"], ["quiz", "Quiz"], ["written", "Exam questions"],
  ];
  function chapterView(s, ch) {
    const tabs = h("div", { class: "tabs", role: "tablist" },
      TABS.filter(([k]) => k !== "written" || (ch.written || []).length).map(([k, label]) =>
        h("button", { class: "tab", role: "tab", "aria-selected": String(state.tab === k), onclick: () => go({ tab: k }) }, label)));
    const body = { learn: learnTab, cheat: cheatTab, cards: cardsTab, quiz: quizTab, written: writtenTab }[state.tab](s, ch);
    return h("div", { class: "stack", style: "gap:20px" },
      h("div", { class: "stack" },
        h("div", { class: "eyebrow" }, `Chapter ${ch.number ?? ""}`),
        h("h1", {}, ch.title),
        ch.overview ? R("p", ch.overview, "lede") : null),
      tabs, body);
  }

  function learnTab(s, ch) {
    const st = chState(s.id, ch.id);
    return h("div", { class: "stack", style: "gap:16px" },
      ch.bigPicture ? h("div", { class: "section" },
        h("div", { class: "block-label" }, "The big picture"),
        R("p", ch.bigPicture),
        diagramEl(ch.bigPictureDiagram)) : null,
      ch.sections.map((sec, i) => {
        const done = st.read.includes(i);
        const btn = h("button", { class: "btn " + (done ? "ghost" : "") }, done ? "✓ Understood" : "Mark as understood");
        btn.addEventListener("click", () => {
          const at = st.read.indexOf(i);
          if (at >= 0) st.read.splice(at, 1); else st.read.push(i);
          save(); btn.textContent = st.read.includes(i) ? "✓ Understood" : "Mark as understood";
          btn.classList.toggle("ghost", st.read.includes(i));
        });
        return h("article", { class: "section" },
          h("div", { class: "section-num" }, `${ch.number ?? ""}.${i + 1}`),
          h("h2", {}, sec.title),
          sec.simple ? h("div", { class: "block" }, h("div", { class: "block-label" }, "In plain words"), R("p", sec.simple)) : null,
          sec.analogy ? h("div", { class: "block analogy" }, h("div", { class: "block-label" }, "Think of it like"), R("p", sec.analogy)) : null,
          sec.points && sec.points.length ? h("div", { class: "block" }, h("div", { class: "block-label" }, "Key points"), h("ul", { class: "points" }, sec.points.map((p) => R("li", p)))) : null,
          (sec.diagrams || (sec.diagram ? [sec.diagram] : [])).map(diagramEl),
          sec.table ? h("div", { class: "table-wrap" }, tableEl(sec.table)) : null,
          sec.examTip ? h("div", { class: "block tip" }, h("div", { class: "block-label" }, "Exam tip"), R("p", sec.examTip)) : null,
          h("div", { class: "row" }, btn));
      }),
      h("div", { class: "row" },
        h("button", { class: "btn primary", onclick: () => go({ tab: "cards" }) }, "Next: flashcards"),
        h("button", { class: "btn", onclick: () => go({ tab: "quiz" }) }, "Skip to the quiz")));
  }

  function cheatTab(s, ch) {
    const items = ch.cheatsheet || [];
    const list = h("div", { class: "cheat" });
    const draw = (q) => {
      list.innerHTML = "";
      const f = q.trim().toLowerCase();
      const shown = items.filter((x) => !f || (x.term + " " + x.def).toLowerCase().includes(f));
      if (!shown.length) list.append(h("div", { class: "empty" }, "No term matches that search."));
      shown.forEach((x) => list.append(h("div", { class: "cheat-item" }, R("div", x.term, "term"), R("div", x.def))));
    };
    draw("");
    return h("div", { class: "stack" },
      h("input", { id: "cheat-search", class: "search", type: "search", placeholder: "Filter terms (e.g. MQTT, QoS, range)", oninput: (e) => draw(e.target.value) }),
      list,
      ch.compare ? ch.compare.map((t) => h("div", { class: "section" }, h("h3", {}, t.title), h("div", { class: "table-wrap" }, tableEl(t)))) : null,
      ch.mnemonics && ch.mnemonics.length ? h("div", { class: "section" }, h("h3", {}, "Memory hooks"), h("ul", { class: "points" }, ch.mnemonics.map((m) => R("li", m)))) : null);
  }

  function cardsTab(s, ch) {
    const st = chState(s.id, ch.id);
    const all = (ch.flashcards || []).map((c, i) => ({ ...c, i }));
    if (!all.length) return h("div", { class: "empty" }, "No flashcards in this chapter yet.");
    let mode = "all";
    let deck = [], pos = 0;
    const root = h("div", { class: "stack" });
    function build() {
      deck = mode === "weak" ? all.filter((c) => st.again.includes(c.i)) : shuffle(all);
      pos = 0; draw();
    }
    function mark(i, known) {
      const rm = (arr) => { const k = arr.indexOf(i); if (k >= 0) arr.splice(k, 1); };
      rm(st.known); rm(st.again);
      (known ? st.known : st.again).push(i);
      save(); pos++; draw();
    }
    function draw() {
      root.innerHTML = "";
      const controls = h("div", { class: "row", style: "justify-content:space-between" },
        h("div", { class: "row" },
          h("button", { class: "btn" + (mode === "all" ? " primary" : ""), onclick: () => { mode = "all"; build(); } }, "All cards"),
          h("button", { class: "btn" + (mode === "weak" ? " primary" : ""), onclick: () => { mode = "weak"; build(); } }, `Review mistakes (${st.again.length})`)),
        h("span", { class: "pill" }, `${st.known.length}/${all.length} known`));
      root.append(controls);
      if (!deck.length) return root.append(h("div", { class: "empty" }, "No cards to review here. Mark cards as “Again” to collect them."));
      if (pos >= deck.length) {
        return root.append(h("div", { class: "section" },
          h("h2", {}, "Deck finished"),
          h("p", {}, `You know ${st.known.length} of ${all.length} cards. ${st.again.length} need another pass.`),
          h("div", { class: "row" },
            h("button", { class: "btn primary", onclick: build }, "Go again"),
            st.again.length ? h("button", { class: "btn", onclick: () => { mode = "weak"; build(); } }, "Review mistakes only") : null,
            h("button", { class: "btn", onclick: () => go({ tab: "quiz" }) }, "Take the quiz"))));
      }
      const c = deck[pos];
      const card = h("div", { class: "flash", tabindex: "0", role: "button", "aria-label": "Flip card" },
        h("div", { class: "flash-face" }, R("div", c.q, "flash-q"), h("div", { class: "flash-hint" }, "Tap or press Space to reveal")),
        h("div", { class: "flash-face back" }, R("div", c.a)));
      const flip = () => card.classList.toggle("flipped");
      card.addEventListener("click", flip);
      card.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
      root.append(
        h("div", { class: "bar-meta" }, h("span", {}, `Card ${pos + 1} of ${deck.length}`), h("span", {}, mode === "weak" ? "Mistakes deck" : "Shuffled")),
        h("div", { class: "progress" }, h("span", { style: `width:${(pos / deck.length) * 100}%` })),
        h("div", { class: "flash-stage" }, card),
        h("div", { class: "row", style: "justify-content:center" },
          h("button", { class: "btn", onclick: () => mark(c.i, false) }, "Again"),
          h("button", { class: "btn primary", onclick: () => mark(c.i, true) }, "I knew it")));
    }
    build();
    return root;
  }

  // ---------- quiz engine ----------
  function quizRunner(questions, { onFinish, title }) {
    const root = h("div", { class: "stack" });
    let qs, pos, score, wrong;
    function start(list) {
      qs = shuffle(list).map((q) => q.type === "tf" ? q : { ...q, _order: shuffle(q.options.map((_, i) => i)) });
      pos = 0; score = 0; wrong = []; draw();
    }
    function draw() {
      root.innerHTML = "";
      if (pos >= qs.length) return finish();
      const q = qs[pos];
      const fb = h("div");
      const next = h("button", { class: "btn primary", hidden: true, onclick: () => { pos++; draw(); } }, pos + 1 < qs.length ? "Next question" : "See my score");
      let opts;
      const answer = (picked, btns, correctIdx) => {
        const ok = picked === correctIdx;
        if (ok) score++; else wrong.push({ q, picked });
        btns.forEach((b, k) => { b.disabled = true; if (k === correctIdx) b.classList.add("correct"); else if (k === picked) b.classList.add("wrong"); });
        fb.className = "feedback " + (ok ? "good" : "bad");
        fb.innerHTML = `<strong>${ok ? "Correct." : "Not quite."}</strong> ` + rich(q.explain || "");
        next.hidden = false; next.focus();
      };
      if (q.type === "tf") {
        const labels = ["True", "False"];
        const correctIdx = q.answer ? 0 : 1;
        const btns = labels.map((l, k) => h("button", { class: "opt", onclick: () => answer(k, btns, correctIdx) }, h("span", { class: "key" }, l[0]), h("span", {}, l)));
        opts = h("div", { class: "opts" }, btns);
      } else {
        const correctIdx = q._order.indexOf(q.answer);
        const btns = q._order.map((oi, k) => h("button", { class: "opt", onclick: () => answer(k, btns, correctIdx) }, h("span", { class: "key" }, "ABCDEFG"[k]), R("span", q.options[oi])));
        opts = h("div", { class: "opts" }, btns);
      }
      root.append(
        h("div", { class: "bar-meta" }, h("span", {}, `${title || "Quiz"} · Question ${pos + 1} of ${qs.length}`), h("span", {}, `Score ${score}`)),
        h("div", { class: "progress" }, h("span", { style: `width:${(pos / qs.length) * 100}%` })),
        h("div", { class: "q-card" },
          q.topic ? h("div", { class: "eyebrow" }, q.topic) : null,
          R("div", q.type === "tf" ? "True or false: " + q.q : q.q, "q-text"), opts, fb, h("div", { class: "row" }, next)));
    }
    function finish() {
      const pct = Math.round((score / qs.length) * 100);
      onFinish && onFinish(pct);
      const verdict = pct >= 85 ? "Exam ready on this material." : pct >= 70 ? "Solid. Review the misses below once more." : pct >= 50 ? "Getting there. Re-read the lessons for the topics you missed." : "Go back to the lessons and flashcards, then retry.";
      root.append(h("div", { class: "section" },
        h("div", { class: "eyebrow" }, "Result"),
        h("div", { class: "row", style: "gap:18px" }, h("div", { class: "score-big" }, `${pct}%`), h("div", {}, h("div", {}, `${score} of ${qs.length} correct`), h("div", { class: "meta" }, verdict))),
        h("div", { class: "row" },
          h("button", { class: "btn primary", onclick: () => start(questions) }, "Retake"),
          wrong.length ? h("button", { class: "btn", onclick: () => start(wrong.map((w) => stripOrder(w.q))) }, `Retry my ${wrong.length} mistakes`) : null)));
      if (wrong.length) {
        root.append(h("h3", {}, "Review your mistakes"));
        wrong.forEach(({ q }) => {
          const right = q.type === "tf" ? (q.answer ? "True" : "False") : q.options[q.answer];
          root.append(h("div", { class: "q-card" }, R("div", q.q, "q-text"),
            h("div", { class: "feedback good", html: "<strong>Answer:</strong> " + rich(right) }),
            q.explain ? R("p", q.explain) : null));
        });
      }
    }
    const stripOrder = (q) => { const { _order, ...rest } = q; return rest; };
    start(questions);
    return root;
  }

  function quizTab(s, ch) {
    const qs = ch.quiz || [];
    if (!qs.length) return h("div", { class: "empty" }, "No quiz questions in this chapter yet.");
    const st = chState(s.id, ch.id);
    return quizRunner(qs, { title: "Chapter quiz", onFinish: (pct) => { st.best = Math.max(st.best ?? 0, pct); save(); } });
  }

  function writtenList(items) {
    return h("div", { class: "stack" },
      h("p", { class: "lede" }, "Answer in your own words first, then reveal the model answer and grade yourself honestly."),
      items.map((w, i) => {
        const model = h("div", { class: "feedback good", hidden: true }, h("div", { class: "block-label" }, "Model answer"), R("div", w.answer));
        const ta = h("textarea", { class: "answer", id: "written-" + i, placeholder: "Write your answer here…" });
        return h("div", { class: "q-card" },
          w.topic ? h("div", { class: "eyebrow" }, w.topic) : null,
          R("div", w.q, "q-text"), ta,
          h("div", { class: "row" }, h("button", { class: "btn", onclick: (e) => { model.hidden = !model.hidden; e.target.textContent = model.hidden ? "Show model answer" : "Hide model answer"; } }, "Show model answer")),
          model);
      }));
  }
  function writtenTab(s, ch) { return writtenList(ch.written || []); }

  function examView(s) {
    const bank = s.chapters.flatMap((c) => (c.quiz || []).map((q) => ({ ...q, topic: q.topic || `Ch. ${c.number ?? ""} ${c.short || c.title}` })));
    const written = s.chapters.flatMap((c) => (c.written || []).map((w) => ({ ...w, topic: w.topic || `Ch. ${c.number ?? ""} ${c.short || c.title}` })));
    let tab = "mcq";
    const body = h("div");
    const tabs = h("div", { class: "tabs" });
    const draw = () => {
      tabs.innerHTML = "";
      [["mcq", "Mixed quiz (20)"], ["full", "Full bank (" + bank.length + ")"], ["written", "Written questions"]].forEach(([k, l]) =>
        tabs.append(h("button", { class: "tab", "aria-selected": String(tab === k), onclick: () => { tab = k; draw(); } }, l)));
      body.innerHTML = "";
      if (tab === "written") body.append(written.length ? writtenList(written) : h("div", { class: "empty" }, "No written questions yet."));
      else body.append(quizRunner(tab === "mcq" ? shuffle(bank).slice(0, 20) : bank, { title: "Final exam" }));
    };
    draw();
    return h("div", { class: "stack", style: "gap:20px" },
      h("div", { class: "stack" }, h("div", { class: "eyebrow" }, s.title), h("h1", {}, "Final exam simulation"),
        h("p", { class: "lede" }, "Questions are drawn from every chapter and shuffled. Each answer is explained right away.")),
      tabs, body);
  }

  // ---------- boot ----------
  function boot() {
    $("#home").addEventListener("click", () => go({ subject: null, chapter: null }));
    const tbtn = $("#theme");
    const setTheme = (t) => { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); try { localStorage.setItem("studyhub:theme", t || ""); } catch (e) {} };
    try { const t = localStorage.getItem("studyhub:theme"); if (t) setTheme(t); } catch (e) {}
    tbtn.addEventListener("click", () => { setTheme(isDark() ? "light" : "dark"); mermaidReady = null; render(); });
    if (SUBJECTS.length === 1) state.subject = null; // still show the picker so more subjects fit in later
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
