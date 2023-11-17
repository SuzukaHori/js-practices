import readline from "readline";

export class InputReader {
  constructor() {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    this.reader = readline.createInterface({
      input: process.stdin,
    });
  }

  async receiveTitleAndContent() {
    const inputByLines = await this.#acceptInputByLine();
    const title = inputByLines[0];
    const content = inputByLines.slice(1).join("\n");
    return { title: title, content: content };
  }

  #acceptInputByLine() {
    return new Promise((resolve) => {
      const lines = [];
      this.reader.on("line", (line) => {
        lines.push(line);
        resolve(lines);
        this.reader.close();
      });
    });
  }
}
