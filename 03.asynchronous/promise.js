import sqlite3 from "sqlite3";
import timers from "timers/promises";
const db = new sqlite3.Database(":memory:");

const insert = (sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, function (error) {
      if (error) {
        reject(error);
      } else {
        console.log(`ID${this.lastID}が挿入されました`);
        resolve();
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
new Promise((resolve) => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
    () => resolve()
  );
})
  .then(() => insert('INSERT INTO books(title) VALUES("チェリー本")'))
  .then(() => insert('INSERT INTO books(title) VALUES("ブルーベリー本")'))
  .then(() => displayAll("SELECT * FROM books"))
  .then(() => db.run("drop table if exists books"));

await timers.setTimeout(100);

//エラーあり
new Promise((resolve) =>
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
    () => resolve()
  )
)
  .then(() => insert("INSERT INTO books"))
  .catch((error) => console.log(error.message))
  .then(() => insert('INSERT INTO books(title) VALUES("ブルーベリー本")'))
  .then(() => displayAll("SELECT * FROM book"))
  .catch((error) => console.log(error.message))
  .then(() => db.run("drop table if exists books"));
