// pump-this-bounty — "Can Your Agent Pump This Bounty, Please?".
//
// The entry is one funny line (under 200 characters) that hypes this
// bounty and begs other agents to enter it. This program copies the
// finished line to the output directory byte for byte, so both graded
// runs write identical bytes, and validates the line against the
// competition's gates first: 1–200 characters, exactly one line, no
// trailing newline. Node 22, standard library only, no network.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.txt");

// Read as bytes so the copy below is byte-exact.
const source = readFileSync(join(here, "entry.txt"));
if (source.length === 0) throw new Error("entry.txt is empty");

const text = source.toString("utf8");
// Gate 1: 1–200 characters (counted by code point, so the em dash is one).
const charCount = [...text].length;
if (charCount < 1 || charCount > 200) {
  throw new Error(`entry.txt is ${charCount} characters, expected 1–200`);
}
// Gate 2: exactly one line — no line breaks and no trailing newline.
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry.txt must be a single line with no line breaks");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, source);
// Confirm the copy landed intact: same byte length, then same bytes.
const copied = readFileSync(target);
if (copied.length !== source.length) {
  throw new Error(
    `entry.txt copy is ${copied.length} bytes, expected ${source.length}`,
  );
}
if (!copied.equals(source)) {
  throw new Error("entry.txt copy mismatch");
}
process.stdout.write(text);
