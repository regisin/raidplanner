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

exports.announceRaid = function (raid) {
    const channel = raid.channel;
    const owner = raid.owner;
    const when = raid.time;
    const where = raid.venue;
    const timer = raid.timer;
    const quorum = raid.quorum;

    const embed = new Discord.MessageEmbed()
        .setColor("#FFA500")
        .setTitle("Raid created by: " + owner.username)
        .setDescription("RSVP by clicking: ✅\nIf you cannot make it anymore click: ❌\n__*if you do ❌ but decides to go, your name won't show up here!*__")
        .addField("Raid info",
                "__When__: " + when + "\n"+
                "__Where__: " + where + "\n"+
                "__Deadline__: " + timer.toString() + " minutes\n"+
                "__Quorum needed__: " + quorum.toString() + "\n")
        .addField("Confirmed players", "no one :(");

    return channel.send({embed}).then( raidMessage => {
        raidMessage.react("✅");
        raidMessage.react("❌");
        raid.message = raidMessage;
        return raid;
    }).catch( err => {
        console.log(err);
    });
}

exports.timerRaid = function (raid) {
    console.log('checkpoint 3.1');
    const message = raid.message;
    const owner = raid.owner;
    const when = raid.time;
    const where = raid.venue;
    const timer = raid.timer;
    const quorum = raid.quorum;

    var usersThatSaidYes = [];
    var usersThatSaidNo = [];

    const collector = message.createReactionCollector(
        (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❌",
        { time: raid.timer*10000 }
    ); // convert to miliseconds

    console.log('checkpoint 3.2');

    collector.on('collect', reaction => {
        console.log('checkpoint 3.2.1');
        if (reaction.emoji.name === "✅") {
            usersThatSaidYes = Array.from(reaction.users.values());
        }else if (reaction.emoji.name === "❌") {
            usersThatSaidNo = Array.from(reaction.users.values());
        }
        console.log('checkpoint 3.2.2');
        //update users in raid calling msg
        const confirmedUsers = usersThatSaidYes.filter(user => usersThatSaidNo.indexOf(user) < 0 );
        let text = "> ";
        confirmedUsers.forEach(user => text += " " + user.username);

        console.log('checkpoint 3.2.3', text);

        const embed = new Discord.MessageEmbed()
            .setColor("#FFA500")
            .setTitle("Raid created by: " + owner.username)
            .setDescription("RSVP by clicking: ✅\nIf you cannot make it anymore click: ❌\n__*if you do ❌ but decides to go, your name won't show up here!*__")
            .addField("Raid info",
                    "__When__: " + when + "\n"+
                    "__Where__: " + where + "\n"+
                    "__Deadline__: " + timer.toString() + " minutes\n"+
                    "__Quorum needed__: " + quorum.toString() + "\n")
            .addField("Confirmed players", text);
        console.log('checkpoint 3.2.4');
        message.edit({embed}).catch( err => {
                console.log('oops',err);
        });
    });

    console.log('checkpoint 3.3');

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
    
    console.log('checkpoint 3.4');
    
}