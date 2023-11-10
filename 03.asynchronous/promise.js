import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { runSql, runSqlToInsert, displayAll } from "./function.js";

const db = new sqlite3.Database(":memory:");

//エラーなし
runSql(
  db, "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() => runSqlToInsert(db, 'INSERT INTO books(title) VALUES("チェリー本")'))
  .then((result) => {
    console.log(result);
    return runSqlToInsert(db, 'INSERT INTO books(title) VALUES("ブルーベリー本")');
  })
  .then((result) => {
    console.log(result);
    return displayAll(db, "SELECT * FROM books");
  })
  .then(() => runSql(db, "drop table if exists books"));

await timers.setTimeout(100);

// //エラーあり
runSql(
  db, "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE NOT NULL)"
)
  .then(() =>
    runSqlToInsert(db, 'INSERT INTO books(title) VALUES("ブルーベリー本")')
  )
  .then((result) => {
    console.log(result);
    return runSqlToInsert(db, 'INSERT INTO books(title) VALUES("ブルーベリー本")');
  })
  .catch((error) => console.log(error.message))
  .then(() => displayAll(db, "SELECT * FROM book"))
  .catch((error) => console.log(error.message))
  .finally(() => runSql(db, "drop table if exists books"));
