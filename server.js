// Load Modules

require('./discord/discord.js');
require('./app/bin/www');

console.log("http://localhost/")

// PROCESS ERRORS AND STOP BOT CRASHING

process.on("uncaughtException", (ex) => {
    console.log(ex)
});