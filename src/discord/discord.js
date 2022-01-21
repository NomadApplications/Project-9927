global.Discord = require('discord.js');
const intents = require('nm-discord-intents').intents;

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

/**
 * Start the Discord bot
 * @returns {Promise} Client object
 */
function startBot() {
    const client = new Discord.Client({intents, allowedMentions: {parse: ['roles'], repliedUser: false}});

    client.on("ready", async () => {
        console.log(`Now logged in as ${client.user.tag}!`);
        client.user.setActivity("ideas!", {
            type: "WATCHING"
        });
    });

    client.login(process.env.TOKEN).catch(err => console.error(err));

    return new Promise((resolve, reject) => {
        resolve(client);
    })
}

module.exports = {
    startBot
}