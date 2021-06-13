const randomInt = (min, max) =>
  Math.floor(min + Math.random() * (max - min + 1));

module.exports = { randomInt };
