const dotenv = require('dotenv');

dotenv.config()

module.exports = {
	clientId: process.env.DISCORD_CLIENT_ID,
	token: process.env.DISCORD_TOKEN
}