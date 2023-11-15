import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { runSql, runSqlToGetAll } from "./db-helpers.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() =>
    runSql(db, "INSERT INTO books (title) VALUES ('チェリー本')")
  )
  .then((queryResult) => {
    console.log(`ID${queryResult.lastID}のデータが追加されました`);
    return runSql(
      db,
      "INSERT INTO books (title) VALUES ('ブルーベリー本')"
    );
  })
  .then((queryResult) => {
    console.log(`ID${queryResult.lastID}のデータが追加されました`);
    return runSqlToGetAll(db, "SELECT * FROM books");
  })
  .then((books) => {
    books.forEach((book) => {
      console.log(book);
    });
    runSql(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

// エラーあり
runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() =>
    runSql(db, "INSERT INTO books (title) VALUES ('チェリー本')")
  )
  .then((queryResult) => {
    console.log(`ID${queryResult.lastID}のデータが追加されました`);
    return runSql(
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
  .then(() => runSqlToGetAll(db, "SELECT * FROM book"))
  .catch((error) => {
    if (error.code === "SQLITE_ERROR") {
      console.error(error.message);
    } else {
      throw error;
    }
  })
  .then(() => runSql(db, "DROP TABLE books"));
