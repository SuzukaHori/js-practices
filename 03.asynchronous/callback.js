import sqlite3 from "sqlite3";
import timers from "timers/promises";

//エラーなし
const db = new sqlite3.Database(":memory:");

db.run("DROP TABLE IF EXISTS books", () => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)",
    () => {
      db.run('INSERT INTO books(title) VALUES("チェリー本")', function () {
        console.log(`ID${this.lastID}が追加されました`);
        db.run(
          'INSERT INTO books(title) VALUES("ブルーベリー本")',
          function () {
            console.log(`ID${this.lastID}が追加されました`);
            db.all("SELECT * FROM books", (_error, rows) => {
              rows.forEach((row) => console.log(row));
              db.run("drop table if exists books");
            });
          }
        );
      });
    }
  );
});

await timers.setTimeout(100);

//エラーあり

db.run("DROP TABLE IF EXISTS books", () => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)",
    () => {
      db.run('INSERT INTO books(title) VALUES("ブルーベリー本")', function () {
        console.log(`ID${this.lastID}が追加されました`);
        db.run(
          'INSERT INTO books(title) VALUES("ブルーベリー本")', // ここでエラー発生
          function (error) {
            if (error) {
              console.log(error.message);
            } else {
              console.log(`ID${this.lastID}が追加されました`);
            }
            db.all("SELECT * FROM book", (error, rows) => { //ここでエラー発生
              if (error) {
                console.log(error.message);
              } else {
                rows.forEach((row) => console.log(row));
              }
              db.run("drop table if exists books");
            });
          }
        );
      });
    }
  );
});
