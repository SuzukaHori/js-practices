import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { runSql, runSqlToInsert, displayAll } from "./function.js";

const db = new sqlite3.Database(":memory:");

//エラーなし

async function processSuccessfully() {
  await runSql(
    db, "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
  );
  let result = await runSqlToInsert(
    db, 'INSERT INTO books(title) VALUES("チェリー本")'
  );
  console.log(result);
  let result2 = await runSqlToInsert(
    db, 'INSERT INTO books(title) VALUES("ブルーベリー本")'
  );
  console.log(result2);
  await displayAll(db, "SELECT * FROM books");
  runSql(db, "drop table if exists books");
}

processSuccessfully();

await timers.setTimeout(100);

// // エラーあり

async function processWithErrors() {
  await runSql(
   db,  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
  );
  let result = await runSqlToInsert(
    db, 'INSERT INTO books(title) VALUES("チェリー本")'
  );
  console.log(result);
  try {
    await runSqlToInsert(db, 'INSERT INTO books(title) VALUES("チェリー本")');
  } catch (error) {
    console.log(error.message);
  }
  try {
    await displayAll(db, "SELECT * FROM book");
  } catch (error) {
    console.log(error.message);
  } finally {
    runSql(db, "drop table if exists books");
  }
}

processWithErrors();
