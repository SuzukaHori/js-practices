import Enquirer from "enquirer";
import { Memo } from "./memo.js";
import { spawn } from "node:child_process";
import fs from "fs";
import tmp from "tmp";

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
    const selectedMemo = await this.#selectMemo("see");
    console.log(selectedMemo.fullText());
  }

  async destroy() {
    await this.#setMemos();
    if (this.memos.length === 0) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#selectMemo("destroy");
    let destroyedMemo;
    try {
      destroyedMemo = await selectedMemo.destroy();
    } catch (error) {
      console.error("Failed to delete memo.");
      throw error;
    }
    console.log(`Memo "${destroyedMemo.title}" destroyed.`);
  }

  async edit(editor) {
    await this.#setMemos();
    if (this.memos.length === 0) {
      console.log("Memo does not exist.");
      return;
    }
    const oldMemo = await this.#selectMemo("edit");
    try {
      const tempFile = tmp.fileSync();
      fs.writeFileSync(tempFile.name, oldMemo.fullText());
      console.log("Edit in the editor, save and close.");
      await this.#launchEditor(editor, tempFile.name);
      const newData = await this.#readEditedFile(tempFile.name);
      const newMemo = await oldMemo.update(newData.title, newData.content);
      console.log(`Memo "${newMemo.title}" updated.`);
    } catch (error) {
      console.error("Failed to update memo.");
      throw error;
    }
  }

  async #setMemos() {
    try {
      this.memos = await Memo.findAll();
    } catch (error) {
      console.error("Failed to get memos.");
      throw error;
    }
  }

  async #selectMemo(action) {
    const question = {
      name: "title",
      type: "select",
      message: `Choose a note you want to ${action}:`,
      choices: this.memos.map((memo) => memo.title),
    };
    const answer = await Enquirer.prompt(question);
    return Memo.findByTitle(answer.title);
  }

  async #readEditedFile(tempFilePath) {
    const dataByLine = fs.readFileSync(tempFilePath, "utf-8").split("\n");
    const title = dataByLine[0];
    const content = dataByLine.slice(1).join("\n");
    return { title: title, content: content };
  }

  async #launchEditor(editor, tempFilePath) {
    const args = editor === "code" ? [tempFilePath, "--wait"] : [tempFilePath];
    return new Promise((resolve) => {
      const child = spawn(editor, args, {
        stdio: "inherit",
      });
      child.on("exit", () => {
        resolve();
      });
    });
  }
}
