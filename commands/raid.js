const Discord = require("discord.js");

exports.createRaid = function(message, args) {
    if (args.length > 4) {
        message.reply("too many arguments!");
        return false;
    }else if (args.length < 2) {
        message.reply("not enough arguments!");
        return false;
    }else{
        const where = args[0];
        const when = args[1];
        let timer = 45;
        let quorum = 6;
        if (args.length >= 3) {
            timer = parseInt(args[2]);
            if (args.length == 4) quorum = parseInt(args[3]);
        }
        var raid = {
            channel: message.channel,
            owner: message.author,
            venue: where,
            time: when,
            quorum: quorum,
            timer: timer
        };
        return raid;
    }
}

exports.announceRaid = function (raid, config) {
    const channel = raid.channel;
    const owner = raid.owner;
    const when = raid.time;
    const where = raid.venue;
    const timer = raid.timer;
    const quorum = raid.quorum;

    const embed = new Discord.MessageEmbed()
        .setColor("#FFA500")
        .setTitle("Raid created by: " + owner.username)
        .setDescription("RSVP by clicking: "+config.rsvp_emoji+"\nIf you cannot make it anymore click: "+config.rsvp_emoji_cancel+"\n__*if you do "+config.rsvp_emoji_cancel+" but decide to go, your name won't show up here!*__")
        .addField("Raid info",
                "__When__: " + when + "\n"+
                "__Where__: " + where + "\n"+
                "__Deadline__: " + timer.toString() + " minutes\n"+
                "__Quorum needed__: " + quorum.toString() + "\n")
        .addField("Confirmed players", "no one :(");

    return channel.send({embed}).then( raidMessage => {
        raidMessage.react(config.rsvp_emoji);
        raidMessage.react(config.rsvp_emoji_cancel);
        raid.message = raidMessage;
        return raid;
    }).catch( err => {
        console.log(err);
    });
}

exports.timerRaid = function (raid, config) {
    const message = raid.message;
    const owner = raid.owner;
    const when = raid.time;
    const where = raid.venue;
    const timer = raid.timer;
    const quorum = raid.quorum;

    var usersThatSaidYes = [];
    var usersThatSaidNo = [];

    const collector = message.createReactionCollector(
        (reaction, user) => reaction.emoji.name === config.rsvp_emoji || reaction.emoji.name === config.rsvp_emoji_cancel,
        { time: raid.timer*10000 }
    ); // convert to miliseconds

    collector.on('collect', reaction => {
        if (reaction.emoji.name === config.rsvp_emoji) {
            usersThatSaidYes = Array.from(reaction.users.values());
        }else if (reaction.emoji.name === config.rsvp_emoji_cancel) {
            usersThatSaidNo = Array.from(reaction.users.values());
        }
        //update users in raid calling msg
        const confirmedUsers = usersThatSaidYes.filter(user => usersThatSaidNo.indexOf(user) < 0 );
        let text = "> ";
        confirmedUsers.forEach(user => text += " " + user.username);

        const embed = new Discord.MessageEmbed()
            .setColor("#FFA500")
            .setTitle("Raid created by: " + owner.username)
            .setDescription("RSVP by clicking: "+config.rsvp_emoji+"\nIf you cannot make it anymore click: "+config.rsvp_emoji_cancel+"\n__*if you do "+config.rsvp_emoji_cancel+" but decide to go, your name won't show up here!*__")
            .addField("Raid info",
                    "__When__: " + when + "\n"+
                    "__Where__: " + where + "\n"+
                    "__Deadline__: " + timer.toString() + " minutes\n"+
                    "__Quorum needed__: " + quorum.toString() + "\n")
            .addField("Confirmed players", text);
        message.edit({embed}).catch( err => {
                console.log(err);
        });
    });

    collector.on('end', collectedItems => {
        const confirmedUsers = usersThatSaidYes.filter(user => usersThatSaidNo.indexOf(user) < 0 );
        if (confirmedUsers.length >= parseInt(raid.quorum)) {
            let text = "Raid is **ON**! Good luck! ";
            confirmedUsers.forEach(user => {
                // console.log('user:', user);
                text += user.toString() + " ";
            });
            message.channel.send(text);
        }else{
            let text = "Raid is **OFF**! Maybe next time :( ";
            confirmedUsers.forEach(user => {
                text += user.toString() + " ";
            });
            message.channel.send(text);
        }
    });
}