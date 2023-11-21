import sqlite3 from "sqlite3";
import { Memo } from "./memo.js";

export class dbManager {
  constructor() {
    this.db = new sqlite3.Database("./memo.db");
  }

  async createTable() {
    return this.#run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title STRING(30) UNIQUE NOT NULL, content STRING(30))"
    );
  }

  async getAll() {
    const memos = await this.#all("SELECT * FROM memos");
    return memos.map((memo) => new Memo(memo.id, memo.title, memo.content));
  }

  async insert(memo) {
    await this.#run(
      `INSERT INTO memos (title, content) VALUES ($title, $content)`,
      { $title: memo.title, $content: memo.content }
    );

    return memo;
  }

  delete(memo) {
    return this.#run(`DELETE FROM memos WHERE id = ?`, memo.id);
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

  #get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, function (error, row) {
        if (error) {
          reject(error);
        } else {
          resolve(row);
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
