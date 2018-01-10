const Discord = require("discord.js");
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
        var args = message.content.slice(cmd.length+config.prefix.length).trim().split(config.separator);

        switch(cmd) {
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
            default:
                message.reply('command not found! Try _!help_');
                break;
        }
    }
});

client.login(process.env.BOT_TOKEN);