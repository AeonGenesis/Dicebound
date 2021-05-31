const {
  HumanFeatures,
  StormcastFeatures,
  AelfFeatures,
  DuardinFeatures,
  SylvanethFeatures,
  commands,
} = require('./character_features');

describe('Character Features', () => {
  it.each`
    race
    ${'#human'}
    ${'#aelf'}
    ${'#duardin'}
    ${'#sylvaneth'}
    ${'#sylvaneth-kurnoth'}
  `('should have valid values for a new $race object', async ({ race }) => {
    const character = commands[race]();

    expect(character.age).toBeTruthy();
    expect(character.eyeType).toBeTruthy();
    expect(character.eyeColor).toBeTruthy();
    expect(character.hairColor).toBeTruthy();
    expect(character.height).toBeTruthy();
    expect(character.distinguishingFeature).toBeTruthy();
  });
});
