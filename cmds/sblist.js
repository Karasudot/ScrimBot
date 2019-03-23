

module.exports.run = async (bot,message,args) => {

    message.channel.send("!sbs<数値>に登録済みのサーバー（例： !sbs0）\n```\n 1 - LC Scrim\n 2 - NEXUSスクリム\n 3 - MIG Scrim\n 4 - Unitedfury scrim\n 5 - BP SCRIM(PS4、switch)\n 6 - New Wind SCRIM\n 7 - Relight Scrim\n 8 - Version Scrim\n 9 - Undecided\n10 - Undecided\n```");


    console.log(`コマンドを検知：!sblist - 実行ユーザー：${message.author.username}`)


}

module.exports.help = {
    name: "sblist"
}

