import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

async function f() {
  console.log("1");
  let promise = new Promise((resolve) => {
    console.log("2");
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
      () => resolve("DONE")
    );
  });
  await promise;
  await function insertCherry() {
    db.run('INSERT INTO books(title) VALUES("チェリー本")');
  };
  db.get(
    "SELECT * FROM books WHERE rowid = last_insert_rowid()",
    (_err, row) => {
      console.log(row.id);
    }
  );
  db.run('INSERT INTO books(title) VALUES("キウイ本")');
  db.get(
    "SELECT * FROM books WHERE rowid = last_insert_rowid()",
    (_err, row) => {
      console.log(row.id);
    }
  );

  db.each("select * from books", (_err, row) => {
    console.log(`id:${row.id} タイトル：${row.title}`);
  });

  // db.run("drop table if exists books")
}

f();
