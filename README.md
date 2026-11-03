# Study Hub

A static study platform: pick a subject, then learn each chapter through plain-language
lessons, analogies, diagrams, a cheat sheet and flashcards, and check yourself with scored
quizzes (with explanations), written exam questions and a final exam simulation.

No build step and no backend. Progress (lessons understood, best quiz scores, flashcards you
missed) is stored in your browser.

## Run locally

Open `index.html` in a browser, or serve the folder: `npx serve .`

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repository.
3. Framework preset: **Other**. Leave the build command empty and the output directory as the root.
4. Deploy. Every push to `main` redeploys.

Or from a terminal: `npm i -g vercel && vercel --prod` inside this folder.

## Add a subject

1. Create `subjects/<id>/subject.js`:
   ```js
   StudyHub.registerSubject({ id: "networks", code: "NET", title: "Computer Networks",
     hue: 20, emoji: "🌐",   // hue (0–360) sets the subject's colour theme; emoji shows on its card
     description: "…", studyPlan: ["…"], chapters: [] });
   ```
2. Add one file per chapter with `StudyHub.addChapter("<id>", { … })` (format below).
3. List the files in `index.html` after `app.js`, subject file first.

## Chapter format

```js
StudyHub.addChapter("iot", {
  id: "ch1", number: 1, title: "…", short: "…", overview: "…",
  bigPicture: "…", bigPictureDiagram: { type: "mermaid", caption: "…", content: "flowchart LR …" },
  sections: [{
    title: "…",
    simple: "Plain-language explanation. Supports **bold**, `code`, and line breaks.",
    analogy: "Everyday comparison",
    points: ["key point", "…"],
    diagram: { type: "mermaid" | "svg" | "ascii", content: "…", caption: "…" }, // or diagrams: [...]
    table: { headers: [...], rows: [[...]] },
    code: [{ file: "deploy.yaml", lang: "yaml", caption: "…", content: "…" }], // highlighted listing (java, yaml, hcl, bash…)
    examTip: "What examiners like to ask",
  }],
  cheatsheet: [{ term: "…", def: "…" }],
  compare: [{ title: "A vs B", headers: [...], rows: [[...]] }],
  mnemonics: ["…"],
  flashcards: [{ q: "…", a: "…" }],
  quiz: [
    { q: "…", options: ["…", "…", "…", "…"], answer: 0, explain: "…" },  // multiple choice
    { type: "tf", q: "…", answer: true, explain: "…" },                 // true / false
  ],
  written: [{ q: "…", answer: "model answer" }],
});
```

## Single-file version

`node scripts/bundle.mjs` writes `dist/study-hub.html` with everything inlined.

## Animated explainers

Lessons can carry step-by-step animated scenes (boxes, arrows and moving messages with a caption per step).
Put them in `subjects/<id>/scenes.js`, loaded after the chapter files, and attach them by section title:

```js
StudyHub.addScenes("iot", "ch1", {
  "MQTT: publish / subscribe through a broker": {
    title: "publish, subscribe, broker", w: 620, h: 300,
    nodes: [{ id: "p", x: 95, y: 80, icon: "🌡️", label: "Sensor" }, { id: "b", x: 310, y: 150, label: "Broker", kind: "accent" }],
    edges: [{ from: "p", to: "b", label: "home/temp" }],
    steps: [{ say: "The sensor **publishes**…", send: [{ from: "p", to: "b", label: "22°C" }], ok: ["b"], note: { b: "got it" } }],
  },
});
```

Step keys: `say`, `send` (moving messages: `from`, `to`, `label`, `tone`: good / bad / alt, `delay`, `dur`), `hl`, `ok`, `fail`, `clear`, `dim`, `note`, `cut`.
Nodes and edges accept `at` / `until` to appear or disappear at a given step. Mermaid diagrams animate automatically.

## Everyday examples

`StudyHub.addExamples("arch", "dp", { "Section title": "text" })` adds a "concrete example" box to a lesson
(label in French when the subject has `lang: "fr"`). Optional: `scrollScenes: true` on a subject makes its
scenes advance with page scrolling instead of the play button.

## Complete code listings

Full, runnable programs live in `subjects/<id>/java/*.java`. Each file starts with
`// @section <chapterId> | <section title>`. Run `node scripts/build-java.mjs <id>` (needs a JDK):
it runs every program and writes `subjects/<id>/code.js` with the source and its real console output.
These listings replace the short code excerpts of that section.
