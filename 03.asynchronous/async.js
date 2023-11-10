import sqlite3 from "sqlite3";
import { runSql, runSqlToInsert, runSqlToGetAll } from "./db-helpers.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
await runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
);
const books = ["チェリー本", "ブルーベリー本"];
books.forEach(async (book) => {
  let id = await runSqlToInsert(
    db,
    `INSERT INTO books (title) VALUES ('${book}')`
  );
  console.log(`ID${id}のデータが追加されました`);
});
const rows = await runSqlToGetAll(db, "SELECT * FROM books");
rows.forEach((row) => {
  console.log(row);
});
await runSql(db, "DROP TABLE books");

// エラーあり
await runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
);
const id = await runSqlToInsert(
  db,
  "INSERT INTO books (title) VALUES ('チェリー本')"
);
console.log(`ID${id}のデータが追加されました`);
try {
  await runSqlToInsert(db, "INSERT INTO books (title) VALUES ('チェリー本')");
} catch (error) {
  if (error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  await runSqlToGetAll(db, "SELECT * FROM book");
} catch (error) {
  if (error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await runSql(db, "DROP TABLE books");
