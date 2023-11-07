import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

new Promise(function (resolve) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
    () => resolve()
  );
})
  .then(function () {
    return new Promise(function (resolve) {
      db.run('INSERT INTO books(title) VALUES("チェリー本")', () => resolve());
    });
  })
  .then(function () {
    return new Promise(function (resolve) {
      db.get(
        "SELECT * FROM books WHERE rowid = last_insert_rowid()",
        (_err, row) => {
          console.log(row.id);
          resolve();
        }
      );
    });
  })
  .then(function () {
    return new Promise(function (resolve) {
      db.run('INSERT INTO books(title) VALUES("チェリー本")', () => resolve());
    });
  })
  .then(function () {
    return new Promise(function (resolve) {
      db.get(
        "SELECT * FROM books WHERE rowid = last_insert_rowid()",
        (_err, row) => {
          console.log(row.id);
          resolve();
        }
      );
    });
  })
  .then(function () {
    return new Promise(function (resolve) {
      db.all("select * from books", (_err, rows) => {
        rows.forEach((element) => console.log(element));
        resolve();
      });
    });
  })
  .then(function () {
    db.run("drop table if exists books");
  });
