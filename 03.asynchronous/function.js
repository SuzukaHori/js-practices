import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runSql = (sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

const runSqlToInsert = (sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(`ID${this.lastID}が追加されました`);
      }
    });
  });

const displayAll = (sql) =>
  new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        rows.forEach((element) => console.log(element));
        resolve();
      }
    });
  });

export { runSql, runSqlToInsert, displayAll };
