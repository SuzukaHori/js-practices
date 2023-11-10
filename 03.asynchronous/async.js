import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { runSql, runSqlToInsert, displayAll } from "./function.js";

const db = new sqlite3.Database(":memory:");

//エラーなし

async function processSuccessfully() {
  await runSql(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
  );
  let id = await runSqlToInsert(
    db,
    "INSERT INTO books (title) VALUES ('チェリー本')"
  );
  console.log(`ID${id}の要素が追加されました`);
  let id2 = await runSqlToInsert(
    db,
    "INSERT INTO books (title) VALUES ('ブルーベリー本')"
  );
  console.log(`ID${id2}の要素が追加されました`);
  const rows = await displayAll(db, "SELECT * FROM books");
  rows.forEach((row) => {
    console.log(row);
  });
  await runSql(db, "DROP TABLE books");
}

processSuccessfully();

await timers.setTimeout(100);

// // エラーあり

async function processWithErrors() {
  await runSql(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
  );
  let id = await runSqlToInsert(
    db,
    "INSERT INTO books (title) VALUES ('チェリー本')"
  );
  console.log(`ID${id}の要素が追加されました`);
  try {
    await runSqlToInsert(db,  "INSERT INTO books (title) VALUES ('チェリー本')");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      console.error(error.message);
    } else {
      throw error;
    }
  }
  try {
    await displayAll(db, "SELECT * FROM book");
  } catch (error) {
    if (error.code === "SQLITE_ERROR") {
      console.error(error.message);
    } else {
      throw error;
    }
  }
  await runSql(db, "DROP TABLE books");
}

processWithErrors();
