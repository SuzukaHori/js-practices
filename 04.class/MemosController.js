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

  async create(title, content) {
    try {
      const insertedMemo = await this.dbManager.insert(title, content);
      console.log(`Memo "${insertedMemo.title}" inserted.`);
    } catch (error) {
      if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
        console.error("Error: The first line of a memo must be unique.");
      } else {
        throw error;
      }
    }
  }

  async read() {
    const memos = await this.#getAllMemos();
    const selectedMemo = await this.#select(memos, "see");
    console.log(selectedMemo.fullText());
  }

  async destroy() {
    const memos = await this.#getAllMemos();
    const selectedMemo = await this.#select(memos, "destroy");
    const destroyedMemo = await this.dbManager.delete(selectedMemo);
    console.log(`Memo "${destroyedMemo.title}" destroyed.`);
  }

  async #select(memos, action) {
    this.#exitIfEmpty(memos);
    const titleList = memos.map((memo) => memo.title);
    const question = {
      name: "title",
      type: "select",
      message: `Choose a note you want to ${action}:`,
      choices: titleList,
    };
    const answer = await Enquirer.prompt(question);
    const selectedMemo = this.#findByTitle(memos, answer.title);
    return selectedMemo;
  }

  async #getAllMemos() {
    return await this.dbManager.getAll();
  }

  #findByTitle(memos, title) {
    return memos.find((memo) => {
      return memo.title === title;
    });
  }

  #exitIfEmpty(memos) {
    if (memos.length === 0) {
      console.log("メモはありません");
      process.exit();
    }
  }
}
