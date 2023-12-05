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
    await Memo.dbManager.run(
      "INSERT INTO memos (title, content) VALUES ($title, $content)",
      { $title: this.title, $content: this.content }
    );
    return this;
  }

  async destroy() {
    await Memo.dbManager.createTable();
    await Memo.dbManager.run("DELETE FROM memos WHERE id = ?", this.id);
    return this;
  }

  async update(title, content) {
    await Memo.dbManager.createTable();
    const updated = await Memo.dbManager.run(
      "UPDATE memos SET title = $title, content = $content WHERE id = $id",
      { $title: title, $content: content, $id: this.id }
    );
    return new Memo(title, content, updated.lastID);
  }

  static async findByTitle(title) {
    const memos = await Memo.findAll();
    return memos.find((memo) => memo.title === title);
  }

  static async findAll() {
    await Memo.dbManager.createTable();
    const memos = await Memo.dbManager.all("SELECT * FROM memos")
    return memos.map((memo) => new Memo(memo.title, memo.content, memo.id));
  }

  fullText() {
    return this.title + "\n" + this.content;
  }
}
