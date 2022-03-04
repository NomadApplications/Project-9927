require("dotenv").config();

global.Discord = require('discord.js');
global.color = "#5f4def";
const intents = require('nm-discord-intents').intents;

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

/**
 * Start the Discord bot
 * @returns {Promise} Client object
 */
function startBot() {
    const client = new Discord.Client({intents, allowedMentions: {parse: ['roles'], repliedUser: false}});

    client.on("ready", async () => {
        console.log(`Now logged in as ${client.user.tag}!`);

        client.commands = [];
        require('./help')(client);

        try {
            await rest.put(
                Routes.applicationGuildCommands("933790959794282557", "933789198316625951"),
                { body: client.commands },
            );
        } catch (error) { console.error(error); }

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