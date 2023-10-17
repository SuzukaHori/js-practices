import fizzbuzz from "./fizzbuzz.js";

test("3の倍数の時Fizzを返す", () => {
  expect(fizzbuzz(3)).toBe("Fizz");
});

test("5の倍数の時Buzzを返す", () => {
  expect(fizzbuzz(5)).toBe("Buzz");
});

test("15の倍数の時Fizzbuzzを返す", () => {
  expect(fizzbuzz(15)).toBe("Fizzbuzz");
});
