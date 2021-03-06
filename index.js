//require packages
const { LoggerFactory } = require('logger.js');
const logger = LoggerFactory.getLogger('main', 'purple');
logger.info('Initializing');
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
fs.readdir('./cmds', async (err,files) => {
    if (err) logger.info(err);

    const cmdFiles = files.filter(f => f.split(".").pop() === "js");

    if (cmdFiles.length === 0) return logger.warn("No files found");

    cmdFiles.forEach(async (f,i) => {
        const props = require(`./cmds/${f}`);
        logger.info(`#${i+1}: ${f} をロードしました`);
        bot.commands.set(props.help.name, props);
    });
});

const validation = (serverRoles, userRoles) => {
    let val = false;
    serverRoles.forEach((role) => {
        userRoles.forEach((usr) => {
            if (role == usr) val = true;
        });
    });
    return val;
};

bot.on('ready', async () => {
    bot.user.setActivity(`ScrimBot created by MIG.Karasu | Bot Support on Twitter -> @KaraaasuGg2 | Working in ${bot.guilds.size} servers`);
    logger.info("準備が整いました。");
});


bot.on("message", async msg => {
    if (msg.channel.type === "dm") return;
    if (msg.author.bot) return;

    const msg_array = msg.content.split(/ |　/); // eslint-disable-line
    const command = msg_array[0];
    const args = msg_array.slice(1);

    if (!command.startsWith(prefix)) return;

    if (bot.commands.get(command.slice(prefix.length))){
        const allowedRoles = require('./roles.json');
        if (validation(allowedRoles.roles, msg.member.roles.array()) || msg.member.id === owner){
            const cmd = bot.commands.get(command.slice(prefix.length));
            if (cmd) cmd.run(bot, msg, args);
            logger.info(`コマンドを検知：${command} - 実行ユーザー：${msg.author.username}`);
        } else {
            logger.info(`許可されていないユーザーからのコマンドを検知しました: ${msg.author.tag} (${msg.author.id})`);
            msg.channel.send("あなたにはScrimBotを操作する権限がありません。");
        }
    }

});


// Bot login
logger.info("ログイン中...");
bot.login(token);