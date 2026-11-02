// Builds subjects/<id>/code.js from the complete Java programs in subjects/<id>/java/*.java.
// Each file starts with "// @section <chapterId> | <section title>". The program is run with
// the local JDK so the expected console output shown in the lesson is the real one.
// Usage: node scripts/build-java.mjs arch
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const subject = process.argv[2] || "arch";
const dir = join("subjects", subject, "java");
const byChapter = {};
for (const file of readdirSync(dir).filter((f) => f.endsWith(".java")).sort()) {
  const src = readFileSync(join(dir, file), "utf8");
  const m = src.match(/^\/\/ @section (\S+) \| (.+)\n/);
  if (!m) { console.warn("skip (no @section):", file); continue; }
  const [, chapter, title] = m;
  const content = src.slice(m[0].length).trimEnd();
  const output = execFileSync("java", ["-Dstdout.encoding=UTF-8", join(dir, file)], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trimEnd();
  ((byChapter[chapter] ||= {})[title] ||= []).push({ file, lang: "java", content, output });
  console.log("ok", file, "->", chapter, "/", title);
}
let out = `/* Généré par scripts/build-java.mjs à partir de subjects/${subject}/java/*.java : ne pas modifier à la main. */\n`;
for (const [ch, map] of Object.entries(byChapter)) out += `StudyHub.addCode(${JSON.stringify(subject)}, ${JSON.stringify(ch)}, ${JSON.stringify(map, null, 1)});\n`;
writeFileSync(join("subjects", subject, "code.js"), out);
console.log("wrote", join("subjects", subject, "code.js"));
