import sqlite3 from "sqlite3";

export class DbManager {
  constructor() {
    this.db = new sqlite3.Database("./memos.db");
  }

  async createTable() {
    return this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title STRING(30) UNIQUE NOT NULL, content STRING(30))"
    );
  }

  run(sql, params = []) {
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

  all(sql, params = []) {
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
