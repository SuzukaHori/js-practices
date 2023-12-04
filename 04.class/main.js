#!/usr/bin/env node

import minimist from "minimist";
import readline from "readline";
import { MemosController } from "./memos-controller.js";

async function main() {
  const option = minimist(process.argv.slice(2));
  const memosController = new MemosController();

  if (option.l) {
    memosController.index();
  } else if (option.r) {
    memosController.read();
  } else if (option.d) {
    memosController.destroy();
  } else if (option.e) {
    const editor = process.env.EDITOR || "vi";
    memosController.edit(editor);
  } else {
    const lines = await readLinesFromInput();
    const title = lines[0];
    const content = lines.slice(1).join("\n");
    memosController.create(title, content);
  }
}

async function readLinesFromInput() {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  const reader = readline.createInterface({
    input: process.stdin,
  });
  const lines = await new Promise((resolve) => {
    const lines = [];
    reader.on("line", (line) => {
      lines.push(line);
      resolve(lines);
    });
  });
  reader.close();
  return lines;
}

main();
