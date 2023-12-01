import Enquirer from "enquirer";
import { Memo } from "./memo.js";

export class MemosController {
  async index() {
    await this.#setMemos();
    if (Memo.empty(this.memos)) {
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
    if (Memo.empty(this.memos)) {
      console.log("Memo does not exist.");
      return;
    }
    const selectedMemo = await this.#select("see");
    console.log(selectedMemo.fullText());
  }

  async destroy() {
    await this.#setMemos();
    if (Memo.empty(this.memos)) {
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
