#!/usr/bin/env node

 const fizzbuzz = (n) => {
  if (n % 15 === 0) {
    return "Fizzbuzz";
  } else if (n % 3 === 0) {
    return "Fizz";
  } else if (n % 5 === 0) {
    return "Buzz";
  } else {
    return n;
  }
};

for (let n = 1; n <= 20; n++) {
  console.log(fizzbuzz(n));
}

export default fizzbuzz;
