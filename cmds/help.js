

module.exports.run = async (bot,message) => {
    message.channel.send(`使用可能なコマンド
\`\`\`
!sbhelp - 現在使用可能なコマンドを確認できます(運営用)

!add-roles @<役職> - Botを操作できる役職を増やせます。今の段階では付与のみで消すことはできないので注意してください。\nまた、このコマンドを使用する際は必ず権限を追加したい役職の設定「この役職に対して @メンションを許可する」をオンにしておいてください。

!sbs に関するコマンドヘルプは !sblist で確認できます。
\`\`\``);
};

module.exports.help = {
    name: "sbhelp",
};

