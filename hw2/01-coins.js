/** Exercise 01 - Coins **/

const COINS = [
  { singular: "dollar", plural: "dollars", cents: 100 },
  { singular: "quarter", plural: "quarters", cents: 25 },
  { singular: "dime", plural: "dimes", cents: 10 },
  { singular: "nickel", plural: "nickels", cents: 5 },
  { singular: "penny", plural: "pennies", cents: 1 },
];

const MAX_CENTS = 10000; // $100

const calculateChange = function calculateChange(amount) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "Error: the input must be a number";
  }
  if (amount < 0) {
    return "Error: the number cannot be negative";
  }

  let cents = Math.round(amount * 100);

  if (cents > MAX_CENTS) {
    return "Error: the number is too large";
  }
  if (cents === 0) {
    return "$0.00 ==> no coins needed";
  }

  const parts = [];
  COINS.forEach((coin) => {
    const count = Math.floor(cents / coin.cents);
    cents -= count * coin.cents;
    if (count > 0) {
      parts.push(`${count} ${count === 1 ? coin.singular : coin.plural}`);
    }
  });
  return parts.join(", ");
};

// Sample test cases
console.log(calculateChange(4.62));
// $4.62 ==> 4 dollars, 2 quarters, 1 dime, 2 pennies
console.log(calculateChange(0.16));
// $0.16 ==> 1 dime, 1 nickel, 1 penny
console.log(calculateChange(150.11));
// $150.11 ==> Error: the number is too large

// Add additional test cases here
console.log(calculateChange(0)); // no coins needed
console.log(calculateChange(0.01)); // 1 penny
console.log(calculateChange(1)); // 1 dollar
console.log(calculateChange(100)); // 100 dollars (max)
console.log(calculateChange(100.01)); // Error: too large
console.log(calculateChange(99.99)); // 99 dollars, 3 quarters, 2 dimes, 4 pennies
console.log(calculateChange(-5)); // Error: negative
console.log(calculateChange("abc")); // Error: not a number
console.log(calculateChange(NaN)); // Error: not a number
