#!/usr/bin/env node
import minimist from "minimist";
const argv = minimist(process.argv.slice(2));
const today = new Date();

let month;
if (isFinite(argv.m)) {
  month = argv.m - 1;
} else {
  month = today.getMonth();
}
const year = argv.y || today.getFullYear();
const monthLastDay = new Date(year, month + 1, 0).getDate(); // 月は翌月、日の0は前月の最終日の意味

console.log(`      ${month + 1}月 ${year}`);
console.log("日 月 火 水 木 金 土");

let date = new Date(year, month, 1);
if (date.getDay() !== 0) {
  for (let i = 1; i <= date.getDay(); i++) {
    process.stdout.write("   ");
  }
}

for (let i = 1; i <= monthLastDay; i++) {
  let date = new Date(year, month, i);
  let day = date.getDate().toString();

  if (i < 10) {
    if (date.getDay() == 6) {
      console.log(`${day.padStart(2, " ")}`);
    } else {
      process.stdout.write(`${day.padStart(2, " ")} `);
    }
  } else if (date.getDay() == 6) {
    console.log(day);
  } else {
    process.stdout.write(`${date.getDate().toString()} `);
  }
}



