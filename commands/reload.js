const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {   
  let embed = new Discord.RichEmbed()
    .setColor(0xFF4500);
  
  let owners = process.env.OWNER.split(',');
  
  if (!owners.includes(message.author.id))  {
  return 
  }

  client.loadCommands();
  
  embed
    .setTitle("Loading Commands...");
  
  message.channel.send(embed);
};

exports.help = {
  name: "reload",
  category: "Debug",
  description: "Reload all commands.",
  usage: "reload"
};