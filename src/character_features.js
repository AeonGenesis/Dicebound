const { d6 } = require('./dice');
const { randomInt } = require('./util');

const distinguishingFeatures = require('../options/distinguishing-features');
const eyeType = require('../options/eye-type');
const eyeColor = require('../options/eye-color');
const hairColor = require('../options/hair-color');

function addDiceResults(dice) {
  return [...Array(dice)]
    .map(() => d6())
    .reduce((currentValue, nextValue) => nextValue + currentValue);
}

function randomDistinguishingFeature() {
  const categories = Object.keys(distinguishingFeatures);
  const randomCategory = categories[randomInt(0, categories.length - 1)];
  const features = distinguishingFeatures[randomCategory];
  const randomFeature = features[randomInt(0, features.length - 1)];
  return `${randomCategory}: ${randomFeature}`;
}

function centimetersToFeetInches(centimeters) {
  const inches = Math.round(centimeters / 2.54);
  const convertedHeight = {
    feet: Math.floor(inches / 12),
    inches: inches % 12,
  };
  return convertedHeight;
}

function calculateHeight(defaultHeight, dice) {
  const heightInCentimeters =
    defaultHeight +
    [...Array(dice)]
      .map(() => d6())
      .reduce((currentValue, nextValue) => nextValue + currentValue);

  const heightInFeetInches = centimetersToFeetInches(heightInCentimeters);

  const feet = heightInFeetInches.feet;
  const inches = heightInFeetInches.inches;

  return `${feet}'${inches}"`;
}

class HumanFeatures {
  constructor() {
    this.age = addDiceResults(3) + 15;
    this.eyeType = eyeType[randomInt(0, eyeType.length - 1)];
    this.eyeColor = eyeColor.human[randomInt(0, eyeColor.human.length - 1)];
    this.hairColor = hairColor.human[randomInt(0, hairColor.human.length)];
    this.height = calculateHeight(147.32, 3);
    this.distinguishingFeature = randomDistinguishingFeature();
  }
}

class StormcastFeatures {
  constructor() {
    this.age = 'Unknowable';
    this.eyeType = eyeType[randomInt(0, eyeType.length - 1)];
    this.eyeColor = eyeColor.human[randomInt(0, eyeColor.human.length - 1)];
    this.hairColor = hairColor.human[randomInt(0, hairColor.human.length - 1)];
    this.height = calculateHeight(203.2, 3);
    this.distinguishingFeature = randomDistinguishingFeature();
  }
}

class AelfFeatures {
  constructor() {
    this.age = addDiceResults(6) * 5;
    this.eyeType = eyeType[randomInt(0, eyeType.length - 1)];
    this.eyeColor = eyeColor.aelf[randomInt(0, eyeColor.aelf.length - 1)];
    this.hairColor = hairColor.aelf[randomInt(0, hairColor.aelf.length - 1)];
    this.height = calculateHeight(177.8, 2);
    this.distinguishingFeature = randomDistinguishingFeature();
  }
}

class DuardinFeatures {
  constructor() {
    this.age = addDiceResults(4) * 5;
    this.eyeType = eyeType[randomInt(0, eyeType.length - 1)];
    this.eyeColor = eyeColor.duardin[randomInt(0, eyeColor.duardin.length - 1)];
    this.hairColor =
      hairColor.duardin[randomInt(0, hairColor.duardin.length - 1)];
    this.height = calculateHeight(124.46, 2);
    this.distinguishingFeature = randomDistinguishingFeature();
  }
}

class SylvanethFeatures {
  constructor({ isKurnoth = false }) {
    this.age = addDiceResults(1) * addDiceResults(1) * addDiceResults(1);
    this.eyeType = eyeType[randomInt(0, eyeType.length - 1)];
    this.eyeColor =
      eyeColor.sylvaneth[randomInt(0, eyeColor.sylvaneth.length - 1)];
    this.hairColor =
      hairColor.sylvaneth[randomInt(0, hairColor.sylvaneth.length - 1)];
    this.height = isKurnoth
      ? `${d6() + d6() + 3}'${d6()}"`
      : calculateHeight(162.56, 2);
    this.distinguishingFeature = randomDistinguishingFeature();
  }
}

const commands = {
  '#human': () => new HumanFeatures(),
  '#aelf': () => new AelfFeatures(),
  '#duardin': () => new DuardinFeatures(),
  '#sylvaneth': () => new SylvanethFeatures({ isKurnoth: false }),
  '#sylvaneth-kurnoth': () => new SylvanethFeatures({ isKurnoth: true }),
};

module.exports = {
  HumanFeatures,
  StormcastFeatures,
  AelfFeatures,
  DuardinFeatures,
  SylvanethFeatures,
  commands,
};
