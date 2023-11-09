import timers from "timers/promises";
import { runSql } from "./function.js";
import { runSqlToInsert } from "./function.js";
import { displayAll } from "./function.js";

//エラーなし

async function sequentialStart() {
  await runSql(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
  );
  let result = await runSqlToInsert(
    'INSERT INTO books(title) VALUES("チェリー本")'
  );
  console.log(result);
  let result2 = await runSqlToInsert(
    'INSERT INTO books(title) VALUES("ブルーベリー本")'
  );
  console.log(result2);
  await displayAll("SELECT * FROM books");
  runSql("drop table if exists books");
}

sequentialStart();

await timers.setTimeout(100);

// // エラーあり
async function errorSequential() {
  await runSql(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(10) UNIQUE)"
  );
  await runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")');
  try {
    await runSqlToInsert('INSERT INTO books(title) VALUES("チェリー本")');
  } catch (error) {
    console.log(error.message);
  }
  try {
    await displayAll("SELECT * FROM book");
  } catch (error) {
    console.log(error.message);
  }
  runSql("drop table if exists books");
}

errorSequential();
