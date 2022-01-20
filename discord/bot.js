global.Discord = require('discord.js');
const intents = require('nm-discord-intents').intents;
global.client = new Discord.Client({intents, allowedMentions: {parse: ['roles'], repliedUser: false}});
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");

client.on("ready", async () => {
    console.log(`✔ Logged in as ${client.user.username}`);

    client.user.setActivity("ideas", {
        type: "WATCHING"
    });


});

client.login('OTMzNzkwOTU5Nzk0MjgyNTU3.YemqmQ.WJpHl5oD86eVgtVugI-HyreNT_U');