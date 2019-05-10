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
const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: confi/g.line.channelAccessToken
});

//google drive
const {google} = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(config.Gdrive.client_id, config.Gdrive.client_secret, config.Gdrive.redirect_uri);
oAuth2Client.setCredentials(config.Gdrive.token);
const async = require('async');
const tmpFolder = '1wRNkxOKTFkpuZTS_ZG9A-8hRpo1PyqTe';
const picFolder = '12XEk5qMiKvH_SJHUmCS4jYEm2p1_qOjU';

//mysql
const mysql = require('mysql')
const connection = mysql.createConnection(config.mysql)
connection.connect(err => {
  if (err) {
    console.log('fail to connect:', err)
    process.exit()
  }
})

//temporary record
var tmp_records = {}
const total_qNum = 6
function Record(userId){
  this.id = userId;
  this.qNum = 0;
  this.qStatu = -1;
  this.data = [-1, -1, -1, -1, -1, -1, 0];
  this.address = "";
  this.lon = 0;
  this.lat = 0;
}

//changeing
var tmp_change = {}
function Changing(userId, houseId, folderId){
  this.uId = userId;
  this.hId = houseId;
  this.picId = -1;
  this.fId = folderId;
}

const platform = require('./reply_platform.js')
bot.on('postback', function (event) {
  console.log(event);
  var mesg = event.postback.data;
  var user = event.source.userId;
  
  //志工
  var toDo = mesg.substr(0, 5);
  if(toDo == "test:"){
      id = Number(mesg.substr(5))
      var result = getData(event, id);
      return
  }
  else if (toDo == "info:"){
      event.reply("info");    
      return
  }
  else if(toDo == "pict:"){
      event.reply("請傳送圖片");
      pid = Number(mesg.substr(5))
      tmp_change[user].picId = pid;
      console.log(tmp_change[user]);
      return
  } 
  else if(toDo == "end_:"){
    event.reply(platform.finalQ) 
  }
  else if (toDo == "call:"){
    event.reply("感謝");
    Move(oAuth2Client, tmp_change[user]['hId'], tmpFolder, picFolder)
    delete tmp_change[user];
  }
  else if (toDo == "save:"){
    event.reply("感謝");
    await Move(oAuth2Client, tmp_change[user]['hId'], tmpFolder, picFolder)
    delete tmp_change[user];
  }
  else if (mesg == "查看圖片"){
      sendPicture(event);
      return
  }
  
  //民眾
  else if(mesg == "answ:"){
    reply = platform.qs[++the_record.qNum];
  }
})

//reply
bot.on('message', function (event) {

  //new user
  var user = event.source.userId;
  if (!(user in tmp_records) && !(user in tmp_change)){
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

    if(user in tmp_change){
      if(mesg.substr(0, 6)=='result'){
        var f = mesg.split("_");
        updateSql(f, event)
      } 
      return
    }

    if(mesg.substr(0, 5) == "test:"){
      id = Number(mesg.substr(5))
      console.log('111');
      var result = getData(event, id);
      return
    }

    if(the_record.qNum < total_qNum){
      switch(the_record.qStatu){
        case -1:
          reply = platform.askLocation;
          break;
        case 2:
          if(mesg == "確定"){
            if(++the_record.qNum == total_qNum){
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
    // 拍照模式
    else if (the_record.qNum == total_qNum){
      if (the_record.qStatu < 3)
        reply = "請按照上面指示> <";
      else{
        switch(mesg){
          case "繼續記錄":
            the_record.qNum = 2;
            reply = platform.qs[the_record.qNum];
            the_record.qStatu = 2;
            break;
          case"結束":
            reply = "謝謝><";
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
    if((user in tmp_change) && tmp_change[user].picId >= 0){
      console.log('get img');
     //prepare path
      var dir = './tmp/' + user;
      var file_path = dir + '/';
      file_path += 'tmp.png'

      //get image and save
		  client.getMessageContent(event.message.id).then((stream) => {
    	  f = fs.createWriteStream(file_path);
    	  stream.on('data', (chunk) => {
      	  f.write(chunk);
    	  });
    	  stream.on('end',()=>{
      	  f.end();
          Update(oAuth2Client, tmp_change[user], file_path, event)
    	  });
 	    });
    }

    if(the_record.qNum != total_qNum)
      return;

    //prepare path
    var dir = './tmp/' + user;
    var file_path = dir + '/';
    for(let i = 2; i <= total_qNum; i++)
      file_path += the_record.data[i].toString() +  '_';
    the_record.data[total_qNum] += 1;
    file_path += '.png'

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

    //reply & change statu
    if(the_record.qStatu == 2){
      reply = '請再拍一張近照';
      the_record.qStatu = 1;
    } else{
      reply = platform.getYesNo("紀錄其他裂化現象?", "繼續記錄" , "結束")
      the_record.qStatu = 3;
    }
    event.reply(reply);
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

//write database & upload images & delete local images
function WriteDB(the_record){
  connection.query('select count(id) from  record', function (error, results, fields) {
    if (error) throw error
    var num = results[0]['count(id)'];
    connection.query(`INSERT INTO record(lineId, id) VALUES ("${the_record.id}", ${num});`);
    connection.query(`INSERT INTO location(id, lat, lng, statu, address) VALUES (${num}, ${the_record.lat}, ${the_record.lon}, '1', '${the_record.address}');`);
    UploadFolder(oAuth2Client, num.toString(), num, the_record);
  })
}

function Update(auth, changing, path, event){
  const drive = google.drive({version: 'v3', auth});
  console.log('update')
  console.log(changing)
  var fileMetadata = {
    'name': changing.picId + ".jpg",
  	parents: [changing.fId]
	};
	var media = {
  	mimeType: 'image/jpg',
  	body: fs.createReadStream(path)
	};
	drive.files.create({
  	resource: fileMetadata,
  	media: media,
  	fields: 'id'
	}, async function (err, file) {
  	if (err)
    	console.error(err);
	  else{
      console.log('hihi');
      await sqlpromise (`UPDATE crack SET fileId = '${file.data.id}' where id = ${changing.hId} and picId = ${changing.picId}`);
      sendpicture(event);
      fs.unlinkSync(path);
    }
  });
}

function Upload(drive, folderId, path, filename, houseId){
  var f = filename.split("_");

  var fileMetadata = {
    'name': f[4] + ".jpg",
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
      var cT = (f[3] > 2)? f[3] - 3 : f[3];
      cT = 1 << cT; 
      var info = (f[3] > 2)? 1 : 0;
      info =  info << (f[3] - 3)

      var sqlins = 'INSERT INTO crack (id, picId, floor, spaceType, crackPart, crackType, info, fileId)' + 
                    `VALUES (${houseId}, ${f[4]}, ${f[0]}, ${f[1]}, ${f[2]},${cT}, ${info}, '${file.data.id}');`;
      connection.query(sqlins);
      fs.unlinkSync(path + filename);
    }
  });
}

function UploadFolder(auth, folder, num, the_record){
  const drive = google.drive({version: 'v3', auth});
	var fileMetadata = {
  	'name': folder,
    parents:[picFolder],
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
      var path = './tmp/' + the_record['id'] + '/'
      connection.query(`INSERT INTO house(id, age, total_floor, folderId) VALUES (${num},  ${the_record.data[0]}, ${the_record.data[1]}, '${folderId}');`);
      fs.readdirSync(path).forEach(file => {
			  Upload(drive, folderId, path, file, Number(folder));
      });
  	}
	});
}

function SearchFolder(auth, folder){  
  const drive = google.drive({version: 'v3', auth});
	var pageToken = null;
	async.doWhilst(function (callback) {
  drive.files.list({
    	q: `'1GGxFX7j3d3x9GEDY2ihlBAWEQHYVXf0l' in parents and mimeType='application/vnd.google-apps.folder' and name='${folder}'`,
    	fields: 'nextPageToken, files(id, name)',
    	spaces: 'drive',
    	pageToken: pageToken
  	}, function (err, res) {
    	if (err) {
      	// Handle error
      	console.error(err);
      	callback(err)
    	}	else {
      	res.data.files.forEach(function (file) {
      	  console.log('Found file: ', file.name, file.id);
      	});
      	pageToken = res.nextPageToken;
      	callback();
    	}
  	});
	}, function () {
  	return !!pageToken;
	}, function (err) {
  	if (err) {
    	console.error(err);
  	} else {
    	// All pages fetched
  	}
	})
}

function Move( auth, hId, folderForm, folderIdTo){
  const drive = google.drive({version: 'v3', auth});
  const house = await sqlpromise(`select * from house, location where house.id=location.id and house.id = ${hId}`);
 	drive.files.update({
 	  fileId: house[0]['folderId'],
 	  addParents: folderIdTo,
 	  removeParents: folderForm,
 	  fields: 'id, parents'
 	}, function (err, file) {
 	  if (err) {
 	  } else {
 	    // File moved.
 	  }
 	});
}


async function getData(event, id) {
  const house = await sqlpromise(`select * from house, location where house.id=location.id and house.id = ${id}`);
  if (house.length < 1)
    return false;
  console.log(house)

  var user = event.source.userId;
  if (!(user in tmp_change)){
    tmp_change[user] = new Changing(user, id, house[0].folderId);

    //prepare dir
    var dir = './tmp/' + user;
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir);
  }
  
  const c_num = await sqlpromise(`select count(picId) from crack where id = ${id}`);

  var reply = `總樓層: ${house[0]['total_floor']}\n`;
  reply += `劣化紀錄: ${c_num[0]['count(picId)']>>1}筆`;
  

  question = platform.houseInfo(reply);
  await Move(oAuth2Client, id, picFolder, tmpFolder)
  event.reply(question); 
  return true;
}

async function updateSql(f, event){
        var sqlins = `UPDATE crack SET crackType=${f[3]}, info=${f[4]},crackPart=${f[5]},crcakCorner=${f[6]},`
                      +`x=${f[7]},y=${f[8]},length=${f[9]},width=${f[10]} where id = ${f[1]} and picId = ${f[2]}`;
        await sqlpromise(sqlins);
        var sqlins = `UPDATE crack SET crackType=${f[3]}, info=${f[4]},crackPart=${f[5]},crcakCorner=${f[6]},`
                      +`x=${f[7]},y=${f[8]},length=${f[9]},width=${f[10]} where id = ${f[1]} and picId = ${++f[2]}`;
        await sqlpromise(sqlins);
        sendPicture(event)
}

async function sendPicture(event){
  var user = event.source.userId;
  var crack = await sqlpromise(`select * from crack where id = '${tmp_change[user].hId}' order by picId asc `);
  event.reply(platform.sendPic(crack));
}

function sqlpromise (ins) {
	return new Promise((resolve, reject) => {
    connection.query(ins, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    })
  })
}
