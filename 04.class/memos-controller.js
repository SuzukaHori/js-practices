import Enquirer from "enquirer";
import { Memo } from "./memo.js";
import { spawn } from "node:child_process";
import fs from "fs";

export class MemosController {
  async index() {
    await this.#setMemos();
    if (this.memos.length === 0) {
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
      const memo = new Memo(title, content);
      insertedMemo = await memo.save();
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
    if (this.memos.length === 0) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#select("see");
    console.log(selectedMemo.fullText());
  }

  async destroy() {
    await this.#setMemos();
    if (this.memos.length === 0) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#select("destroy");
    let destroyedMemo;
    try {
      destroyedMemo = await selectedMemo.destroy();
    } catch (error) {
      console.error("Failed to delete memo.");
      throw error;
    }
    console.log(`Memo "${destroyedMemo.title}" destroyed.`);
  }

  async edit(editor, tempFilePath) {
    await this.#setMemos();
    if (this.memos.length === 0) {
      console.log("Memo does not exist.");
      return;
    }
    const oldMemo = await this.#select("edit");
    try {
      fs.writeFileSync(tempFilePath, oldMemo.fullText());
      console.log("エディタで編集し、保存して閉じください");
      await this.openEditor(editor, tempFilePath);
      const newData = await this.readEditedFile(tempFilePath);
      const newMemo = await oldMemo.update(newData.title, newData.content);
      console.log(`Memo "${newMemo.title}" updated.`);
    } catch (error) {
      console.error("Failed to update memo.");
      throw error;
    }
  }

  async readEditedFile(tempFilePath) {
    const dataByLine = fs.readFileSync(tempFilePath, "utf-8").split("\n");
    const title = dataByLine[0];
    const content = dataByLine.slice(1).join("\n");
    return { title: title, content: content };
  }

  async openEditor(editor, tempFilePath) {
    let option;
    if (editor !== "vi") {
      option = "--wait";
    }

    return new Promise((resolve) => {
      const child = spawn(editor, [tempFilePath, option], {
        stdio: "inherit",
      });
      child.on("exit", (code) => {
        resolve(code);
      });
    });
  }

  async #setMemos() {
    try {
      this.memos = await Memo.findAll();
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
    return Memo.findByTitle(answer.title);
  }
}
