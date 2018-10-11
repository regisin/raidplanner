const Discord = require("discord.js");
exports.stats = function (client, message) {
    const servers = client.guilds.array().length;
    const channels = client.channels.array().length;
    const ping = client.ping;
    const lastReady = client.readyTimestamp;
    const uptime = client.uptime;
    const embed = new Discord.RichEmbed()
        .setColor("#00FFFF")
        .setDescription("My Discord stats:")
        .addField("Total servers: **" + servers + "**\n" +
            "Total channels: **" + channels + "**\n" +
            "Uptime (minutes): **" + (uptime * .001) / 60 + "**\n" +
            "Avg. heartbeat **" + ping + "**\n" +
            "Last ready state timestamp: **" + lastReady + "**",
            "*Done.*");
    message.reply(embed);
    return;
}