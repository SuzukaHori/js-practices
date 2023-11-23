import Enquirer from "enquirer";

export class MemosController {
  constructor(dbManager) {
    this.dbManager = dbManager;
  }

  async index() {
    const memos = await this.#getAllMemos();
    this.#exitIfEmpty(memos);
    for (const memo of memos) {
      console.log(memo.title);
    }
  }

  async read() {
    const memos = await this.#getAllMemos();
    const selectedMemo = await this.#select(memos);
    console.log(selectedMemo.fullText());
  }

  async create(title, content) {
    try {
      const result = await this.dbManager.insert(title, content);
      console.log(result)
    } catch (error) {
      if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
        console.error("Error: The first line of a memo must be unique");
      } else {
        throw error;
      }
    }
  }

  async destroy() {
    const memos = await this.#getAllMemos();
    const selectedMemo = await this.#select(memos);
    const result = await this.dbManager.delete(selectedMemo);
    console.log(result);
  }

  async #select(memos) {
    this.#exitIfEmpty(memos);
    const titleList = memos.map((memo) => memo.title);
    const question = {
      name: "title",
      type: "select",
      message: "Choose a note you want to see:",
      choices: titleList,
    };
    const answer = await Enquirer.prompt(question);
    const selectedMemo = this.#findByTitle(memos, answer.title);
    return selectedMemo;
  }

  async #getAllMemos() {
    const memos = await this.dbManager.getAll();
    return memos;
  }

  #findByTitle(memos, title) {
    const found = memos.find((memo) => {
      return memo.title === title;
    });
    return found;
  }

  #exitIfEmpty(memos) {
    if (memos.length === 0) {
      console.log("メモはありません");
      process.exit();
    }
  }
}
