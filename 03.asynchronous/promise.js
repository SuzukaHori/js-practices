import timers from "timers/promises";
import { runSql } from "./function.js";
import { runSqlToInsert } from "./function.js";
import { displayAll } from "./function.js";

//エラーなし
runSql(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
)
  .then(() => runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")'))
  .then((result) => {
    console.log(result);
    return runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")');
  })
  .then((result) => {
    console.log(result);
    return displayAll("SELECT * FROM books");
  })
  .then(() => runSql("drop table if exists books"));

await timers.setTimeout(100);

// //エラーあり
runSql(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
)
  .then(() =>
    runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")')
  )
  .then((result) => {
    console.log(result);
    return runSqlToInsert('INSERT INTO books(title) VALUES("ブルーベリー本")');
  })
  .catch((error) => console.log(error.message))
  .then(() => displayAll("SELECT * FROM book"))
  .catch((error) => console.log(error.message))
  .then(() => runSql("drop table if exists books"));
