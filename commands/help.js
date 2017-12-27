const Discord = require("discord.js");
exports.help = function(message) {
    const embed = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setTitle("RaidPlanner BETA")
        .setDescription("List of supported commands")
        .addField("!raid [venue] [time] [timer] [minimum]", "*Organizes a raid*\n"+
            "**[venue]**: location for the raid *no spaces please!*\n"+
            "**[time]**: when you want tostart the raid (SHARP!)\n"+
            "**[timer]**: optional - how long (minutes) this raid request is open for (1-45); default 45\n"+
            "**[minimum]**: optional - number of players needed; default 5")
        .addField("!help", "*Displays this message*");

    message.channel.send({embed});
    return;
}