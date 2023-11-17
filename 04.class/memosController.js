import Enquirer from "enquirer";
import { dataManager } from "./dataManager.js";
import { InputReader } from "./InputReader.js";

export class memosController {
  constructor() {}

  async build() {
    this.dataManager = new dataManager();
    await this.dataManager.createTable();
    this.memos = await this.dataManager.getAll();
  }

  async index() {
    this.memos = await this.dataManager.getAll();
    if (this.memos.length === 0) {
      console.log("メモはありません");
    } else {
      for (const memo of this.memos) {
        console.log(memo.title);
      }
    }
  }

  async show() {
    const selectedMemo = await this.select();
    console.log(selectedMemo.full());
  }

  async select() {
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

  async create() {
    const input = new InputReader();
    const memo = await input.receiveTitleAndContent();
    console.log(memo);
    try {
      await this.dataManager.insert(memo);
    } catch (Error) {
      console.log(Error);
    }
  }

  async destroy() {
    const selectedMemo = await this.select();
    const result = await this.dataManager.delete(selectedMemo);
    console.log(result);
  }

  #findByTitle(title) {
    const result = this.memos.find((memo) => {
      return memo.title === title;
    });
    return result;
  }
}
