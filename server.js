require('./discord/discord.js');
require('./app/app.js');

// PROCESS ERRORS AND STOP BOT CRASHING

process.on("uncaughtException", (ex) => {
    console.log(ex)
});