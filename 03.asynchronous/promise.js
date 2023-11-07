import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runner = (sql) =>
  new Promise((resolve) => {
    db.run(sql, () => resolve());
  });

const displayLastId = () =>
  new Promise((resolve) => {
    db.get(
      "SELECT * FROM books WHERE rowid = last_insert_rowid()",
      (_err, row) => {
        console.log(row.id);
        resolve();
      }
    );
  });

new Promise((resolve) => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
    () => resolve()
  );
})
  .then(() => {
    return runner('INSERT INTO books(title) VALUES("チェリー本")');
  })
  .then(() => {
    return displayLastId();
  })
  .then(() => {
    return runner('INSERT INTO books(title) VALUES("ブルーベリー本")');
  })
  .then(() => {
    return displayLastId();
  })
  .then(() => {
    return new Promise((resolve) => {
      db.all("select * from books", (_err, rows) => {
        rows.forEach((element) => console.log(element));
        resolve();
      });
    });
  })
  .then(() => {
    db.run("drop table if exists books");
  });
