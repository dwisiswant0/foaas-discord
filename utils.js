const config = require('./config');
const https = require('https');
const { host } = require('./consts');
const { log } = require('./logger');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const rest = new REST({ version: '9' }).setToken(config.token);

let endpoints = [];

module.exports.get = ((endpoint, callback) => {
  if (typeof callback == "undefined") throw new Error("callback needed");

  const options = {
    hostname: host,
    port: 443,
    path: endpoint,
    method: "GET",
    headers: { "Accept": "application/json" }
  };

  https.get(options, (res) => {
    let buff = "";
    res.on("data", (chunk) => {
      buff += chunk;
    }).on("end", () => {
      var body;
      try {
        body = JSON.parse(buff);
      } catch (e) {
        callback(e)
      };
      callback(null, body)
    })
  })
})

module.exports.build = ((err, res) => {
  if (err) return log.error(err.message);

  log.info("Building commands...");

  let cmds = [];
  for (const op of res) {
    if (op.name == "Version") continue;
    else endpoints.push(op.url);

    const name = op.url.split('/')[1];
    let cmd = new SlashCommandBuilder()
      .setName(name)
      .setDescription(op.name.length > 100 ? `${op.name.substring(0, 97)}...` : op.name)

    for (const f of op.fields) {
      if (f.name == "From" || f.field == "from") continue;
      switch (f.field) {
        case "company":
        case "name":
          cmd.addUserOption(opt => 
            opt.setName(f.field)
              .setDescription(f.name)
              .setRequired(true)
          );
          break;
        default:
          cmd.addStringOption(opt => 
            opt.setName(f.field)
              .setDescription(f.name)
              .setRequired(true)
          )
          break;
      }
    }
    cmds.push(cmd.toJSON());
  }
  this.create(cmds)
})

module.exports.create = (cmds) => {
  log.info("Deploy commands...");
  rest.put(Routes.applicationCommands(config.clientId), {body: cmds})
    .then(() => log.info('Successfully registered application commands.'))
    .catch(log.error)
}

module.exports.respond = (interaction) => {
  const cmd = interaction.commandName;
  const opt = interaction.options;

  let endpoint = this.endpoints.find(v => v.startsWith(`/${cmd}/`))

  if (!interaction.isCommand()) {
    log.warn(`${interaction.user.tag} ${cmd}:${JSON.stringify(opt)}`, "NOT COMMAND")
    return
  }

  if (typeof endpoint != "string") {
    log.error(`${interaction.user.tag} ${cmd}:${JSON.stringify(opt)}`, "CAN'T GET ENDPOINT")
    return
  }

  log.debug(`${interaction.user.tag} ${cmd}:${JSON.stringify(opt.data)}`, "INTERACTION")

  endpoint = endpoint.replace(":from", new Date().getTime().toString())
  for (const arg of opt.data) {
    endpoint = endpoint.replace(`:${arg.name}`, arg.type == "USER" ? `<@${arg.value}>` : arg.value)
  }

  this.get(endpoint, (err, res) => {
    if (err) return;
    interaction.reply(`${res.message} — <@${interaction.user.id}>`);
  })
}

module.exports.endpoints = endpoints;