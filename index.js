//require packages
const Discord = require('discord.js');
const settings = require('./settings.json');
const fs = require('fs');

// initialise are bot
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

//import bot setting (data)
const prefix = settings.prefix;
const token = settings.token;
const owner = settings.owner;
const admin = settings.admin; // eslint-disable-line

//read commands files
fs.readdir('./cmds', (err,files) => {
    if (err) {
        console.log(err);
    }

    const cmdFiles = files.filter(f => f.split(".").pop() === "js");

    if (cmdFiles.length === 0){
        console.log("No files found");
        return;
    }

    cmdFiles.forEach((f,i) => {
        const props = require(`./cmds/${f}`);
        console.log(`${i+1}: ${f} をロードしました`);
        bot.commands.set(props.help.name, props);
    });
});

const raw = fs.readFileSync('./roles.json');
const allowedRoles = JSON.parse(raw);

const validation = function(serverRoles, userRoles) {
    let val = false;
    serverRoles.forEach((role) => {
        userRoles.forEach((usr) => {
            if (role == usr){
                val = true;
            }
        });
    });
    return val;
};

bot.on('ready', async () => {
    bot.user.setActivity(`ScrimBot created by MIG.Karasu | Bot Support on Twitter -> @KaraaasuGg2 Worked in ${bot.guilds.size} servers`);
    console.log("準備が整いました。");
});


bot.on("message", msg => {
    if (msg.channel.type === "dm") return;
    if (msg.author.bot) return;

    const msg_array = msg.content.split(" ");
    const command = msg_array[0];
    const args = msg_array.slice(1);

    if (!command.startsWith(prefix)) return;

    if (bot.commands.get(command.slice(prefix.length))){
        if (validation(allowedRoles.roles,msg.member.roles.array()) || msg.member.id === owner){
            const cmd = bot.commands.get(command.slice(prefix.length));
            if (cmd){
                cmd.run(bot,msg,args);
            }
        } else {
            console.log('許可されていないユーザーからのコマンドを検知しました');
            msg.channel.send("あなたにはScrimBotを操作する権限がありません。");
        }
    }

});


// Bot login
bot.login(token);