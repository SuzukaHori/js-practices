import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runSqlToInsert = (sql) =>
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

const createTable = () =>
  new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL)",
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });

//エラーなし

async function sequentialStart() {
  await createTable();
  await runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")');
  await runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")');
  await displayAll("SELECT * FROM books");
  db.run("drop table if exists books");
}

sequentialStart();
