#!/usr/bin/env node
/**
 * Mermaid diagram validator for markdown files.
 * Zero-dependency. Enforces the syntax rules from the mermaid-validator skill.
 *
 * Usage:
 *   node scripts/validate-mermaid.mjs                 # scan .agents/, docs/, or cwd
 *   node scripts/validate-mermaid.mjs path/to/file.md
 *   node scripts/validate-mermaid.mjs path/to/dir/
 */
import fs from "node:fs";
import path from "node:path";

const RULES = [
  {
    id: "no-literal-newline",
    test: (line) => /\\n/.test(line),
    message:
      "Literal \\n inside node/edge label — use <br/> or rewrite as plain text",
  },
  {
    id: "html-entity",
    test: (line) => /&#\d+;/.test(line) || /&amp;/.test(line),
    message: "HTML entity used — use plain characters or \"quoted\" labels",
  },
  {
    id: "unquoted-paren-label",
    test: (line) => {
      if (/"[^"]*"/.test(line)) return false;
      if (/\(\[[^\]]*\]\)/.test(line) || /\[\([^)]*\)\]/.test(line)) return false;
      return /[\[\]{].*\(/.test(line) || /--\s+[^[]*\(/.test(line);
    },
    message: "Label containing parentheses must be wrapped in \"double quotes\"",
  },
  {
    id: "reserved-node-id-end",
    test: (line) => /(^|\s)end\s*[\[({]/.test(line),
    message: "Node ID named `end` (lowercase) is reserved — use `End` instead",
  },
  {
    id: "hyphen-node-id",
    test: (line) => /(^|\s)[A-Za-z0-9_]+-[A-Za-z0-9_-]+\s*[\[({]/.test(line),
    message: "Node ID contains a hyphen — use alphanumeric + underscore only",
  },
];

function collectMdFiles(targets) {
  const files = [];
  for (const t of targets) {
    const abs = path.resolve(t);
    if (!fs.existsSync(abs)) {
      console.error(`Skipping (not found): ${t}`);
      continue;
    }
    const stat = fs.statSync(abs);
    if (stat.isFile()) {
      if (abs.endsWith(".md")) files.push(abs);
    } else {
      walk(abs, files);
    }
  }
  return files;
}

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
}

function extractMermaidBlocks(lines) {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^```\s*mermaid\s*$/.test(lines[i].trim())) {
      const start = i + 1;
      const block = [];
      let end = -1;
      for (let j = start; j < lines.length; j++) {
        if (/^```\s*$/.test(lines[j].trim())) {
          end = j;
          break;
        }
        block.push(lines[j]);
      }
      if (end !== -1) {
        blocks.push({ startLine: start + 1, lines: block });
        i = end;
      }
    }
  }
  return blocks;
}

function validateBlock(block) {
  const errors = [];
  block.lines.forEach((rawLine, idx) => {
    const lineNo = block.startLine + idx;
    const line = rawLine.trim();
    if (!line || line.startsWith("%%")) return;
    for (const rule of RULES) {
      if (rule.test(line)) {
        errors.push({ lineNo, rule, line: rawLine.trim() });
        break;
      }
    }
  });
  return errors;
}

function main() {
  const args = process.argv.slice(2);
  let targets = args;
  if (targets.length === 0) {
    targets = [".agents", "docs", "."].filter((p) => fs.existsSync(p));
  }

  const files = collectMdFiles(targets);
  let blockCount = 0;
  let failed = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);
    const blocks = extractMermaidBlocks(lines);
    blockCount += blocks.length;
    const fileErrors = [];
    for (const block of blocks) {
      fileErrors.push(...validateBlock(block));
    }
    if (fileErrors.length > 0) {
      failed++;
      console.error(`❌ ${file}`);
      for (const e of fileErrors) {
        console.error(`   Line ${e.lineNo} [${e.rule.id}]: ${e.rule.message}`);
        console.error(`   > ${e.line}`);
      }
      console.error("");
    }
  }

  console.log(`Scanned ${files.length} file(s), ${blockCount} mermaid block(s).`);
  if (failed === 0) {
    console.log("✅ All diagrams passed.");
    process.exit(0);
  } else {
    console.error(`❌ ${failed} file(s) failed validation.`);
    process.exit(1);
  }
}

main();
