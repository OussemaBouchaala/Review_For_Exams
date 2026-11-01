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
