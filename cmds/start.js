const { LoggerFactory } = require('logger.js');
const logger = LoggerFactory.getLogger('cmds:start', 'cyan');
const Discord = require('discord.js');
const locked = new Set();

module.exports.run = async (bot, message) => {
    if (locked.has(message.guild.id)) return (await message.channel.send("すでに投票中です。")).delete(3000);
    locked.add(message.guild.id);

    const filter = user => !user.author.bot;
    const game = {
        userList: new Set(),
        data: [],
    };

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
    msg_players[message.guild.id] = await message.channel.send(players[message.guild.id]);

    logger.info(`コマンドを検知：!sbs - 実行ユーザー：${message.author.username}`);

    const collector = {};
    collector[message.guild.id] = message.channel.createMessageCollector(filter, {max: 200, maxMatches: 200, time: 180000});
    collector[message.guild.id].on('collect', m => {
        logger.debug(`Collected ${m.content} | ${m.author.username}`);
        const code = m.content.toUpperCase();
        if (game.data.length === 0 && code.length === 3){ // if id does not exists, true
            game.data.push({id: code, users: new Set([m.author.id])});
            game.userList.add(m.author.id);
        } else if (code.length === 3) {
            if (game.userList.has(m.author.id)) {
                game.userList.delete(m.author.id);
                let del = false;
                game.data.filter(d => d.users.has(m.author.id)).forEach(d => {
                    d.users.delete(m.author.id);
                    if (!Array.from(d.users).length) del = true;
                });
                if (del) delete game.data.filter(d => d.users.has(m.author.id))[0];
                game.data = game.data.filter(_=>_);
                game.userList.delete(m.author.id);
            }
            if (game.data.filter(data => data.id === code).length){ // check if id is already exists
                game.data.filter(d => d.id === code)[0].users.add(m.author.id); // add user to existing ID
            } else {
                game.data.push({id: code, users: new Set([m.author.id])}); // create new ID with user
            }
            game.userList.add(m.author.id);
        }
        game.data.map(data => ({users: Array.from(data.users).length})).sort((a, b) => a.users > b.users);
        // 下三桁を認識するまでのところ
        let str = "";
        players[message.guild.id] = new Discord.RichEmbed()
            .setTitle(`プレイヤー一覧 - 合計 ${Array.from(game.userList).length} 人`)
            .setColor("#1af216");
        logger.info(`コマンドを検知：!sbs - 実行ユーザー：${message.author.username}`);
        game.data.forEach(data => {
            str = "";
            for (let j = 0; j < Array.from(data.users).length ; j++){
                str += `<@${Array.from(data.users)[j]}>\n`;
            }
            if (str) players[message.guild.id].addField(`ID: ${data.id.toLowerCase()} - ${Array.from(data.users).length}人`, str, true);
        });

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
        locked.delete(message.guild.id);
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