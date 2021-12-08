const {
  Client,
  Intents,
  MessageEmbed
} = require("discord.js");
const https = require('follow-redirects').https;
const fs = require("fs");
const config = require('./config.json')
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
  console.log("\x1b[33m", `Attempting to start...`);
  client.user.setStatus('dnd')
  client.user.setPresence({
    
  });
  console.log("\x1b[32m", `[READY]`);
  console.log("\x1b[34m", `Logged in as: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (message.content.startsWith(`${config.prefix}ping`)) {
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    const errorEmbed = new MessageEmbed()
          .setColor('#BF0000')
          .setTitle('Latency Check')
          .setAuthor('Exchange Rate', 'https://foxstudiolabs.s3.eu-west-2.amazonaws.com/discord-bots/exchange-rate/xe.png')
          .setDescription(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. \n\n API Latency is ${Math.round(client.ws.ping)}ms`)
          .setImage('http://source.unsplash.com/SwVkmowt7qA/720x360')
          .setTimestamp()
          .setFooter(`${message.author.username} - ${uuidv4()} \n Images provided by Unsplash`);
      message.channel.send({ embeds: [errorEmbed] });
      console.log("\x1b[36m", `[INFO] Ping command recieved from guild "${message.guild.name}"`)
      return
  } else

  if (message.content.startsWith(`${config.prefix}exchange`)) {
    let [amount, currency] = args;
    var uppercase = args.map(arg => arg.toUpperCase());
    if (!amount || !currency) {
      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      const errorEmbed = new MessageEmbed()
          .setColor('#BF0000')
          .setTitle('ERROR')
          .setAuthor('Exchange Rate', 'https://foxstudiolabs.s3.eu-west-2.amazonaws.com/discord-bots/exchange-rate/xe.png')
          .setDescription(`Missing required parameter. \n\n Usage is \`!exchange [amount] [currency]\``)
          .setThumbnail('http://source.unsplash.com/Sw2XNTgA-wc/720x360')
          .setTimestamp()
          .setFooter(`${message.author.username} - ${uuidv4()} \n Images provided by Unsplash`);
          console.log("\x1b[36m", `[INFO] Currency command recieved from guild "${message.guild.name}" - Status: FAILED`)
      message.channel.send({ embeds: [errorEmbed] });
      return
    }
    var options = {
      'method': 'GET',
      'hostname': 'api.exchangerate.host',
      'path': `/latest?base=EUR&amount=${uppercase[0]}&symbols=${uppercase[1]}&places=2`,
      'headers': {},
      'maxRedirects': 20
    };
    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        var obj = JSON.parse(body.toString());
        var arr = Object.values(obj.rates);
        function uuidv4() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }

        const currencyEmbed = new MessageEmbed()
          .setColor('#BF0000')
          .setTitle('Exchange Rate Result')
          .setAuthor('Exchange Rate', 'https://foxstudiolabs.s3.eu-west-2.amazonaws.com/discord-bots/exchange-rate/xe.png')
          .setDescription(`**${arr} ${uppercase[1]}** is the equivalent of **${amount} EUR**`)
          .setImage('http://source.unsplash.com/Sw2XNTgA-wc/720x360')
          .setTimestamp()
          .setFooter(`${message.author.username} - ${uuidv4()} \n Images provided by Unsplash`);
          console.log("\x1b[36m", `[INFO] Currency command recieved from guild "${message.guild.name}" - Status: SUCCESS`)
        message.channel.send({ embeds: [currencyEmbed] });
      });

      res.on("error", function (error) {
        const errorEmbed = new MessageEmbed()
          .setColor('#BF0000')
          .setTitle('ERROR')
          .setAuthor('Exchange Rate', 'https://foxstudiolabs.s3.eu-west-2.amazonaws.com/discord-bots/exchange-rate/xe.png')
          .setDescription(`An error occured while trying to retrieve exchange rate. \n\n ${error}`)
          .setImage('http://source.unsplash.com/Sw2XNTgA-wc/720x360')
          .setTimestamp()
          .setFooter(`${message.author.username} - ${uuidv4()} - Images provided by Unsplash`);
          console.log("\x1b[36m", `[INFO] Currency command recieved from guild "${message.guild.name}" - Status: FAILED`)
        message.channel.send({ embeds: [errorEmbed] });
        console.error("\x1b[31m", `FATAL ERROR OCCURED: ${error}`);
      });
    });

    req.end();
  }
});

client.login(config.token);