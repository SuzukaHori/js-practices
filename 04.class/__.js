#!/usr/bin/env node

import sqlite3 from "sqlite3";
import readline from "readline";
import minimist from "minimist";
import Enquirer from "enquirer";
import { runSql, retrieveAllRecords } from "./db-helpers.js";
const db = new sqlite3.Database("./memo.db");

async function select(memos) {
  const titleList = memos.map((memo) => memo.title);

  const question = {
    name: "title",
    type: "select",
    message: "メモを選んでください",
    choices: titleList,
  };
  const answer = await Enquirer.prompt(question);
  return answer;
}

async function selectAndDisplay() {
  const memos = await retrieveAllRecords(db, "SELECT * FROM memos");
  if (memos.length == 0) {
    console.log("メモはありません");
  } else {
    const selected = await select(memos);
    const content = memos.find((memo) => memo.title == selected.title).content;
    console.log(content);
  }
}

function acceptInputByLine(reader) {
  return new Promise((resolve) => {
    const lines = [];
    reader.on("line", (line) => {
      lines.push(line);
      resolve(lines);
    });
  });
}

async function createMemoObject(reader) {
  const memoByLine = await acceptInputByLine(reader);
  reader.close();
  const title = memoByLine[0];
  const content = memoByLine.join("\n");
  return { title: title, content: content };
}

async function create() {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  const reader = readline.createInterface({
    input: process.stdin,
  });
  const memo = await createMemoObject(reader);
  try {
    await runSql(
      db,
      `INSERT INTO memos (title, content) VALUES ('${memo.title}', '${memo.content}')`
    );
  } catch {
    console.log("メモの一行目はユニークにしてください");
  }
}

async function deleteMemo() {
  const memos = await retrieveAllRecords(db, "SELECT * FROM memos");
  const selected = await select(memos);
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
    create();
  }
}

main();
