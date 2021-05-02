const { d6 } = require("./dice");

function roller(dice, targetNumber, neededSuccesses, focus) {
  if (dice < 1) {
    return;
  }

  let totalSuccesses = 0;
  let rolls = [...Array(dice)]
    .map(() => d6())
    .sort()
    .map((roll) => {
      const success = roll >= targetNumber;
      if (success) {
        totalSuccesses++;
      }
      return { value: roll, success, focused: 0 };
    });

  if (focus > 0) {
    for (let i = rolls.length - 1; i >= 0; i--) {
      const roll = rolls[i];
      if (roll.value >= targetNumber) {
        continue;
      }

      const difference = targetNumber - roll.value;

      if (focus < difference) {
        break;
      }

      roll.value += difference;
      roll.success = true;
      roll.focused += difference;
      focus -= difference;
      totalSuccesses++;
    }
  }
  return {
    totalSuccesses,
    rolls,
    focus,
    success: totalSuccesses >= neededSuccesses,

}
module.exports = { roller };
