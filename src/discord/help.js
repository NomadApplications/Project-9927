/**
 * Init the help command
 * @param {Discord.Client} client
 */
module.exports = function (client) {
    client.commands.push({
        name: "help",
        description: "Get some help with Project 9927",
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'help') {
            const helpEmbed = new Discord.MessageEmbed()
                .setTitle("Project 9927 Help 🔎")
                .setDescription("Get some help with Project 9927. Select which emoji you need help with.\n" +
                    "💭  -   AI Idea Generator\n" +
                    "📃  -   Projects\n" +
                    "👥  -   Teams\n" +
                    "💰  -   Pricing\n" +
                    "👮  -   Direct help (DMs Moderators)").setColor(color);
            interaction.member.send({embeds: [helpEmbed]}).then(message => {
                const options = ["💭", "📃", "👥", "💰", "👮"];
                options.forEach(o => message.react(o));

                const filter = (reaction, user) => {
                    return user.id === interaction.member.id && options.includes(reaction.emoji.name);
                }

                message.awaitReactions({filter, max: 1, time: 60000, errors: ['time']})
                    .then(collected => {
                        if (collected.first().emoji.name === "💭") {
                            const idea = new Discord.MessageEmbed().setTitle("AI Idea Generator 💭")
                                .setDescription("If you are ever stuck on finding an idea, look no further. " +
                                    "Go to the Project 9927 website and locate the idea generator. From there, " +
                                    "put in your hobbies or topics that you would like to cover. The computer will analyze " +
                                    "these topics and output and idea that is currently trending on media. Then, you can create a project " +
                                    "associated with this idea and assign it to your team!").setColor(color)
                            interaction.member.send({embeds: [idea]});
                        } else if (collected.first().emoji.name === "📃") {
                            const projects = new Discord.MessageEmbed().setTitle("Projects 📃")
                                .setDescription("Projects are one of the main features of Project 9927. They are meant " +
                                    "to manage your ideas and keep track of you progress so you don't lose motivation. " +
                                    "You can manage your calendar and your to do list straight from the project panel. " +
                                    "You can do a collaborative project can by sharing them with your teams.").setColor(color)
                            interaction.member.send({embeds: [projects]});
                        } else if (collected.first().emoji.name === "👥"){
                            const teams = new Discord.MessageEmbed().setTitle("Teams 👥")
                                .setDescription("Teams are used to tie groups of people together and set roles in the projects. " +
                                    "If you want to create a project go to https://project-9927.herokuapp.com/profile and create a new " +
                                    "team! From there you can share the 6 letter code to your friends so they can join!").setColor(color);
                            interaction.member.send({embeds: [teams]});
                        } else if (collected.first().emoji.name === "💰") {
                            const pricing = new Discord.MessageEmbed().setTitle("Pricing 💰")
                                .setDescription("There are different plans that you can use with Project 9927. There is the free plan " +
                                    "which consists of 3 projects and 2 teams, the business plan which consists of 10 projects and 10 teams, " +
                                    "and then the premium plan which allows unlimited projects and teams.").setColor(color);
                            interaction.member.send({embeds: [pricing]});
                        } else if (collected.first().emoji.name === "👮"){
                            const questionPrompt = new Discord.MessageEmbed().setTitle("Direct help (DMs Moderators) 👮")
                                .setDescription("Please answer the following prompts to send a message to the moderators. " +
                                    "They will answer via DMs shorty after you submit.").setColor(color);
                            interaction.member.send({embeds: [questionPrompt]});

                            const questionType = new Discord.MessageEmbed().setTitle("What type of question do you have? 🤔")
                                .setDescription("Please react with which type of report you would like to file.\n" +
                                    "🪲  -   Bug report\n" +
                                    "🙋‍♂️   -   Question not listed on other options").setColor(color);
                            interaction.member.send({embeds: [questionType]}).then(type => {
                                const issue = {};
                                const types = ["🪲", "🙋‍♂️"];
                                types.forEach(o => type.react(o));

                                const filter = (reaction, user) => {
                                    return user.id === interaction.member.id && types.includes(reaction.emoji.name);
                                }

                                type.awaitReactions({filter, max: 1, time: 60000, errors: ['time']}).then(collected => {
                                    issue.chosenType = collected.first().emoji.name;

                                    let prompt;
                                    if(issue.chosenType === "🪲") prompt = "bug report";
                                    else if (issue.chosenType === "🙋‍♂️") prompt = "question";
                                    else prompt = "issue";

                                    const messagePrompt = new Discord.MessageEmbed()
                                        .setDescription("Enter your " + prompt + " below:").setColor(color);

                                    interaction.member.send({embeds: [messagePrompt]}).then(messagePromptMessage => {
                                        const collector = messagePromptMessage.channel.createMessageCollector({ time: 60000 });

                                        collector.on('collect', m => {
                                            issue.message = m.content;
                                            issue.owner = interaction.user.id;

                                            sendModeratorsIssue(issue);

                                            const finished = new Discord.MessageEmbed().setColor(color)
                                                .setDescription("You issue has been sent to the moderators! They will look at it ASAP " +
                                                    "and respond when they have time! Thank you for being patient!")
                                                .addField("Type", issue.chosenType)
                                                .addField("Issue", m.content);

                                            interaction.member.send({embeds: [finished]});
                                            collector.stop();
                                        });
                                    });
                                });
                            })
                        }
                    }).catch(() => {});
            });
            interaction.reply({
                embeds: [new Discord.MessageEmbed().setDescription("Check DMs and follow instructions").setColor(color)],
                ephemeral: true
            });
        }
    });

    function sendModeratorsIssue(issue){
        const moderators = client.guilds.cache.get("933789198316625951").channels.cache.get("946492105512063017");
        const member = client.guilds.cache.get("933789198316625951").members.cache.get(issue.owner);

        const issueEmbed = new Discord.MessageEmbed().setTitle("Issue from " + member.user.username)
            .setDescription("User sent issue from the help command.")
            .addField("Member", member.user.toString())
            .addField("Issue type", issue.chosenType)
            .addField("Issue message", issue.message)
            .setThumbnail(member.user.avatarURL())
            .setTimestamp()
            .setColor(color);

        moderators.send({embeds:[issueEmbed]});
    }
}