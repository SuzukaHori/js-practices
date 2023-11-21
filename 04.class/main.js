import minimist from "minimist";
import { MemosController } from "./MemosController.js";
import readline from "readline";

async function main() {
  const option = minimist(process.argv.slice(2));
  const memosController = new MemosController();

  await memosController.build();

  if (option.l) {
    memosController.index();
  } else if (option.r) {
    memosController.show();
  } else if (option.d) {
    memosController.destroy();
  } else {
    const obj = await inputTitleAndContent();
    memosController.create(obj.title, obj.content);
  }
}

async function inputTitleAndContent() {
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
  const title = lines[0];
  const content = lines.slice(1).join("\n");
  return { title: title, content: content };
}

main();
