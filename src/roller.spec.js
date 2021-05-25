jest.mock('./dice');

const { roller } = require('./roller');
const { d6 } = require('./dice');
const { arrayContaining } = expect;

describe('roller', () => {
  beforeEach(() => {
    d6.mockReset();
  });

  const setupRolls = values => {
    if (!Array.isArray(values)) {
      values = [values];
    }

    let index = 0;

    d6.mockImplementation(() => values[index++]);
  };

  it('should return undefined if dice is less than 1', async () => {
    const testDice = -1;

    const result = roller(testDice);

    expect(result).toBeUndefined();
  });

  it('should count as a success if roll is greater or equal to target number', async () => {
    const testDice = 3;
    const testTargetNumber = 4;
    const testNeededSuccesses = 1;
    const testRolls = [2, 3, 4];
    const expectedRolls = testRolls.map(roll => ({
      focused: 0,
      success: roll >= testTargetNumber,
      value: roll,
    }));

    setupRolls(testRolls);

    const result = roller(testDice, testTargetNumber, testNeededSuccesses);

    expect(result).toBeDefined();
    expect(result.totalSuccesses).toBe(1);
    expect(result.rolls).toEqual(arrayContaining(expectedRolls));
    expect(result.focus).toBe(0);
    expect(result.success).toBe(true);
  });

  it('should return failure when no dice are rolled at above the target number', async () => {
    const testDice = 2;
    const testTargetNumber = 3;
    const testNeededSuccesses = 1;
    const testRolls = [1, 2];
    const expectedRolls = testRolls.map(roll => ({
      focused: 0,
      success: roll >= testTargetNumber,
      value: roll,
    }));

    setupRolls(testRolls);

    const result = roller(testDice, testTargetNumber, testNeededSuccesses);

    expect(result).toBeDefined();
    expect(result.totalSuccesses).toBe(0);
    expect(result.rolls).toEqual(arrayContaining(expectedRolls));
    expect(result.focus).toBe(0);
    expect(result.success).toBe(false);
  });

  it('should make a non success roll into a success using a focus', async () => {
    const testDice = 1;
    const testTargetNumber = 2;
    const testNeededSuccesses = 1;
    const testFocus = 1;
    const testRolls = [1];
    const expectedRolls = testRolls.map(roll => ({
      focused: 1,
      success: true,
      value: 2,
    }));

    setupRolls(testRolls);

    const result = roller(
      testDice,
      testTargetNumber,
      testNeededSuccesses,
      testFocus,
    );

    expect(result).toBeDefined();
    expect(result.totalSuccesses).toBe(1);
    expect(result.rolls).toEqual(arrayContaining(expectedRolls));
    expect(result.focus).toBe(0);
    expect(result.success).toBe(true);
  });
});
