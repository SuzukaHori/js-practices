import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { runSql, runSqlToInsert, displayAll } from "./function.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() =>
    runSqlToInsert(db, "INSERT INTO books (title) VALUES ('チェリー本')")
  )
  .then((id) => {
    console.log(`ID${id}のデータが追加されました`);
    return runSqlToInsert(
      db,
      "INSERT INTO books (title) VALUES ('ブルーベリー本')"
    );
  })
  .then((id) => {
    console.log(`ID${id}のデータが追加されました`);
    return displayAll(db, "SELECT * FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(row);
    });
  })
  .then(() => runSql(db, "DROP TABLE books"));

await timers.setTimeout(100);

// エラーあり
runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() =>
    runSqlToInsert(db, "INSERT INTO books (title) VALUES ('チェリー本')")
  )
  .then((id) => {
    console.log(`ID${id}のデータが追加されました`);
    return runSqlToInsert(
      db,
      "INSERT INTO books (title) VALUES ('チェリー本')"
    );
  })
  .catch((error) => {
    if (error.code === "SQLITE_CONSTRAINT") {
      console.error(error.message);
    } else {
      throw error;
    }
  })
  .then(() => displayAll(db, "SELECT * FROM book"))
  .catch((error) => {
    if (error.code === "SQLITE_ERROR") {
      console.error(error.message);
    } else {
      throw error;
    }
  })
  .then(() => runSql(db, "DROP TABLE books"));
