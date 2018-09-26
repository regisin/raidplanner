const Discord = require("discord.js");
exports.help = function (message, config) {
    const embed = new Discord.RichEmbed()
        .setColor("#FFFFFF")
        // .setTitle("RaidPlanner BETA")
        .setDescription("List of supported commands:")
        .addBlankField()
        .addField("!help or !h", "*Displays this message*")
        .addBlankField()
        .addField("!raid [or !r] venue" + config.separator + "pokemon" + config.separator + "time" + config.separator + "timer" + config.separator + "minimum", "*Organizes a raid*\n\n" +
            "__do **NOT** use (" + config.separator + ") in the fields, it\'s a special character__\n\n" +
            "**venue**: location for the raid\n" +
            "**pokemon**: location for the raid\n" +
            "**time**: when you want to start the raid (SHARP!)\n" +
            "**timer**: optional - how long (minutes) this raid request is open for (1-45); default 45\n" +
            "**minimum**: optional - number of players needed; default 5")
        .addBlankField()
        .addField("!level [or !lvl] level", "*Set/update trainer level*\n\n" +
            "__I will react with " + config.level_updated + " if everything goes ok__\n\n" +
            "**level**: level of the trainer (1 to 40)")
        .addBlankField()
        .addField("__**Upload gym screenshot via DM**__", "*Estimates badge xp needed*");

    message.channel.send({ embed }).catch(err => {
        console.log(err);
    });
    return;
}