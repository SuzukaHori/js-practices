import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, all } from "./db-helpers.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() => run(db, "INSERT INTO books (title) VALUES ('チェリー本')"))
  .then((queryResult) => {
    console.log(`ID${queryResult.lastID}のデータが追加されました`);
    return run(db, "INSERT INTO books (title) VALUES ('ブルーベリー本')");
  })
  .then((queryResult) => {
    console.log(`ID${queryResult.lastID}のデータが追加されました`);
    return all(db, "SELECT * FROM books");
  })
  .then((books) => {
    books.forEach((book) => {
      console.log(book);
    });
    return run(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

// エラーあり
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() => run(db, "INSERT INTO books (title) VALUES ('チェリー本')"))
  .then((queryResult) => {
    console.log(`ID${queryResult.lastID}のデータが追加されました`);
    return run(db, "INSERT INTO books (title) VALUES ('チェリー本')");
  })
  .catch((error) => {
    if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
      console.error(error.message);
      return all(db, "SELECT * FROM book");
    } else {
      throw error;
    }
  })
  .catch((error) => {
    if (error instanceof Error && error.code === "SQLITE_ERROR") {
      console.error(error.message);
      return run(db, "DROP TABLE books");
    } else {
      throw error;
    }
  });
