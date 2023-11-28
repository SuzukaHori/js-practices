import Enquirer from "enquirer";
import { exec } from "node:child_process";
import fs from "fs";

export class MemosController {
  constructor(dbManager) {
    this.dbManager = dbManager;
    this.tempFilePath = "./temp.txt";
  }

  async index() {
    await this.#setMemos();
    if (this.#memosEmpty()) {
      console.log("Memo does not exist.");
      return;
    }
    for (const memo of this.memos) {
      console.log(memo.title);
    }
  }

  async create(title, content) {
    let insertedMemo;
    try {
      insertedMemo = await this.dbManager.insert(title, content);
    } catch (error) {
      if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
        console.error("The first line of a memo must be unique.");
      } else {
        throw error;
      }
    }
    console.log(`Memo "${insertedMemo.title}" inserted.`);
  }

  async read() {
    await this.#setMemos();
    if (this.#memosEmpty()) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#select("see");
    console.log(selectedMemo.fullText());
  }

  async destroy() {
    await this.#setMemos();
    if (this.#memosEmpty()) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#select("destroy");
    let destroyedMemo;
    try {
      destroyedMemo = await this.dbManager.delete(selectedMemo);
    } catch (error) {
      console.error("Failed to delete memo.");
      throw error;
    }
    console.log(`Memo "${destroyedMemo.title}" destroyed.`);
  }

  async edit() {
    await this.#setMemos();
    if (this.#memosEmpty()) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#select("update");
    try {
      const editedData = await this.#editMemoInEditor(selectedMemo);
      const updatedMemo = await this.dbManager.update(
        selectedMemo.id,
        editedData.title,
        editedData.content
      );
      console.log(`Memo "${updatedMemo.title}" updated.`);
    } catch (error) {
      console.error("Failed to update memo.");
      throw error;
    }
  }

  async #setMemos() {
    try {
      this.memos = await this.dbManager.getAll();
    } catch (error) {
      console.error("Failed to get memos.");
      throw error;
    }
  }

  async #select(action) {
    const question = {
      name: "title",
      type: "select",
      message: `Choose a note you want to ${action}:`,
      choices: this.memos.map((memo) => memo.title),
    };
    const answer = await Enquirer.prompt(question);
    return this.memos.find((memo) => memo.title === answer.title);
  }

  #memosEmpty() {
    return this.memos.length === 0;
  }

  async #editMemoInEditor(selectedMemo) {
    fs.writeFileSync(this.tempFilePath, selectedMemo.fullText());
    await this.#openEditor();
    const dataByLine = fs.readFileSync(this.tempFilePath, "utf-8").split("\n");
    const title = dataByLine[0];
    const content = dataByLine.slice(1).join("\n");
    return { title: title, content: content };
  }

  async #openEditor() {
    const editor = process.env.EDITOR || "vi";
    let command;
    if (editor === "vi") {
      command = `vi ${this.tempFilePath}`; // !!!!ここでvimが立ち上がらない!!!!
    } else {
      command = `${editor} ${this.tempFilePath} --wait`;
    }
    await this.#execCommand(command);
  }

  #execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        }
        resolve(stdout);
      });
    });
  }
}
