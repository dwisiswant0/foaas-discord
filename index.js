const config = require('./config');
const utils = require('./utils');
const { banner } = require('./consts');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { log } = require('./logger');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", c => {
  log.info(`Ready! Logged in as ${c.user.tag}`);

  client.user.setActivity('with your mom', { type: 'PLAYING' });
  utils.get("/operations", utils.build);
});

client.on("interactionCreate", interaction => utils.respond(interaction));

banner();
client.login(config.token);