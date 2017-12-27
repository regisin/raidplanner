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
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        switch(cmd) {
            // !help
            case 'help':
                router.help(message);
                break;
            // !raid [venue] [time] [timer] [quorum]
            case 'raid':
                console.log('checkpoint 1');
                var raid = router.createRaid(message, args);
                console.log('checkpoint 2');
                router.announceRaid(raid).then(raidWithMessage => {
                    console.log('checkpoint 3');
                    router.timerRaid(raidWithMessage);
                });
                break;
            default:
                message.reply('command not found! Try _!help_');
                break;
        }
    }
});

client.login(config.token);