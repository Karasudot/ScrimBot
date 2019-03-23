const Discord = require('discord.js');
const Listing = require('../modules/Listing');
const Entryid = require('../modules/Entry');

module.exports.run = async (bot, message, args,) => {

    let snipeChannel = message.channel;
    const filter = m => !m.author.bot;
    let game = new Listing();

    let editLast2 = null;

    //let startMessage = new Discord.RichEmbed()
        //.setTitle("Fortnite scrim Bot")
        //.setDescription("試合開始後、左上に出るマッチコードの下３桁を書いてください")
        //.setColor("#019dff")
        //.setFooter("FsB");

    //message.channel.send({embed: startMessage});

    console.log(`コマンドを検知：!sbsz - 実行ユーザー：${message.author.username}`)

    //message.delete(100); //sbsを消すやつ

    let last31 = new Discord.RichEmbed()
        .setTitle("プレイヤー一覧 - 合計 0 人")
        .setColor("1af216");

    setTimeout(async () => {
        editLast31 = await message.channel.send({embed: last31});  
    }, 10);

    const collector = snipeChannel.createMessageCollector(filter, {max: 200, maxMatches: 200, time: 180000});

    collector.on('collect', m => {
        console.log(`Collected ${m.content} | ${m.author.username}`);
        if (game.data.length === 0 && m.content.length === 3){
            game.addID(m.content.toUpperCase(), m.author.username);
        }else if (m.content.length === 3){
            if (game.userPresent(m.author.username)){
                game.deleteUserEntry(m.author.username);
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                }else {
                    game.addID(m.content.toUpperCase(),m.author.username);
                }
            } else {
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                }else {
                    game.addID(m.content.toUpperCase(), m.author.username);
                }
            }
        }

        game.sort();

        // 下三桁を認識するまでのところ
        let str = "";
        let codeUser = message.author;
        
        
        last31 = new Discord.RichEmbed()
            .setTitle(`プレイヤー一覧 - 合計 ${game.users.length} 人`)
            .setColor("#1af216");

         for (var i = 0; i < game.data.length; i++){ 
             str = "";
             for (var j = 0; j < game.data[i].users.length ; j++){
              str += `${message.author}` + "\n";
             }
            
             last31.addField(`ID: ${game.data[i].id.toLowerCase()} - ${game.data[i].users.length}人`, str, true);
            }

            editLast31.edit({embed: last31}).catch((err) => {
                console.log("Caught edit error");
            });

            if (m.deletable){
                m.delete().catch((err) => {
                    console.log("Cant delete");
                    console.log(err);
                });
            }
    });

    collector.on('end', collected => {
        let chatlocked = new Discord.RichEmbed()
            .setTitle("マッチコードの入力受け付けを締め切りました")
            .setDescription(`今回のマッチ参加者は ${game.users.length} 人です。\n\n頑張ってください！Good luck！`)
            .setColor("#ff0000");
        console.log(`[CHAT LOCKED]Collected ${collected.size} items`);

        

        message.channel.send({embed: chatlocked});


    });


}



module.exports.help = {
    name: "sbsz"
}