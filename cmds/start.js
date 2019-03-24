const { LoggerFactory } = require('logger.js');
const logger = LoggerFactory.getLogger('cmds:start', 'cyan');
const Discord = require('discord.js');
const Listing = require('./../modules/Listing');

module.exports.run = async (bot, message) => {
    const filter = user => !user.author.bot;
    const game = new Listing();

    /* eslint-disable
    //let startMessage = new Discord.RichEmbed()
        //.setTitle("Fortnite scrim Bot")
        //.setDescription("試合開始後、左上に出るマッチコードの下３桁を書いてください")
        //.setColor("#019dff")
        //.setFooter("FsB");
    */

    //message.channel.send({embed: startMessage});

    const players = {};
    const msg_players = {};
    players[message.guild.id] = new Discord.RichEmbed()
        .setTitle(`プレイヤー一覧 - 合計 0 人`)
        .setColor("1af216");
    msg_players[message.guild.id] = await message.channel.send(players[message.guild.id]); // eslint-disable-line

    logger.info(`コマンドを検知：!sbs - 実行ユーザー：${message.author.username}`);

    const collector = {};
    collector[message.guild.id] = message.channel.createMessageCollector(filter, {max: 200, maxMatches: 200, time: 180000});
    collector[message.guild.id].on('collect', m => {
        logger.info(`Collected ${m.content} | ${m.author.username}`);
        if (game.data.length === 0 && m.content.length === 3){
            game.addID(m.content.toUpperCase(), m.author.username);
        } else if (m.content.length === 3){
            if (game.userPresent(m.author.username)){
                game.deleteUserEntry(m.author.username);
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                } else {
                    game.addID(m.content.toUpperCase(),m.author.username);
                }
            } else {
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                } else {
                    game.addID(m.content.toUpperCase(), m.author.username);
                }
            }
        }
        game.sort();
        // 下三桁を認識するまでのところ
        let str = "";
        players[message.guild.id] = new Discord.RichEmbed()
            .setTitle(`プレイヤー一覧 - 合計 ${game.users.length} 人`)
            .setColor("#1af216");
        logger.info(`コマンドを検知：!sbs - 実行ユーザー：${message.author.username}`);

        for (let i = 0; i < game.data.length; i++){
            str = "";
            for (let j = 0; j < game.data[i].users.length ; j++){
                str += game.data[i].users[j] + "\n";
            }
            players[message.guild.id].addField(`ID: ${game.data[i].id.toLowerCase()} - ${game.data[i].users.length}人`, str, true);
        }

        msg_players[message.guild.id].edit(players[message.guild.id]).catch(err => {
            logger.error(`Error while editing message: ${err}`);
        });

        if (m.deletable){
            m.delete().catch((err) => {
                logger.error(`Unable to delete message: ${err}`);
            });
        }
    });

    collector[message.guild.id].on('end', collected => {
        const chatlocked = new Discord.RichEmbed()
            .setTitle("マッチコードの入力受け付けを締め切りました")
            .setDescription(`今回のマッチ参加者は ${game.users.length} 人です。\n\n頑張ってください！Good luck！`)
            .setColor("#ff0000");
        logger.info(`[CHAT LOCKED] Collected ${collected.size} items`);
        message.channel.send(chatlocked);
    });
};



module.exports.help = {
    name: "sbs",
};