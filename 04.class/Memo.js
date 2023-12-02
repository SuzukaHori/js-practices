import { DbManager } from "./db-manager.js";

export class Memo {
  static dbManager = new DbManager();

  constructor(title, content, id = null) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  async save() {
    await Memo.dbManager.createTable();
    await Memo.dbManager.insert(this.title, this.content);
    return this;
  }

  async destroy() {
    await Memo.dbManager.createTable();
    await Memo.dbManager.delete(this.id);
    return this;
  }

  async update(title, content) {
    await Memo.dbManager.createTable();
    const updated = await Memo.dbManager.update(title, content, this.id);
    return new Memo(updated.title, updated.content, updated.id);
  }

  static async findByTitle(title) {
    const memos = await Memo.findAll();
    return memos.find((memo) => memo.title === title);
  }

  static async findAll() {
    await Memo.dbManager.createTable();
    const memos = await Memo.dbManager.getAll();
    return memos.map((memo) => new Memo(memo.title, memo.content, memo.id));
  }

  fullText() {
    return this.title + "\n" + this.content;
  }
}
