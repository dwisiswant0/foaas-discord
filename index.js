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

client.on("interactionCreate", interaction => {
  const cmd = interaction.commandName;
  const opt = interaction.options;
  let endpoint = utils.endpoints.find(v => v.startsWith(`/${cmd}/`))

  if (!interaction.isCommand()) {
    log.warn(`${interaction.user.tag} ${cmd}:${JSON.stringify(opt)}`, "NOT COMMAND")
    return
  }

  if (typeof endpoint != "string") {
    log.error(`${interaction.user.tag} ${cmd}:${JSON.stringify(opt)}`, "CAN'T GET ENDPOINT")
    return
  }

  log.debug(`${interaction.user.tag} ${cmd}:${JSON.stringify(opt.data)}`, "INTERACTION")
  interaction.deferReply();

  endpoint = endpoint.replace(":from", new Date().getTime().toString())
  for (const arg of opt.data) {
    endpoint = endpoint.replace(`:${arg.name}`, arg.type == "USER" ? `<@${arg.value}>` : arg.value)
  }

  utils.get(endpoint, (err, res) => {
    if (err) return;
    interaction.editReply(`${res.message} — <@${interaction.user.id}>`);
  })
});

banner();
client.login(config.token);