const fs = require('fs');
const http = require('http');
const config = require('./config.json')
const db = require('./pokemons.json')
const imghash = require('imghash');
const Jimp = require('jimp');
const request = require('request').defaults({ encoding: null });

const Discord = require('discord.js');
const client = new Discord.Client();

const express = require('express');
const app = express();

if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.commands = new Discord.Collection();
client.cmdhelp = new Discord.Collection();


client.loadCommands = () => {
  fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split('.').pop() === 'js');

    console.log(`LOG Loading a total of ${jsFiles.length} commands.`);

    jsFiles.forEach((f, i) => {
      delete require.cache[require.resolve(`./commands/${ f }`)];
      let props = require(`./commands/${ f }`);
      console.log("LOG Loading command: " + f);
      client.commands.set(f, props);
      client.cmdhelp.set(props.help.name, props.help);
    });
  });
};

client.loadCommands();

client.on('ready', () => {
  console.log(`READY Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`, "Ready", "event");
});

client.on('error', error => {
  console.log(`ERROR ${error}`);
  client.log(error, "Error", "error");
});

client.on('guildCreate', guild => {
  console.log(`GUILD JOIN ${guild.name} (${guild.id})`);
  client.log(`${guild.name} (${guild.id})`, "Guild Join", "joinleave");
});


client.on('guildDelete', guild => {
  console.log(`GUILD LEAVE ${guild.name} (${guild.id})`);
  client.log(`${guild.name} (${guild.id})`, "Guild Leave", "joinleave");
});
client.on("message", async message => {  
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  //commands

if(command === "say") {
  let owners = process.env.OWNER.split(',');
  
  if (!owners.includes(message.author.id))  {
  return 
  }
  let announcement = args.slice(0).join(" ");
  message.delete().catch(O_o=>{}); 
  message.channel.send(announcement)
}
  if(command === "tell") {
  let owners = process.env.OWNER1.split(',');
  
  if (!owners.includes(message.author.id))  {
  return 
  }
  let announcement = args.slice(0).join(" ");
  message.delete().catch(O_o=>{}); 
  message.channel.send(announcement)
  
  }  
   if (command === "spam") {
     let owners = process.env.OWNER.split(',');
  
  if (!owners.includes(message.author.id))  {
  return 
  }
      var count = 1; // Number of messages sent (modified by sendSpamMessage)
      var maxMessages = 5000; // Change based on how many messages you want sent
      var timeToWait = null, minTime = 2000, maxTime = 4350;
      var content = null;
      var prune = false;

      // Get command line arguments
      var argLength = process.argv.length;
      for (let j = 2; j < argLength; j++) {
          // j is 2 initially to ignore `node bot.js`
          var argsLeft = j + 1 < argLength;
          var arg = process.argv[j];
          var nextArg = process.argv[j + 1];

          // All the flags require a second argument, so this only checks for flags if another arg exists
          if (argsLeft) {
            // TODO update docs and ensure proper typechecking and spit relevant error instead of running command
            if (arg == "--message") {
              content = nextArg;
            } else if (arg == "--maxMessages") {
              maxMessages = nextArg;
            } else if (arg == "--setTime") {
              timeToWait = nextArg;
            } else if (arg == "--maxTime") {
              // TODO ensure this isn't less than minTime
              maxTime = nextArg;
            } else if (arg == "--minTime") {
              // TODO ensure this isn't greater than maxTime
              minTime = nextArg;
            }
          }

          // Doesn't require a second arg
          if (arg == "--prune") {
            prune = true;
          }
      }

      function sendSpamMessage() {
        // You could modify this to send a random string from an array (ex. a quote), create a
        // random sentence by pulling words from a dictionary file, or to just send a random
        // arrangement of characters and integers. Doing something like this may help prevent
        // future moderation bots from detecting that you sent a spam message.
        if (content === null) {
          content = "🎉";
        }

        message.channel.send(content);

        if (count < maxMessages) {
          // If you don't care about whether the messages are deleted or not, like if you created a dedicated server
          // channel just for bot spamming, you can remove the below statement and the entire prune command.
          if (prune) {
            message.channel.send("/prune");
          }
          
          count++;

          /* These numbers are good for if you want the messages to be deleted.
           * I've also noticed that Discord pauses for about 4 seconds after you send 9
           * messages in rapid succession, and this prevents that. I rarely have any spam
           * messages slip through unless there is a level up from mee6 or Tatsumaki.
           * Mileage may vary based on internet speed. */
          if (timeToWait === null) {
            timeToWait = Math.floor(Math.random() * (maxTime - minTime)) + minTime;
          }

          setTimeout(sendSpamMessage, timeToWait);
        } else {
          // Sends a message when count is equal to maxMessages. Else statement can be
          // modified/removed without consequence.
          message.channel.send("------------------");
          message.channel.send("I AM FINISHED!!!");
          message.channel.send("------------------");
        }
      }

      message.delete().catch(O_o=>{})
      sendSpamMessage();
    }
});
client.on('message', message => {
  try {
    let embed = new Discord.RichEmbed()
      .setColor(0xFF4500);
    
    if (message.guild && !message.channel.memberPermissions(client.user).has('SEND_MESSAGES')) return;
    
    if (message.guild && !message.channel.memberPermissions(client.user).has('EMBED_LINKS')) {
      return message.channel.send("I need the `Embed Links` permission. Please contact an administrator on this server.");
    }

     if(message.guild.id == "756506911183994990"){ 
       if (message.author.id == '669228505128501258') {
      message.embeds.forEach((e) => {
        if (e.description !== undefined && e.description.startsWith("Guess the pokémon аnd type")) {
          if (e.image) {
            let url = e.image.url;
            
            request(url, async function(err, res, body) {
              if (err !== null) return;
            
              imghash
                .hash(body)
                .then(hash => {
                  let result = db[hash];
                  
                  if (result === undefined) {
                    embed
                      .setTitle("Pokemon Not Found")
                      .setDescription("Please contact the owner CHamburr#2591 to add this Pokemon to the database.");
                    return message.channel.send(`.catch IDK`);
                  }
                
                  new Jimp(1024, 256, "#303030", (err, img) => {
                    Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(font => {
                      Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font2 => {
                        img.print(font, 0, 50, {
                          text: result,
                          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
                        }, img.bitmap.width, img.bitmap.height);
                        img.print(font2, 0, img.bitmap.height - 100, {
                          text: "Want this bot in your server? Go to https://discord.gg/TYe3U4w or https://github.com/CHamburr/PokeAssistant for more information.",
                          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
                        }, img.bitmap.width, img.bitmap.height);
                        img.getBufferAsync("image/png")
                          .then(res => {
                          message.channel.startTyping();
                              message.channel.send(`.catch ${result}`);
                          message.channel.stopTyping();
                          });
                      });
                    });
                  });
                
                  console.log("[" + message.guild.name + "/#" + message.channel.name + "] " + result);
                })
            });
          }
        }
      });
    }}
                                                

    if (message.author.bot) return;

    let prefix = false;
    let args = message.content;
    let command = "";
    
    args = message.content.slice(prefix.length).trim().split(/ +/g);
    command = args.shift().toLowerCase();

    let cmd = client.commands.get(command + ".js");
    
    if (cmd) {
      cmd.run(client, message, args);
      console.log(`[${message.guild.name}/#${message.channel.name}] ${message.author.tag} (${message.author.id}): ${cmd.help.name}`);
    }
  } catch (error3) {
    console.log("ERROR at Message: " + error3);
    client.log(error3, "Error at Message", "error");
  }
});

client.clean = async (text) => {
  if (text && text.constructor.name == "Promise")
    text = await text;
  
  if (typeof evaled !== "string")
    text = require("util").inspect(text, {depth: 1});

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replace(process.env.TOKEN, "--NO--TOKEN--");

  return text;
};

client.log = async (content, title, type) => {
  let embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(content.toString().substr(0, 2048))
    .setColor(0xFF4500)
    .setTimestamp();
  
  if (type === "event") {
    client.channels.get(process.env.EVENTCHANNEL).send(embed);
  }
  else if (type === "error") {
    client.channels.get(process.env.ERRORCHANNEL).send(embed);
  }
  else if (type === "joinleave") {
    client.channels.get(process.env.JOINLEAVECHANNEL).send(embed);
  }
};

client.login(process.env.TOKEN);
