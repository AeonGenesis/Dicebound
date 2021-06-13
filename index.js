const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const { d6 } = require('./src/dice');
const { roller } = require('./src/roller');
const { commands } = require('./src/character_features');

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
      '**Age of Sigmar: Soulbound Discord Dicebot**\n**Roll syntax** (focus is optional)\n\n__Soulbound__\n```#roll [dice] [difficulty]:[complexity] f[focus]```\n__D6 Roll__\n```#roll [dice]```\n__Random Race Characteristics Generation__\n```#[name of race]\n\n==Commands==\n#human\n#aelf\n#duardin\n#sylvaneth\n#sylvaneth-kurnoth```\n',
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
    `\`\`\`
Age: ${character.age}\nEye Type: ${character.eyeType}\nEye Color: ${character.eyeColor}\nHeight: ${character.height}\n${character.distinguishingFeature}\`\`\``,
  );
});

client.on('message', message => {
  const match = message.content.match(/#d6 (\d+)/);
  if (!match) {
    return;
  }

  let [, dice] = match;
  dice = parseInt(dice, 10);

  const d6 = roller(dice);
  const d6Values = d6.rolls.map(dice => dice.value);
  const d6ValuesAdded = d6Values.reduce(
    (currentValue, nextValue) => currentValue + nextValue,
  );

  message.reply(`\`\`\`md
# D6 Roll
[${d6Values}]: Result: ${d6ValuesAdded}\`\`\``);
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
