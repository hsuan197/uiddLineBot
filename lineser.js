const config= require('./config');

//https
const fs = require('fs');
const express = require('express');
const port = config.port;
const https = require('https');
const options = {
  ca : fs.readFileSync(config.ssl.ca),
  key: fs.readFileSync(config.ssl.key),
  cert:fs.readFileSync(config.ssl.cert)
}

//linebot
var linebot = require('linebot');
var bot = linebot({
  channelId: config.line.channelId,
  channelSecret: config.line.channelSecret,
  channelAccessToken: config.line.channelAccessToken
})

//mysql
const mysql = require('mysql')
const connection = mysql.createConnection(config.mysql)
connection.connect(err => {
  if (err) {
    console.log('fail to connect:', err)
    process.exit()
  }
})

//get message
const platform = require('./reply_platform.js')
bot.on('message', function (event) {
    if (event.message.type=="text"){
      reply = ""
      switch (event.message.text){
        case "q": 
          reply = platform.getYesNo("q", "q1", "q2");
          break;
        case "w":
          reply = platform.getYesNo("w", "w1", "w2");
          break;
        default:
          reply = "QwQ"
      }

      event.reply(reply);
    }
});

//listen
var app = express();
var linebotParser = bot.parser();
app.post('/', linebotParser);
var server = https.createServer(options, app).listen(port, function() {
	console.log(`port: ${port}`);
})
