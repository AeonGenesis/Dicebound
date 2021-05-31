const {
  HumanFeatures,
  StormcastFeatures,
  AelfFeatures,
  DuardinFeatures,
  SylvanethFeatures,
} = require('./character_features');

describe('Character Features', () => {
  describe('Human', () => {
    it('should have valid values for a new human object', async () => {
      const human = new HumanFeatures();

      expect(human.age).toBeTruthy();
      expect(human.eyeType).toBeTruthy();
      expect(human.eyeColor).toBeTruthy();
      expect(human.hairColor).toBeTruthy();
      expect(human.height).toBeTruthy();
      expect(human.distinguishingFeature).toBeTruthy();
    });
  });
});
