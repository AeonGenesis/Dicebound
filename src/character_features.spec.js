const {
  HumanFeatures,
  StormcastFeatures,
  AelfFeatures,
  DuardinFeatures,
  SylvanethFeatures,
} = require('./character_features');
const { randomInt } = require('./util');

jest.mock('./character_features');
jest.mock('./util');
jest.mock('./dice');

describe('Character Features', () => {
  beforeEach(() => {
    HumanFeatures.mockClear();
    StormcastFeatures.mockClear();
    AelfFeatures.mockClear();
    DuardinFeatures.mockClear();
    SylvanethFeatures.mockClear();

    randomInt.mockClear();
  });

  it('Should create a new instance of the HumanFeatures class', async () => {
    const human = new HumanFeatures();
    expect(HumanFeatures).toHaveBeenCalledTimes(1);
  });
});
