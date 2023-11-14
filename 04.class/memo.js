#!/usr/bin/env node

import sqlite3 from "sqlite3";
import readline from "readline";
import minimist from "minimist";
import Enquirer from "enquirer";
import { runSql, runSqlToInsert, runSqlToGetAll } from "./db-helpers.js";
const db = new sqlite3.Database("./memo.db");

async function selectMemo(memos) {
  const listStartOfMemo = memos.map((memo) => memo.title);

  const question = {
    name: "title",
    type: "select",
    message: "メモを選んでください",
    choices: listStartOfMemo,
  };
  const answer = await Enquirer.prompt(question);
  return answer;
}

async function selectAndDisplay() {
  const memos = await runSqlToGetAll(db, "SELECT * FROM memos");
  if (memos.length == 0) {
    console.log("メモはありません");
  } else {
    const selected = await selectMemo(memos);
    const selectedTitle = memos.find(
      (memo) => memo.title == selected.title
    ).content;
    console.log(selectedTitle);
  }
}

async function addMemo() {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  const memo = [];
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    reader.on("line", (lines) => {
      memo.push(lines);
      resolve(memo);
    });
  });

  await new Promise((resolve) => {
    reader.on("close", resolve(""));
  });
  const title = memo[0];
  const content = memo.join("\n");
  const id = await runSqlToInsert(
    db,
    `INSERT INTO memos (title, content) VALUES ('${title}', '${content}')`
  );
  console.log(`${id}番目のメモが追加されました`);
}

async function deleteMemo() {
  const memos = await runSqlToGetAll(db, "SELECT * FROM memos");
  const selected = await selectMemo(memos);
  console.log(selected.title);
  await runSql(db, `DELETE FROM memos WHERE title = '${selected.title}'`);
  console.log(`${selected.title}が削除されました`);
}

async function main() {
  const option = minimist(process.argv.slice(2));
  await runSql(
    db,
    "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title STRING(30) UNIQUE NOT NULL, content STRING(30))"
  );
  if (option.r) {
    selectAndDisplay();
  } else if (option.d) {
    deleteMemo();
  } else {
    addMemo();
  }
}

main();
