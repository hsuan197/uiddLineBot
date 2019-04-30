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

//for get image
const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: config.line.channelAccessToken
});

//google drive
const {google} = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(config.Gdrive.client_id, config.Gdrive.client_secret, config.Gdrive.redirect_uri);
oAuth2Client.setCredentials(config.Gdrive.token);

function Upload(drive, folderId, path, filename){
	var fileMetadata = {
  	'name': filename,
  	parents: [folderId]
	};
	var media = {
  	mimeType: 'image/jpg',
  	body: fs.createReadStream(path + filename)
	};
	drive.files.create({
  	resource: fileMetadata,
  	media: media,
  	fields: 'id'
	}, function (err, file) {
  	if (err)
    	console.error(err);
	  else{
      fs.unlinkSync(path + filename);
    }
  });
}

function CreateFolder(auth, folder, userId){
  const drive = google.drive({version: 'v3', auth});
	var fileMetadata = {
  	'name': folder,
    parents:['1GGxFX7j3d3x9GEDY2ihlBAWEQHYVXf0l'],
  	mimeType: 'application/vnd.google-apps.folder'
	};
	drive.files.create({
  	resource: fileMetadata,
  	fields: 'id'
	}, function (err, file) {
  	if (err)
    	console.error(err);
  	else {
      var folderId = file.data.id;
      var path = './tmp/' + userId + '/'
      console.log(userId);
      fs.readdirSync(path).forEach(file => {
        console.log(file);
			  Upload(drive, folderId, path, file);
      });
  	}
	});
}

//mysql
const mysql = require('mysql')
const connection = mysql.createConnection(config.mysql)
connection.connect(err => {
  if (err) {
    console.log('fail to connect:', err)
    process.exit()
  }
})

//write database & upload images & delete local images
function WriteDB(the_record){
  console.log('write')
  connection.query('select count(id) from  record', function (error, results, fields) {
    if (error) throw error
    var num = results[0]['count(id)'];
    connection.query(`INSERT INTO record(lineId, id) VALUES ("${the_record.id}", ${num});`);
    connection.query(`INSERT INTO location(id, lat, lng, statu, address) VALUES (${num}, ${the_record.lat}, ${the_record.lon}, '1', '${the_record.address}');`);
    connection.query(`INSERT INTO house(id, total_floor, now_floor, shape, door, stair) VALUES (${num},  '${the_record.data[0]}', '${the_record.data[1]}', '${the_record.data[2]}', '${the_record.data[3]}', '${the_record.data[4]}');`);
    CreateFolder(oAuth2Client, num.toString(), the_record.id);
  })
}

//temporary record
var tmp_records = {}
const total_qNum = 10
function Record(userId){
  this.id = userId;
  this.qNum = 0;
  this.qStatu = -1;
  this.data = [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0];
  this.address = "";
  this.lon = 0;
  this.lat = 0;
}


//get message
const platform = require('./reply_platform.js')
bot.on('message', function (event) {

  //if user is recording
  var user = event.source.userId;
  if (!(user in tmp_records)){
    tmp_records[user] = new Record(user);

    //prepare dir
    var dir = './tmp/' + user;
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir);
  }

  //the record for this user
  the_record = tmp_records[user];

  //reply
  if (event.message.type=="text"){
    var mesg = event.message.text;
    var reply = "";
    if(the_record.qNum < total_qNum - 1){
      switch(the_record.qStatu){
        case -1:
          reply = "請傳送位置";
          break;
        case 2:
          if(mesg == "確定"){
            if(++the_record.qNum == total_qNum - 1){
              reply = platform.qs[the_record.qNum];
              break;
            }
          }
        case 1:
          the_record.data[the_record.qNum] = parseInt(mesg);
          if(platform.constrains[the_record.qNum](the_record.data[the_record.qNum])){
            reply = "確認為" + the_record.data[the_record.qNum].toString();
            reply = platform.getYesNo(reply, "確定" , "重新輸入");
            the_record.qStatu = 2;
            break;
          }
        case 0:
          reply = platform.qs[the_record.qNum];
          the_record.qStatu = 1;
          break;
      }
      console.log(the_record.data);
    }
    else if (the_record.qNum == total_qNum - 1){
      if (the_record.qStatu < 3)
        reply = "再拍喔><";
      else{
        switch(mesg){
          case "繼續記錄":
            the_record.qNum = 5;
            reply = platform.qs[the_record.qNum];
            the_record.qStatu = 1;
            break;
          case"結束":
            console.log('???');
            reply = "謝謝><";
            console.log('ending');
            WriteDB(the_record);
            delete tmp_records[user];
            break;
          default:
            reply = platform.getYesNo("紀錄其他裂化現象?", "繼續記錄" , "結束")
        }
      }
    }
    event.reply(reply);
  }

  else if (event.message.type == "image"){
    if(the_record.qNum != total_qNum - 1)
      return;

    //prepare dir
    var dir = './tmp/' + user;
    var file_path = dir + '/';
    for(let i = 5; i < total_qNum - 1; i++)
      file_path += the_record.data[i].toString() +  '_';
    file_path += ((++the_record.data[total_qNum - 1])>>1).toString() + '_'; 
    if(the_record.qStatu == 2){
      file_path += '0.jpg';
      reply = '請再拍一張近照';
      the_record.qStatu = 1;
    } else{
      file_path += '1.jpg';
      reply = platform.getYesNo("紀錄其他裂化現象?", "繼續記錄" , "結束")
      the_record.qStatu = 3;
    }
    event.reply(reply);

    //get image and save
		client.getMessageContent(event.message.id).then((stream) => {
    	f = fs.createWriteStream(file_path);
    	stream.on('data', (chunk) => {
      	f.write(chunk);
    	});
    	stream.on('end',()=>{
      	f.end();
    	});
  	});
  }

  //get location
  else if (event.message.type == "location"){
    the_record.lat = event.message.latitude;
    the_record.lon = event.message.longitude;
    the_record.address = event.message.address;
    the_record.qStatu = 1;
    event.reply(platform.qs[the_record.qNum]);
  }
  console.log(the_record);
});

//follow event
bot.on('follow', (event)=>{
  event.reply(platform.getYesNo("是否開始檢測", "開始檢測", "取消"));
})

//listen
var app = express();
var linebotParser = bot.parser();
app.post('/', linebotParser);
var server = https.createServer(options, app).listen(port, function() {
	console.log(`port: ${port}`);
})
