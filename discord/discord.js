const Discord = require('discord.js');
const intents = require('nm-discord-intents').intents;
const client = new Discord.Client({intents, allowedMentions: {parse: ['roles'], repliedUser: false}});
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");

client.on("ready", async () => {
    console.log(`Discord Bot Logged In.`);

    client.user.setActivity("ideas", {
        type: "WATCHING"
    });


});

client.login('OTMzNzkwOTU5Nzk0MjgyNTU3.YemqmQ.WJpHl5oD86eVgtVugI-HyreNT_U');