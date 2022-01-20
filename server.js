require('./discord/discord.js');
require('./app/bin/www');

// PROCESS ERRORS AND STOP BOT CRASHING

process.on("uncaughtException", (ex) => {
    console.log(ex)
});