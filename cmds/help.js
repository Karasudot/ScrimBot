

module.exports.run = async (bot,message,args) => {

    message.channel.send("使用可能なコマンド\n```\n!sbhelp - 現在使用可能なコマンドを確認できます(運営用)\n\n!add-roles @<役職> - Botを操作できる役職を増やせます。今の段階では付与のみで消すことはできないので注意してください。\nまた、このコマンドを使用する際は必ず権限を追加したい役職の設定「この役職に対して @メンションを許可する」をオンにしておいてください。\n\n!sbs に関するコマンドヘルプは !sblist で確認できます。\n```");


    console.log(`コマンドを検知：!sbhelp - 実行ユーザー：${message.author.username}`)


}

module.exports.help = {
    name: "sbhelp"
}

