const Discord = require("discord.js");
const client = new Discord.Client();

require("dotenv").config();

const { roller } = require("./src/roller");
const {
  HumanFeatures,
  StormcastFeatures,
  AelfFeatures,
  DuardinFeatures,
  SylvanethFeatures,
} = require("./src/character_features");

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
  client.user.setActivity("#help", { type: "LISTENING" });
});

client.on("message", (message) => {
  if (message.content === "#help") {
    message.channel.send(
      "**Age of Sigmar: Soulbound Discord Dicebot**\nDicebound only uses d6 dice, so no need to type d6 in your rolls.\n\nFocus is also an optional value. Focus is only shown to be used if it is necessary to get the required amount of successes.\n\nRoll syntax is as follows:\n\n `#roll [dice] [difficulty]:[complexity] f[focus]`\n\n**Random Race Characteristics Generation**\nType `#[name of race]` to get random characteristics for that race.\n Commands for each race are as follows-\n`#human`\n`#aelf`\n`#duardin`\n`#sylvaneth`\n`#sylvaneth-kurnoth`\n\nExample:\n`#human`\n```Age: 125\nEye Type: Warm\nEye Color: Ruby\nHeight: 6' 1\"\nAccent: Rough whisper```\n Might have misspellings or errors during testing."
    );
  }
});

client.on("message", (message) => {
  if (message.content === "#human") {
    const human = new HumanFeatures();
    message.channel.send(
      `\`\`\`Age: ${human.age}\nEye Type: ${human.eyeType}\nEye Color: ${human.eyeColor}\nHeight: ${human.height}\n${human.distinguishingFeature}\`\`\``
    );
  }
});

client.on("message", (message) => {
  if (message.content === "#stormcast") {
    const stormcast = new StormcastFeatures();
    message.channel.send(
      `\`\`\`Age: Unknowable\nEye Type: ${stormcast.eyeType}\nEye Color: ${stormcast.eyeColor}\nHeight: ${stormcast.height}\n${stormcast.distinguishingFeature}\`\`\``
    );
  }
});

client.on("message", (message) => {
  if (message.content === "#aelf") {
    const aelf = new AelfFeatures();
    message.channel.send(
      `\`\`\`Age: ${aelf.age}\nEye Type: ${aelf.eyeType}\nEye Color: ${aelf.eyeColor}\nHeight: ${aelf.height}\n${aelf.distinguishingFeature}\`\`\``
    );
  }
});

client.on("message", (message) => {
  if (message.content === "#duardin") {
    const duardin = new DuardinFeatures();
    message.channel.send(
      `\`\`\`Age: ${duardin.age}\nEye Type: ${duardin.eyeType}\nEye Color: ${duardin.eyeColor}\nHeight: ${duardin.height}\n${duardin.distinguishingFeature}\`\`\``
    );
  }
});

client.on("message", (message) => {
  if (message.content === "#sylvaneth-kurnoth") {
    const kurnoth = new SylvanethFeatures();
    message.channel.send(
      `\`\`\`Age: ${kurnoth.age}\nEye Type: ${kurnoth.eyeType}\nEye Color: ${kurnoth.eyeColor}\nHeight: ${kurnoth.heightKurnoth}\n${kurnoth.distinguishingFeature}\`\`\``
    );
  }
});

client.on("message", (message) => {
  if (message.content === "#sylvaneth") {
    const sylvaneth = new SylvanethFeatures();
    message.channel.send(
      `\`\`\`Age: ${sylvaneth.age}\nEye Type: ${sylvaneth.eyeType}\nEye Color: ${sylvaneth.eyeColor}\nHeight: ${sylvaneth.height}\n${sylvaneth.distinguishingFeature}\`\`\``
    );
  }
});

client.on("message", (message) => {
  const match = message.content.match(/#roll (\d+) ((\d+):(\d+))?( f(\d+))?/);
  if (!match) {
    return;
  }

  let [_, dice, targetNumber, neededSuccesses, hasFocus, focus] = match;
  dice = parseInt(dice, 10);
  targetNumber = parseInt(targetNumber, 10);
  neededSuccesses = parseInt(neededSuccesses, 10);
  focus = parseInt(focus, 10);

  const roll = roller(
    dice,
    targetNumber,
    neededSuccesses,
    hasFocus ? focus : 0
  );

  const rollsOutput = roll.rolls.map((result) => {
    return result.focused
      ? `${result.value - result.focused}➔${result.value}`
      : result.value;
  });

  const successResult =
    roll.totalSuccesses >= neededSuccesses ? "Success!" : "Failure.";
  const focusUsed = roll.rolls
    .map((usedFocus) => usedFocus.focused)
    .reduce((a, b) => a + b);

  message.channel.send(
    `\`\`\`md
# ${successResult}
[${rollsOutput}]: Successes: ${roll.totalSuccesses} | Focus Used: ${focusUsed}
\`\`\``
  );
});
