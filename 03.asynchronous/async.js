import sqlite3 from "sqlite3";
import { run, all } from "./db-helpers.js";

const db = new sqlite3.Database(":memory:");

// エラーなし
await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
);
const bookNames = ["チェリー本", "ブルーベリー本"];
for (const bookName of bookNames) {
  const result = await run(
    db,
    "INSERT INTO books (title) VALUES (?)",
    bookName
  );
  console.log(`ID${result.lastID}のデータが追加されました`);
}
const books = await all(db, "SELECT * FROM books");
books.forEach((book) => {
  console.log(book);
});
await run(db, "DROP TABLE books");

// エラーあり
await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) NOT NULL UNIQUE)"
);
const result = await run(
  db,
  "INSERT INTO books (title) VALUES (?)",
  "チェリー本"
);
console.log(`ID${result.lastID}のデータが追加されました`);
try {
  await run(db, "INSERT INTO books (title) VALUES (?)", "チェリー本");
} catch (error) {
  if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  await all(db, "SELECT * FROM book");
} catch (error) {
  if (error instanceof Error && error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await run(db, "DROP TABLE books");
