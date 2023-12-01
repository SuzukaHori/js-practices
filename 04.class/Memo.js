import { DbManager } from "./db-manager.js";

export class Memo {
  constructor(title, content, id = null) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.dbManager = new DbManager();
  }

  async save() {
    await Memo.#setDb(this.dbManager);
    const memo = await this.dbManager.insert(this.title, this.content);
    return new Memo(memo.title, memo.content, memo.id);
  }

  async destroy() {
    this.dbManager = new DbManager();
    await Memo.#setDb(this.dbManager);
    const destroyedMemo = await this.dbManager.delete(this);
    return destroyedMemo;
  }

  static async findByTitle(title) {
    const memos = await Memo.findAll()
    return memos.find((memo) => memo.title === title);
  }

  static async findAll() {
    this.dbManager = new DbManager();
    await Memo.#setDb(this.dbManager);
    const memos = await this.dbManager.getAll();
    return memos.map((memo) => new Memo(memo.title, memo.content, memo.id));
  }

  fullText() {
    return this.title + "\n" + this.content;
  }

  static empty(memos){
    return memos.length === 0;
  }

  static async #setDb(dbManager) {
    await dbManager.createTable();
  }
}
