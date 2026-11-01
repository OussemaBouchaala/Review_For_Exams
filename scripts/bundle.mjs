// Builds dist/study-hub.html: one self-contained page (CSS + engine + subject data inlined).
// Usage: node scripts/bundle.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/, "").replace(/<meta name="viewport"[^>]*>\s*/, "")
  .replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]
  .replace(/<script src="(?!https?:)([^"]+)"><\/script>/g, (_, src) => `<script>\n${readFileSync(src, "utf8")}\n</script>`);
mkdirSync("dist", { recursive: true });
const out = head.replace("<title>", '<meta name="claude:viewport-fit-sides" content="cover">\n<title>') + body;
writeFileSync("dist/study-hub.html", out.trim() + "\n");
console.log("dist/study-hub.html", out.length, "bytes");
