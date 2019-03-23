const fs = require('fs');


module.exports.run = async (bot, message, args) => {

    if (args.legnth === 0){
        message.channel.send("A roles is needed after the command ex: !add-role @sbstaff");
    }else if (args.length > 0){
        const roles_raw = fs.readFileSync('./roles.json');
        const roles_array = JSON.parse(roles_raw);
        const role = args[0];
        let found = false;

        for (let i = 0; i < roles_array.roles.length; i++){
            if (role === roles_array.roles[i]){
                found = true;
                message.channel.send(":x:　役職 " + role + " は追加済みです。");
                console.log('addrolesを検知しました(追加済み)：' + role);
                return;
            }
        }

        if (!found){
            roles_array.roles.push(role);
            const roles_write = JSON.stringify(roles_array);
            fs.writeFileSync('./roles.json', roles_write);
            delete require.cache[require.resolve('./roles.json')];
            message.channel.send(":thumbsup:　役職 " + role + " を追加しました。");
            console.log(`付与役職：${role}`);
        }
    }
};



module.exports.help = {
    name: "add-roles",
};
