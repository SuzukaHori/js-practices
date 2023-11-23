import Enquirer from "enquirer";
import { DbManager } from "./DbManager.js";

export class MemosController {
  constructor() {}

  async build() {
    this.dbManager = new DbManager();
    await this.dbManager.createTable();
    this.memos = await this.dbManager.getAll();
  }

  async index() {
    this.#exitIfNoMemoExists();
    for (const memo of this.memos) {
      console.log(memo.title);
    }
  }

  async read() {
    const selectedMemo = await this.#select();
    console.log(selectedMemo.fullText());
  }

  async create(title, content) {
    try {
      await this.dbManager.insert(title, content);
    } catch (error) {
      if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
        console.error("Error: The first line of a memo must be unique");
      } else {
        throw error;
      }
    }
  }

  async destroy() {
    const selectedMemo = await this.#select();
    const result = await this.dbManager.delete(selectedMemo);
    console.log(result);
  }

  async #select() {
    const titleList = this.memos.map((memo) => memo.title);
    this.#exitIfNoMemoExists();
    const question = {
      name: "title",
      type: "select",
      message: "Choose a note you want to see:",
      choices: titleList,
    };
    const answer = await Enquirer.prompt(question);
    const selectedMemo = this.#findByTitle(answer.title);
    return selectedMemo;
  }

  #findByTitle(title) {
    const found = this.memos.find((memo) => {
      return memo.title === title;
    });
    return found;
  }

  #exitIfNoMemoExists() {
    if (this.memos.length === 0) {
      console.log("メモはありません");
      process.exit();
    }
  }
}
