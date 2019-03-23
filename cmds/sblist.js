

module.exports.run = async (bot,message) => {
    message.channel.send(`!sbs<数値>に登録済みのサーバー（例： !sbs0）
\`\`\`
 1 - LC Scrim
 2 - NEXUSスクリム
 3 - MIG Scrim
 4 - Unitedfury scrim
 5 - BP SCRIM(PS4、switch)
 6 - New Wind SCRIM
 7 - Relight Scrim
 8 - Version Scrim
 9 - Undecided
 10 - Undecided
\`\`\``);
};

module.exports.help = {
    name: "sblist",
};
