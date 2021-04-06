const Discord = require('discord.js');
const config = require('./config/config');
const client = new Discord.Client();

const { roller } = require("./src/roller");

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.DISCORD_BOT.TOKEN);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
})

const prefix = config.DISCORD_BOT.PREFIX;

client.on('message', (message) => {
    const match = message.content.match(/!roll (\d+) (\d+):(\d+)( f(\d+))?/);
    if(!match) { return; }
    let [_, dice, targetNumber, neededSuccesses, hasFocus, focus] = match;
    dice = parseInt(dice, 10);
    targetNumber = parseInt(targetNumber, 10);
    neededSuccesses = parseInt(neededSuccesses, 10);
    focus = parseInt(focus, 10);

    const roll = roller(dice, targetNumber, neededSuccesses, !!hasFocus ? focus: 0);

    const rollsOutput = roll.rolls.map(result => {
       return result.focused ? '**' + result.value + '**': result.value;
    });
    message.channel.send(`${rollsOutput} with ${roll.totalSuccesses} successes using ${roll.rolls.map(usedFocus => usedFocus.focused).reduce((a, b) => a + b)} focus`);
});