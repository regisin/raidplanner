const Discord = require("discord.js");
exports.help = function(message, config) {
    const embed = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        // .setTitle("RaidPlanner BETA")
        .setDescription("List of supported commands:")
        .addBlankField()
        .addField("!raid [or !r] venue" + config.separator + "pokemon" + config.separator + "time" + config.separator + "timer" + config.separator + "minimum", "*Organizes a raid*\n\n"+
            "__do **NOT** use (" + config.separator + ") in the fields, it\'s a special character__\n\n"+
            "**venue**: location for the raid\n"+
            "**pokemon**: location for the raid\n"+
            "**time**: when you want to start the raid (SHARP!)\n"+
            "**timer**: optional - how long (minutes) this raid request is open for (1-45); default 45\n"+
            "**minimum**: optional - number of players needed; default 5")
        .addBlankField()
        .addField("__**Upload gym screenshot via DM**__","*Estimates badge xp needed*")
        .addBlankField()
        .addField("!help or !h", "*Displays this message*");
    
    message.channel.send({embed}).catch( err => {
        console.log(err);
});
    return;
}