import sqlite3 from "sqlite3";
import timers from "timers/promises";

//エラーなし
const db = new sqlite3.Database(":memory:");

db.run("DROP TABLE IF EXISTS books", [], function createTable() {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
    function insertCherry() {
      db.run(
        'INSERT INTO books(title) VALUES("チェリー本")',
        function displayLastId() {
          db.get(
            "SELECT * FROM books WHERE rowid = last_insert_rowid()",
            (_error, row) => {
              console.log(row.id);
              db.run(
                'INSERT INTO books(title) VALUES("ブルーベリー本")',
                function displayLastId() {
                  db.get(
                    "SELECT * FROM books WHERE rowid = last_insert_rowid()",
                    (_error, row) => {
                      console.log(row.id);
                      db.all("SELECT * FROM books", (_error, rows) => {
                        rows.forEach((row) =>
                          console.log(`${row.id} ${row.title}`)
                        );
                        db.run("drop table if exists books");
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

await timers.setTimeout(100);

//エラーあり

db.run("DROP TABLE IF EXISTS books", [], function createTable() {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
    function insertCherry() {
      db.run(
        'INSERT INTO books(title) VALUES("チェリー本")',
        function displayLastId() {
          db.get(
            "SELECT * FROM books WHERE rowid = last_insert_rowid()",
            (_error, row) => {
              console.log(row.id);
              db.run(
                'INSERT INTO book(title) VALUES("ブルーベリー本")', //ここでエラー発生
                (error) => {
                  if (error) {
                    console.error(error.message);
                  } else {
                    db.get(
                      "SELECT * FROM books WHERE rowid = last_insert_rowid()",
                      (_error, row) => {
                        console.log(row.id);
                      }
                    );
                  }
                  db.all("SELECT ** FROM books", (error, rows) => {
                    //ここでエラー発生
                    if (error) {
                      console.error(error.message);
                    } else {
                      rows.forEach((row) =>
                        console.log(`${row.id} ${row.title}`)
                      );
                    }
                    db.run("drop table if exists books");
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});
