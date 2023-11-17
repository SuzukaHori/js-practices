import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

// エラーなし
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES ('チェリー本')", function () {
      console.log(`ID${this.lastID}のデータが追加されました`);
      db.run(
        "INSERT INTO books (title) VALUES ('ブルーベリー本')",
        function () {
          console.log(`ID${this.lastID}のデータが追加されました`);
          db.all("SELECT * FROM books", (_error, books) => {
            books.forEach((book) => {
              console.log(book);
            });
            db.run("DROP TABLE books");
          });
        }
      );
    });
  }
);

await timers.setTimeout(100);

// エラーあり
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES ('チェリー本')", function () {
      console.log(`ID${this.lastID}のデータが追加されました`);
      db.run(
        "INSERT INTO books (title) VALUES ('チェリー本')",
        function (error) {
          if (error) {
            console.error(error.message);
          } else {
            console.log(`ID${this.lastID}のデータが追加されました`);
          }
          db.all("SELECT * FROM book", (error, books) => {
            if (error) {
              console.error(error.message);
            } else {
              books.forEach((book) => {
                console.log(book);
              });
            }
            db.run("DROP TABLE books");
          });
        }
      );
    });
  }
);
