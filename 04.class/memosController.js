import Enquirer from "enquirer";
import { dbManager } from "./dbManager.js";

export class memosController {
  constructor() {}

  async build() {
    this.dbManager = new dbManager();
    await this.dbManager.createTable();
    this.memos = await this.dbManager.getAll();
  }

  async index() {
    this.memos = await this.dbManager.getAll();
    if (this.memos.length === 0) {
      console.log("メモはありません");
    } else {
      for (const memo of this.memos) {
        console.log(memo.title);
      }
    }
  }

  async show() {
    const selectedMemo = await this.#select();
    console.log(selectedMemo.full());
  }

  async create(memo) {
    try {
      await this.dbManager.insert(memo);
    } catch (Error) {
      console.log(Error);
    }
  }

  async destroy() {
    const selectedMemo = await this.select();
    const result = await this.dbManager.delete(selectedMemo);
    console.log(result);
  }
  
  async #select() {
    const titleList = this.memos.map((memo) => memo.title);
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
    const result = this.memos.find((memo) => {
      return memo.title === title;
    });
    return result;
  }
}
