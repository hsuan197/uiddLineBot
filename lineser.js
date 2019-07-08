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
  channelAccessToken: config.line.channelAccessToken
});

//google drive
const {google} = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(config.Gdrive.client_id, config.Gdrive.client_secret, config.Gdrive.redirect_uri);
oAuth2Client.setCredentials(config.Gdrive.token);
const async = require('async');
const tmpFolder = '1wRNkxOKTFkpuZTS_ZG9A-8hRpo1PyqTe';
const picFolder = '12XEk5qMiKvH_SJHUmCS4jYEm2p1_qOjU';
const floorPlanFolder = '1qhdvioeCNSI07nXycfr5SNvb6pjbabya';

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
  this.qNum = -1;
  this.data = [-1, -1, -1, -1, -1, -1, 0];
  this.address = "";
  this.lon = 0;
  this.lat = 0;
}

//changing
var tmp_change = {}
function Changing(userId, houseId, folderId){
  this.uId = userId;
  this.hId = houseId;
  this.picId = -1;
  this.fId = folderId;
  this.calling = false;
}

var tmp_replying = {}
function Replying(statu, anotherId){
	this.from = statu;
	this.dst = anotherId;
}


const platform = require('./reply_platform.js')
bot.on('postback', function (event) {
  var mesg = event.postback.data;
  var toDo = mesg.substr(0, 5);
  var user = event.source.userId;
  console.log(user)

  if(mesg == "btn_12"){ 
      event.reply(platform.openMap);
      tmp_change[user] = new Changing(user);
      return;
  }else if(mesg == "btn_11" || mesg == "btn_13"){
      event.reply(platform.askLocation);
      return; 
  }else if(mesg == "btn_2"){ 
      event.reply(platform.learn());
  }else if(mesg == "btn_3"){ 
      sendStatu(event);
  }

  else if(!(user in tmp_records) && !(user in tmp_change)){
    return;
  }

  //志工
  if (toDo == "info:"){
      event.reply("info");    
  }
  else if(toDo == "pict:"){
      event.reply("請傳送圖片");
      pid = Number(mesg.substr(5))
      tmp_change[user].picId = pid;
      //console.log(tmp_change[user]);
  } 
  else if(toDo == "end_:"){
    event.reply(platform.finalQ)
  }
  else if (toDo == "call:"){
    event.reply("感謝");
    updateStatu(tmp_change[user].hId, 5)
    Move(oAuth2Client, tmp_change[user]['hId'], tmpFolder, picFolder);
    delete tmp_change[user];
  }else if (toDo == "think"){
    event.reply("感謝");
    updateStatu(tmp_change[user].hId, 6)
    Move(oAuth2Client, tmp_change[user]['hId'], tmpFolder, picFolder);
    delete tmp_change[user];
  }
  else if (toDo == "good_"){
    event.reply("感謝");
    updateStatu(tmp_change[user].hId, 7)
    Move(oAuth2Client, tmp_change[user]['hId'], tmpFolder, picFolder);
    delete tmp_change[user];
  }
  else if (mesg == "查看圖片"){
    sendPicture(event);
  }else if(mesg == "繪製平面圖"){
    sendFloors(event);
  }else if(mesg == "cont"){ 
    event.reply("請輸入訊息");
    tmp_change[user].calling = true;
  }else if(toDo == "endre"){
    updateStatu(tmp_change[user].hId, 3)
  }else if(toDo == "gogo!"){
    updateStatu(tmp_change[user].hId, 2)
  }
  else if (toDo == "reply"){
    updateStatu(tmp_change[user].hId, 4)
		var f = mesg.split("_");
		if(f[1] == 1){ //民眾回復志工
			tmp_replying[user] = new Replying(0, f[2])
		}
		else{ //志工回覆民眾
			tmp_replying[user] = new Replying(1, f[2])
		}
		event.reply('請輸入');
		console.log(tmp_replying)
	}

  //民眾
  //answering quesion
  else if(toDo == "answ:"){
    the_record = tmp_records[user];
    var data = mesg.split('_');
    q = Number(data[2])
    a = Number(data[3])
    
    if(data[1] == 'y'){ //按下確定
      the_record.data[q] = a;
      var reply = (the_record.qNum < total_qNum) ? platform.qs[++the_record.qNum] : "已修改";
      event.reply(reply);
    }
    else if (data[1] == 'n') //按下重新輸入
      event.reply(platform.qs[q]);
  }

  //tacking picture
  else if(toDo == "next:"){
    the_record.qNum = 2;
    event.reply(platform.qs[the_record.qNum])
  }
  else if(toDo == "write"){
    event.reply("謝謝><")
    WriteDB(the_record);
    delete tmp_records[user];
  }
})

//reply
bot.on('message', function (event) {
  //get user
  var user = event.source.userId;

	if (user in tmp_replying){
		bot.push(tmp_replying[user].dst, platform.sendMesg(event.message.text, user, tmp_replying[user].from));
		delete tmp_replying[user];
		event.reply('送出');
		return;
	}

  if (!(user in tmp_records) && !(user in tmp_change)){
    if (event.message.type == "location"){
      tmp_records[user] = new Record(user);

      //prepare dir
      var dir = './tmp/' + user;
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

      //record location
      tmp_records[user].lat = event.message.latitude;
      tmp_records[user].lon = event.message.longitude;
      tmp_records[user].address = event.message.address;

      //update statu and reply
      tmp_records[user].qNum = 0;
      event.reply(platform.qs[tmp_records[user].qNum]);
    }
    else
      event.reply("請在選單中選擇需要服務")
    return;
  }
  else if(user in tmp_change){
    if(tmp_change[user].calling == true && event.message.type=="text"){
      tmp_change[user].calling == false;
			sendMessage(event.message.text, 1, user, tmp_change[user].hId);
			event.reply('已送出');
    }
  }

  //the record for this user
  the_record = tmp_records[user];

  //reply
  if (event.message.type=="text"){
    var mesg = event.message.text;
    var reply = "";

    //edit a record
    if(user in tmp_change){
      if(mesg.substr(0, 6)=='result'){
        var f = mesg.split("_");
        updateSql(f, event)
      } 
      else if (mesg.substr(0,5)=='start'){
        var id = mesg.split("_")[1];
        console.log(id);
        tmp_change[user].hId = id;
        getData(event, id);
				firstLookStatu(id);
      }
      return
    }

    if(mesg.substr(0, 5) == "test:"){
      id = Number(mesg.substr(5))
      var result = getData(event, id);
      return
    }

    //ask question
    if (the_record.qNum < 0)
      reply = platform.askLocation;
    else if(the_record.qNum < total_qNum){
      var ans = parseInt(mesg);
      reply = (platform.constrains[the_record.qNum](ans))?platform.getYesNo(the_record.qNum, ans) :  platform.qs[the_record.qNum];
    }
    event.reply(reply);
  }

  else if (event.message.type == "image"){
    if((user in tmp_change) && tmp_change[user].picId >= 0){
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
          Update(oAuth2Client, tmp_change[user], file_path, event)
    	  });
 	    });
      return 
    }

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
    if(the_record.qNum == total_qNum){
      reply = '請再拍一張近照';
      the_record.qNum += 1
    } else if (the_record.qNum == total_qNum + 1){
      reply = platform.ifNextCrack;
      the_record.qNum += 1
    }
    event.reply(reply);
  }
  //console.log(the_record);
});

//follow event
bot.on('follow', (event)=>{
  event.reply(platform.getYesNo("是否開始檢測", "開始檢測", "取消"));
})

//listen
var app = express();
var linebotParser = bot.parser();
app.post('/', linebotParser);

app.use(express.static(`${__dirname}/m`))
var server = https.createServer(options, app).listen(port, function() {
	console.log(`port: ${port}`);
})



//write database & upload images & delete local images
function WriteDB(the_record){
  connection.query('select count(id) from  record', function (error, results, fields) {
    if (error) throw error
    var num = results[0]['count(id)'];
    var t1 = new Date();
    var time = t1.getFullYear() * 10000 + (t1.getMonth()+1)*100 + t1.getDate();


    connection.query(`INSERT INTO record(lineId, id, time) VALUES ("${the_record.id}", ${num}, ${time});`);
    connection.query(`INSERT INTO location(id, lat, lng, statu, address) VALUES (${num}, ${the_record.lat}, ${the_record.lon}, '0', '${the_record.address}');`);
    UploadFolder(oAuth2Client, num.toString(), num, the_record);
  })
}

function Update(auth, changing, path, event){
  const drive = google.drive({version: 'v3', auth});
  //console.log('update')
  //console.log(changing)
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
  	if (err);
    	//console.error(err);
	  else{
      await sqlpromise (`UPDATE crack SET fileId = '${file.data.id}' where id = ${changing.hId} and picId = ${changing.picId}`);
      sendPicture(event);
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
  	if (err);
    	//console.error(err);
	  else{
      var cT = (f[3] > 2)? f[3] - 3 : f[3];
      cT = 1 << cT;
      var info = (f[3] > 2)? 1 : 0;
      info =  info << (f[3] - 3)

      var cP = 1 << f[2];

      var sqlins = 'INSERT INTO crack (id, picId, floor, spaceType, crackPart, crackType, info, fileId)' + 
                    `VALUES (${houseId}, ${f[4]}, ${f[0]}, ${f[1]}, ${cP}, ${cT}, ${info}, '${file.data.id}');`;
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
  	if (err);
    	//console.error(err);
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

async function Move( auth, hId, folderForm, folderIdTo){
  const drive = google.drive({version: 'v3', auth});
  var house = await sqlpromise(`select * from house, location where house.id=location.id and house.id = ${hId}`);
 	drive.files.update({
 	  fileId: house[0]['folderId'],
 	  addParents: folderIdTo,
 	  removeParents: folderForm,
 	  fields: 'id, parents'
 	}, function (err, file) {
 	  if (err);
 	});
}

async function getData(event, id) {
  const house = await sqlpromise(`select * from house, location where house.id=location.id and house.id = ${id}`);
  if (house.length < 1)
    return false;
  //console.log(house)

  var user = event.source.userId;
  tmp_change[user].hId = id;
  tmp_change[user].fId = house[0].folderId;
  //console.log(tmp_change[user])

  //prepare dir
  var dir = './tmp/' + user;
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
  
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

async function updateStatu(id, newStatu){
  console.log(id, newStatu);
  var sqlins = `UPDATE location SET statu='${newStatu}' where id = '${id}'`;
  await sqlpromise(sqlins);
}

async function firstLookStatu(id){
  console.log(id, 1)
	var sqlins =  `select statu from location where id = ${id}`;
	var s = await sqlpromise(sqlins);
	if(s[0].statu != '0')
		return 
	else
		updateStatu(id, 1);
}


async function sendPicture(event){
  var user = event.source.userId;
  var crack = await sqlpromise(`select * from crack where id = '${tmp_change[user].hId}' order by picId asc `);
  var floor = await sqlpromise(`select * from floor_plan where id = '${tmp_change[user].hId}' order by floor asc `);
  console.log(floor)
  event.reply(platform.sendPic(crack, floor));
}

async function sendFloors(event){
  var user = event.source.userId;
	console.log(tmp_change)
  var floor = await sqlpromise(`select DISTINCT floor from crack where id = '${tmp_change[user].hId}' order by floor asc `);
  console.log(floor)
  event.reply(platform.selectFloor(tmp_change[user].hId, floor))
}

function sqlpromise (ins) {
	return new Promise((resolve, reject) => {
    connection.query(ins, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    })
  })
}

//for 裂化地圖
app.get('/mapStart', (req, res) => {
  mapData(res)
})

//for 平面圖
app.use(express.urlencoded());
app.use(express.json());
app.post('/drawSave', (req, res) => {
  var file_name = `${req.body.hId}_${req.body.floor}.png`
  var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(`FloorPlan/${file_name}`, base64Data, 'base64', function(err) {
    console.log(req.body.hId);
    //console.log(req.body);
    if(err)  
      console.log(err);
    else
      UploadFP(oAuth2Client, req.body.hId, req.body.floor, file_name);
  });
})

function UploadFP(auth, hId, floor, file){
  const drive = google.drive({version: 'v3', auth});
  var fileMetadata = {
    'name': file,
  	parents: [floorPlanFolder]
	};
	var media = {
  	mimeType: 'image/png',
  	body: fs.createReadStream(`FloorPlan/${file}`)
	};
	drive.files.create({
  	resource: fileMetadata,
  	media: media,
  	fields: 'id'
	}, async function (err, f) {
  	if (err)
    	console.error(err);
	  else{
      var fp = await sqlpromise(`select * from floor_plan where id=${hId} and floor=${floor}`);
      if(fp.length > 0)
        connection.query(`UPDATE floor_plan SET fileId = '${f.data.id}' where id = ${hId} and floor = ${floor}`);
      else
        connection.query(`INSERT INTO floor_plan(id, floor, fileId) VALUES (${hId}, ${floor}, '${f.data.id}');`);
    }
  });
}

async function mapData(res) {
  const house = await sqlpromise(`select * from house, location, record where house.id=location.id and house.id=record.id`);
  for(let i = 0; i < house.length; i++){   
    const c_num = await sqlpromise(`select count(picId) from crack where id = ${house[i].id}`);
    var reply = `總樓層: ${house[i]['total_floor']}<br>`;
    reply += `屋齡: ${house[i]['age']}<br>`;
    reply += `劣化紀錄: ${c_num[0]['count(picId)']>>1}筆`;

    house[i]['text'] = reply;

    const crack = await sqlpromise(`select crackType, info from crack where id=${i}`);
    house[i]['info'] = 0;
    house[i]['dangerCrack'] = false;
    for(let j = 0; j < crack.length; j++){
      if(crack[j].crackType > 3){
        house[i]['dangerCrack'] = true;
      }
      if(crack[j].info > house[i]['info'])
        house[i]['info'] = crack[j].info; 
    }  
  }
  res.send(house);
}


async function sendMessage( mesg, from, senderId, hId){
	if(from == 1) //志工送出
	{
		var record = await sqlpromise(`select lineId from record where id = ${hId}`)
		var dst = record[0].lineId;
		bot.push(dst, platform.sendMesg(mesg, senderId, 1));
	}	
}

async function sendMes( mesg, from, senderId, dst){
		var dst = record[0].lineId;
	bot.push(dst, platform.sendMesg(mesg, senderId, 1));
}

var statuMean = [
  "等待志工處理",
  "志工已查看，請民眾留意訊息",
  "志工和民眾已溝通，等待幾月幾號志工前往",
  "志工和民眾已溝通，無須前往可安心住",
  "志工和民眾已溝通，待約時間",
  "已完成訪查，且通報建築師",
  "已完成訪查，評估中",
  "已完成訪查，可安心住"
]
async function sendStatu(event){
	var sqlins =  `select statu, record.id, time from record, location where record.id = location.id and record.lineId='${event.source.userId}'`;
	var s = await sqlpromise(sqlins);
  var reply = ""
  for(let i = 0; i < s.length; i++){
    reply += `${i}(${s[i].time}): ${statuMean[s[i].statu]})\n`
  }

  if(s.length > 0){
    event.reply(reply);
  }else{
    event.reply('未找到資料');
  }
}
