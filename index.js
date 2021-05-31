const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const { d6 } = require('./src/dice');
const { roller } = require('./src/roller');
const {
  HumanFeatures,
  StormcastFeatures,
  AelfFeatures,
  DuardinFeatures,
  SylvanethFeatures,
  commands,
} = require('./src/character_features');

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
  client.user.setActivity('#help', { type: 'LISTENING' });
});

client.on('message', message => {
  if (message.content === '#help') {
    message.channel.send(
      '**Age of Sigmar: Soulbound Discord Dicebot**\nDicebound only uses d6 dice, so no need to type d6 in your rolls.\n\nFocus is also an optional value. Focus is only shown to be used if it is necessary to get the required amount of successes.\n\nRoll syntax is as follows:\n\n `#roll [dice] [difficulty]:[complexity] f[focus]`\n\n**Random Race Characteristics Generation**\nType `#[name of race]` to get random characteristics for that race.\n Commands for each race are as follows-\n`#human`\n`#aelf`\n`#duardin`\n`#sylvaneth`\n`#sylvaneth-kurnoth`\n\nExample:\n`#human`\n```Age: 125\nEye Type: Warm\nEye Color: Ruby\nHeight: 6\' 1"\nAccent: Rough whisper```\n Might have misspellings or errors during testing.',
    );
  }
});

client.on('message', message => {
  const characterCreator = commands[message.content];
  if (!characterCreator) {
    return;
  }
  const character = characterCreator();

  message.reply(
    `\`\`\`Age: ${character.age}\nEye Type: ${character.eyeType}\nEye Color: ${character.eyeColor}\nHeight: ${character.height}\n${character.distinguishingFeature}\`\`\``,
  );
});

client.on('message', message => {
  const match = message.content.match(/#roll (\d+) (\d+):(\d+)( f(\d+))?/);
  if (!match) {
    return;
  }

  let [, dice, targetNumber, neededSuccesses, hasFocus, focus] = match;
  dice = parseInt(dice, 10);
  targetNumber = parseInt(targetNumber, 10);
  neededSuccesses = parseInt(neededSuccesses, 10);
  focus = parseInt(focus, 10);

  const roll = roller(
    dice,
    targetNumber,
    neededSuccesses,
    hasFocus ? focus : 0,
  );

  const rollsOutput = roll.rolls.map(result => {
    return result.focused
      ? `${result.value - result.focused}➔${result.value}`
      : result.value;
  });

  const successResult =
    roll.totalSuccesses >= neededSuccesses ? 'Success!' : 'Failure.';
  const focusUsed = roll.rolls
    .map(usedFocus => usedFocus.focused)
    .reduce((a, b) => a + b);

  message.reply(
    `\`\`\`md
# ${successResult}
[${rollsOutput}]: Successes: ${roll.totalSuccesses} | Focus Used: ${focusUsed}
\`\`\``,
  );
});
