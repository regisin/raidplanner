const Jimp = require("jimp");
const Discord = require("discord.js");

const badges = [
    ["basic", 500, [220, 220, 220], 0],
    ["bronze", 3500, [230, 201, 175], 500],
    ["silver", 26E3, [189, 212, 221], 4E3],
    ["gold", 0, [250, 212, 105], 3E4]
];
const filledBarColorIphone = [110, 225, 217];
const filledBarColorAndroid = [21, 232, 219];
const emptyBarColor = [232, 232, 232];

exports.appraise = function (message, image) {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const middle = Math.round(width * .5);

    // Find current badge color and its position in the figure
    var badgeIndex = -1;
    var badgeYPos = -1;

    // var time = Math.floor(Date.now());
    [badgeIndex, badgeYPos] = getBadgeColorAndPosition(image, height, middle);
    // console.log('func:getBadgeColorAndPosition()', Math.floor(Date.now()) - time);

    if (-1 == badgeIndex) {
        message.reply('Couldn\'t identify badge color! Try a different image, or contact the admin to report the issue.')
            .catch( err => {
                console.log(err);
            });
        return -1;
    } else if (3 == badgeIndex) {
        message.reply('Duuude(tte), you already have golden badge on that gym!')
            .catch( err => {
                console.log(err);
            });
        return 1;
    } else {
        var centerBar;

        // time = Math.floor(Date.now());
        centerBar = findBarY(image, middle, height, badgeYPos);
        // console.log('func:findBarY()', Math.floor(Date.now()) - time);

        var totalFilled;
        var totalEmpty;

        // time = Math.floor(Date.now());
        [totalFilled, totalEmpty] = findBarX(image, width, centerBar);
        // console.log('func:findBarX()', Math.floor(Date.now()) - time);

        // time = Math.floor(Date.now());
        const remainingBXP = Math.round(computeBXPNeeded(badgeIndex, totalFilled, totalEmpty));
        // console.log('func:computeBXPNeeded()', Math.floor(Date.now()) - time);


        const raids = Math.ceil(remainingBXP / 1000.0);
        const place = Math.ceil(remainingBXP / 100.0);
        const defeat1500cp = Math.ceil(remainingBXP / 15.0);
        const berries = Math.ceil(remainingBXP / 10.0);
        const days = Math.floor(remainingBXP / 1440.0)
        const hours = Math.floor((remainingBXP-(1440*days) )/60.0);
        const minutes = remainingBXP-(60*hours)-(1440*days);
        const margin = Math.ceil(badges[badgeIndex][1] * (1.0/(totalFilled+totalEmpty)));
        const embed = new Discord.RichEmbed()
                    .setColor("#0000FF")
                    .setDescription("You need **" + remainingBXP + "** (± " + margin + ") BXP, you can:")
                    .addField("Win **" + raids + "** raid(s)\n"+
                              "Place **" + place + "** pokemon(s)\n"+
                              "Defeat **" + defeat1500cp + "** 1500 CP pokemon(s)\n"+
                              "Feed **" + berries + "** berry(ies)\n"+
                              "Defend for **" + days + "** day(s) **" + hours + "** hr(s) **" + minutes + "** min(s)",
                              "*Good luck!*");
        message.reply({embed})
            .catch( err => {
                console.log(err);
            });
    }
    return 0;
}

function  computeBXPNeeded(badgeIndex, filled, empty) {
    return (badges[badgeIndex][1] * (empty/(filled+empty)));
}

function findBarX(image, width, centerY) {
    var startX;
    var finishX;
    var totalFilled = 0;
    var totalEmpty = 0;

    // Use .scan() here because it's easier, we don't have to go from bottom up.
    image.scan(0, centerY-1, width, 1, (x, y, idx) => {
        const pixelImage = [image.bitmap.data[idx + 0], image.bitmap.data[idx + 1], image.bitmap.data[idx + 2]];
        const filled = closeEnoughRGB(pixelImage, filledBarColorIphone) || closeEnoughRGB(pixelImage, filledBarColorAndroid);
        const empty = closeEnoughRGB(pixelImage, emptyBarColor);
        filled ? (totalFilled++) : empty ? (totalEmpty++) : (1);
        if (filled || empty)
        {
            if (!startX)
            {
                startX = x;
            } else {
                finishX = x;
            }
        }
    });

    if (!startX) {
        return [-1, -1];
    }
    return [totalFilled, totalEmpty];
}

function findBarY(image, middle, height, badgeYPos) {
    const heightFraction = Math.floor(.1 * height);
    var startY;
    var finishY;

    loop:
    for (var tempY = badgeYPos-heightFraction; 0 <= tempY; tempY--)
    {
        const pixelImageIdx = image.getPixelIndex(middle, tempY);
        const pixelImage = [image.bitmap.data[pixelImageIdx + 0],
                            image.bitmap.data[pixelImageIdx + 1],
                            image.bitmap.data[pixelImageIdx + 2]];
        if (closeEnoughRGB(pixelImage, filledBarColorAndroid) || closeEnoughRGB(pixelImage, filledBarColorIphone) || closeEnoughRGB(pixelImage, emptyBarColor))
        {
            if (!startY)
            {
                startY = tempY;
            } else  {
                finishY = tempY;
            }
        }else{
            // No need to keep scanning, we already found the start/finish of the bar
            if (startY && finishY)
            {
                break loop;
            }
        }
    }
    if (!startY || !finishY)
    {
        return -1;
    } 
    var core = Math.round((finishY - startY)*.5);
    return (startY+core);
}

function getBadgeColorAndPosition(image, height, middle) {
    var counter = 0;
    var badgeFoundIndex = -1;
    var badgeYPos = -1;

    for (var tempY = height-50; 0 <= tempY; tempY--)
    {
        const pixelImageIdx = image.getPixelIndex(middle, tempY);
        const pixelImage = [image.bitmap.data[pixelImageIdx + 0],
                            image.bitmap.data[pixelImageIdx + 1],
                            image.bitmap.data[pixelImageIdx + 2]];
        for (var badgeTempIndex = 3; badgeTempIndex >= 0; badgeTempIndex--)
        {
            const pixelBadge = badges[badgeTempIndex][2];
            if (closeEnoughRGB(pixelBadge, pixelImage))
            {
                if (badgeFoundIndex != badgeTempIndex)
                {
                    badgeFoundIndex = badgeTempIndex;
                    counter = 0;
                }
                counter++;
                badgeYPos = tempY;
                if (counter >= 25)
                {
                    return [badgeFoundIndex, badgeYPos];
                }
            }
        }
    }
    return [-1, -1];
}

function closeEnoughRGB(pixelA, pixelB, fuzzyMode) {
    var fuzzyValue = 6;
    if (fuzzyMode) {
        fuzzyValue *= 3;
    }
    return pixelA[0] >= pixelB[0] - fuzzyValue &&
           pixelA[0] <= pixelB[0] + fuzzyValue &&
           pixelA[1] >= pixelB[1] - fuzzyValue &&
           pixelA[1] <= pixelB[1] + fuzzyValue &&
           pixelA[2] >= pixelB[2] - fuzzyValue &&
           pixelA[2] <= pixelB[2] + fuzzyValue;
}