import sqlite3 from "sqlite3";

export class DbManager {
  constructor() {
    this.db = new sqlite3.Database("./memos.db");
  }

  async createTable() {
    return this.#run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title STRING(30) UNIQUE NOT NULL, content STRING(30))"
    );
  }

  async getAll() {
    const memos = await this.#all("SELECT * FROM memos");
    return memos;
  }

  async insert(title, content) {
    const result = await this.#run(
      "INSERT INTO memos (title, content) VALUES ($title, $content)",
      { $title: title, $content: content }
    );
    return { id: result.lastID, title, content };
  }

  async delete(id) {
    await this.#run("DELETE FROM memos WHERE id = ?", id);
    return id;
  }

  async update(title, content, id) {
    await this.#run(
      "UPDATE memos SET title = $title, content = $content WHERE id = $id",
      { $title: title, $content: content, $id: id }
    );
    return { id: id, title: title, content: content };
  }

  #run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  #all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
