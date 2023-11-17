import sqlite3 from "sqlite3";
import { runSql, retrieveAllRecords } from "./db-helpers.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
await runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
);
const bookNames = ["チェリー本", "ブルーベリー本"];
for (const bookName of bookNames) {
  const queryResult = await runSql(
    db,
    `INSERT INTO books (title) VALUES ('${bookName}')`
  );
  console.log(`ID${queryResult.lastID}のデータが追加されました`);
}
const books = await retrieveAllRecords(db, "SELECT * FROM books");
books.forEach((book) => {
  console.log(book);
});
await runSql(db, "DROP TABLE books");

// エラーあり
await runSql(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
);
const queryResult = await runSql(
  db,
  "INSERT INTO books (title) VALUES ('チェリー本')"
);
console.log(`ID${queryResult.lastID}のデータが追加されました`);
try {
  await runSql(db, "INSERT INTO books (title) VALUES ('チェリー本')");
} catch (error) {
  if (error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  await retrieveAllRecords(db, "SELECT * FROM book");
} catch (error) {
  if (error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await runSql(db, "DROP TABLE books");
