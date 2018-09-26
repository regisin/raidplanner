const Discord = require("discord.js");
const Jimp = require('jimp');
const config = require("./config.json")
const prefix = config.prefix;

const router = require("./commands/index");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.author.bot) return;

    if (message.content.substring(0, 1) === prefix) {
        var cmd = message.content.slice(config.prefix.length).trim().split(/ /gi, 1)[0];
        var args = message.content.slice(cmd.length + config.prefix.length).trim().split(config.separator);

        switch (cmd) {
            // !help
            case 'h':
            case 'help':
                router.help(message, config);
                break;
            // !raid [venue] [time] [timer] [quorum]
            case 'r':
            case 'raid':
                var raid = router.createRaid(message, args);
                router.announceRaid(raid, config).then(raidWithMessage => {
                    router.timerRaid(raidWithMessage, config);
                });
                break;
            case 's':
            case 'statistic':
            case 'statistics':
            case 'stat':
            case 'stats':
                if (message.channel.type == "dm") {
                    if (message.author.id == process.env.OWNER_ID) {
                        const servers = client.guilds.array().length;
                        const channels = client.channels.array().length;
                        const ping = client.ping;
                        const lastReady = client.readyTimestamp;
                        const uptime = client.uptime;
                        const embed = new Discord.MessageEmbed()
                            .setColor("#00FFFF")
                            .setDescription("My Discord stats:")
                            .addField("Total servers: **" + servers + "**\n" +
                                "Total channels: **" + channels + "**\n" +
                                "Uptime (minutes): **" + (uptime * .001) / 60 + "**\n" +
                                "Avg. heartbeat **" + ping + "**\n" +
                                "Last ready state timestamp: **" + lastReady + "**",
                                "*Done.*");
                        message.reply(embed);

                    }
                }
                break;
            // !level [level]
            case 'level':
            case 'lvl':
                router.level(message, args, config.roles, config.level_updated);
                break;
            default:
                message.reply('command not found! Try _!help_');
                break;
        }
    }

    // Gym Badge Appraisal
    if (message.channel.type == "dm") {
        if (message.attachments.size == 1) {
            var attachment = message.attachments.first();
            Jimp.read(attachment.url)
                .then((image) => {
                    const result = router.appraise(message, image);
                    if (result === -1) {
                        var owner = client.users.get(process.env.OWNER_ID);
                        owner.send("User " + message.author.username + " from server " + message.guild + "tried to appraise badge and I wasn\'t able to");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }



});

client.login(process.env.BOT_TOKEN);