const Discord = require("discord.js");

exports.level = function (message, args, rolesList, emoji) {

    const level = args[0];
    const guild = message.guild;
    const role = guild.roles.find(r => r.name === level);
    const otherRolesNames = rolesList.filter(r => r !== level);

    if (role) {
        const member = message.member;
        // Add/update trainer/member level/role
        member.addRole(role)
            .then(m => {
                // console.log('added role to member');
            })
            .catch(err => {
                console.log(err);
            });

        // Remove other level roles from the member
        otherRolesNames.forEach(roleName => {
            const otherRole = guild.roles.find(r => r.name === roleName);
            if (otherRole) {
                member.removeRole(otherRole)
                    .then(m => {
                        // console.log('removed role from member');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });
        message.react(emoji).catch((err) => { console.log(err); });
    
    // Let's have some fun here
    } else if (parseInt(level) >= rolesList[0]) {
        message.reply('Smart-ass.. try again');
    } else if (isNaN(level)) {
        message.reply('Do you know what a number is?');
    } else {
        message.reply('Level ' + level + ' not found! Must be number from 1 to 40');
    }

}