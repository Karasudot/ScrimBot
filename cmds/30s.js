

module.exports.run = async (bot,message) => {
    message.channel.send("次の試合開始まで30秒です");
};

module.exports.help = {
    name: "30s",
};

