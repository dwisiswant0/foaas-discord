const config = require('./config');
const utils = require('./utils');
const { banner } = require('./consts');
const { Client, Intents } = require('discord.js');
const { log } = require('./logger');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", c => {
  log.info(`Ready! Logged in as ${c.user.tag}`);

  client.user.setActivity('with your mom', { type: 'PLAYING' });
  utils.get("/operations", utils.build);
});

client.on("interactionCreate", interaction => utils.respond(interaction));

banner();
client.login(config.token);