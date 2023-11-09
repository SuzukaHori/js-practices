import sqlite3 from "sqlite3";
import timers from "timers/promises";
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

async function sequentialStart() {
  await runSql(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
  );
  await runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")');
  await runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")');
  await displayAll("SELECT * FROM books");
  runSql("drop table if exists books");
}

sequentialStart();

await timers.setTimeout(100);

// エラーあり
async function errorSequential() {
  await runSql(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
  );
  await runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")');
  try {
    await runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")');
  } catch (error) {
    console.log(error.message);
  }
  try {
    await displayAll("SELECT * FROM book");
  } catch (error) {
    console.log(error.message);
  }
  runSql("drop table if exists books");
}

errorSequential();
