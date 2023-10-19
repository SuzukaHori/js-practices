#!/usr/bin/env node
import minimist from "minimist";
const argv = minimist(process.argv.slice(2));
const today = new Date();
const month = isFinite(argv.m) ? argv.m - 1 : today.getMonth();
const year = argv.y || today.getFullYear();

const printCal = (year, month) => {
  const monthLastDay = new Date(year, month + 1, 0).getDate();
  const monthFristDay = new Date(year, month, 1);

  console.log(`      ${month + 1}月 ${year}`);
  console.log("日 月 火 水 木 金 土");

  if (monthFristDay.getDay() !== 0) {
    for (let i = 1; i <= monthFristDay.getDay(); i++) {
      process.stdout.write("   ");
    }
  }

  for (let i = 1; i <= monthLastDay; i++) {
    let date = new Date(year, month, i);
    let day = date.getDate().toString();

    if (i < 10) {
      process.stdout.write(day.padStart(2, " "));
    } else {
      process.stdout.write(day);
    }
    process.stdout.write(" ");
    if (date.getDay() == 6) {
      console.log("");
    }
  }
  console.log("\n");
};

printCal(year, month);
