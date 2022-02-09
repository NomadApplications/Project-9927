//require('dotenv').config();

const server = require('./server/app');
const bot = require('./discord/discord');

//bot.startBot().catch(err => console.error(err));
server.startServer(process.env.PORT).catch(err => console.error(err));
