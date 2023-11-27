import Enquirer from "enquirer";

export class MemosController {
  constructor(dbManager) {
    this.dbManager = dbManager;
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
        throw Error;
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
      name: "memo",
      type: "select",
      message: `Choose a note you want to ${action}:`,
      choices: this.memos.map((memo) => ({ name: memo, message: memo.title })),
    };
    const answer = await Enquirer.prompt(question);
    return answer.memo;
  }

  #memosEmpty() {
    return this.memos.length === 0;
  }
}
