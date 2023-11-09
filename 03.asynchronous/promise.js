import timers from "timers/promises";
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
        console.log(`ID${this.lastID}が挿入されました`);
        resolve(`ID${this.lastID}が挿入されました`);
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

//エラーなし
runSql(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
)
  .then(() => runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")'))
  .then(() =>
    runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")')
  )
  .then(() => displayAll("SELECT * FROM books"))
  .then(() => db.run("drop table if exists books"));

await timers.setTimeout(100);

//エラーあり
runSql(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
)
  .then(() =>
    runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")')
  )
  .then(() =>
    runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")')
  )
  .catch((error) => console.log(error.message))
  .then(() => displayAll("SELECT * FROM book"))
  .catch((error) => console.log(error.message))
  .then(() => runSql("drop table if exists books"));
