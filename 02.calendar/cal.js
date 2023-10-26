#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const today = new Date();
const month = isFinite(argv.m) ? argv.m - 1 : today.getMonth();
const year = argv.y || today.getFullYear();

const printCal = (year, month) => {
  const monthFristDay = new Date(year, month, 1);
  const monthLastDay = new Date(year, month + 1, 0).getDate();

  console.log(`${" ".repeat(5)} ${month + 1}月 ${year}\n日 月 火 水 木 金 土`);

  if (monthFristDay.getDay() !== 0) {
    process.stdout.write("   ".repeat(monthFristDay.getDay()));
  }

  for (let i = 1; i <= monthLastDay; i++) {
    let date = new Date(year, month, i);
    let day = date.getDate().toString();

    if (date.toDateString() === today.toDateString()) {
      process.stdout.write(`\x1b[7m${day.padStart(2, " ")}\x1b[m `);
    } else {
      process.stdout.write(`${day.padStart(2, " ")} `);
    }

    if (date.getDay() === 6) console.log("");
  }
  console.log("\n");
};

printCal(year, month);
