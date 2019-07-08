var yesno = {
  "type": "template",
  "altText": "this is a confirm template",
  "template": {
    "type": "confirm",
    "text": "Are you sure?",
    "actions": [
      {
        "type": "message",
        "label": "Yes",
        "text": "yes"
      },
      {
        "type": "message",
        "label": "No",
        "text": "no"
      }
    ]
  }
}

var askLocation = {
  "type": "text", 
  "text": "請按下面的icon傳送位置",
  "quickReply": { 
    "items": [
      {
        "type": "action", 
        "action": {
          "type": "location",
          "label": "傳送位置"
        } 
      }
    ]
  }
}

var askCrackPart ={
  "type": "imagemap",
  "baseUrl": "https://drive.google.com/uc?export=view&id=1Z-DNWQnmT_khQo5JviQlbOKlcwlDOX4q#",
  "altText": "在不支援顯示影像地圖的地方顯示的文字",
  "baseSize": {
    "height": 720,
    "width": 720
  },
  "actions": [
    { //柱
      "type": "message",
      "text": "0",
      "area": {
        "x": 222,
        "y": 334,
        "width": 30,
        "height": 30
      }
    },
    { //樑
      "type": "message",
      "text": "1",
      "area": {
        "x": 135,
        "y": 182,
        "width": 30,
        "height": 30
      }
    },
    { //牆
      "type": "message",
      "text": "2",
      "area": {
        "x": 0,
        "y": 0,
        "width": 30,
        "height": 30
      }
    },
    {//樓板上
      "type": "message",
      "text": "3",
      "area": {
        "x": 347,
        "y": 121,
        "width": 60,
        "height": 30
      }
    },
    {//樓板下
      "type": "message",
      "text": "3",
      "area": {
        "x": 348,
        "y": 562,
        "width": 60,
        "height": 30
      }
    },
    {//開口部
      "type": "message",
      "text": "4",
      "area": {
        "x": 549,
        "y": 351,
        "width": 30,
        "height": 90
      }
    },
    {//轉角
      "type": "message",
      "text": "5",
      "area": {
        "x": 367,
        "y": 353,
        "width": 30,
        "height": 60
      }
    }
  ]
}

var askCrackType= {
  "type": "template",
  "altText": "在不支援顯示樣板的地方顯示的文字",
  "template": {
    "type": "carousel",
    "imageAspectRatio": "square",
    "imageSize": "cover",
    "columns": [
      {
        "thumbnailImageUrl": "https://drive.google.com/uc?export=view&id=1nLbvK89aHV-zaXPKO4uM4sI_LXvluAUo",
        "text": "裂縫",
        "defaultAction": {
          "type": "message",
          "text": "0"
        },
        "actions": [
          {
            "type": "message",
            "label": "寬度>0.3cm",
            "text": "3"
          },
          {

            "type": "message",
            "label": "寬度<0.3cm",
            "text": "0"
          }
        ]
      },
      {
        "thumbnailImageUrl": "https://drive.google.com/uc?export=view&id=1GUREFt3hN5FxSRCY6e_wQwcGOllEkC3R",
        "text": "剝落",
        "defaultAction": {
          "type": "message",
          "text": "1"
        },
        "actions": [
          {
            "type": "message",
            "label": "碎片>1.5cm",
            "text": "4"
          },
          {
            "type": "message",
            "label": "碎片<1.5cm",
            "text": "1"
          },
        ]
      },
      {
        "thumbnailImageUrl": "https://drive.google.com/uc?export=view&id=1vI1CV1O7ZKN5NqNBxdOAzSYpNvj3YUUr",
        "text": "鋼筋外露",
        "defaultAction": {
          "type": "message",
          "text": "2"
        },
        "actions": [
          {
            "type": "message",
            "label": "出現鋼筋外露現象",
            "text": "2"
          },
          {
            "type": "message",
            "label": " ",
            "text": "2"
          },
        ]
      }
    ]
  }
};

var askSpaceType ={
  "type": "template",
  "altText": "在不支援顯示樣板的地方顯示的文字",
  "template": {
    "type": "buttons",
    "style": "primary",
    "text": "選擇房間用途",
    "actions": [
      {
        "type": "message",
        "label": "客廳",
        "text": "0"
      },
      {
        "type": "message",
        "label": "廚房",
        "text": "1"
      },
      {
        "type": "message",
        "label": "房間",
        "text": "2"
      },
      {
        "type": "message",
        "label": "廁所",
        "text": "3"
      },/*
      {
        "type": "message",
        "label": "其他",
        "text": "4"
      }*/
    ]
  }
};


function getYesNo(qNum, aNum){
  var q = Number(qNum)
  var question = qs[q]
  var a = Number(aNum)
  var answer =(q>2)? anss[q - 3][a] : a
  //var question = '1'
  //var answer = 'q'


  return {
    "type": "template",
    "altText": "this is a confirm template",
    "template": {
      "type": "confirm",
      "text": `確認 ${question} 為 ${answer}`,
      "actions": [
        {
          "type": "postback",
          "label": "確定",
          "data": `answ:_y_${qNum}_${aNum}`
        },
        {
          "type": "postback",
          "label": "重新填寫",
          "data": `answ:_n_${qNum}_${aNum}`
        }
      ]
    }
  }
}

//module.export
var ifNextCrack = {
   "type": "template",
    "altText": "this is a confirm template",
    "template": {
      "type": "confirm",
      "text": `是否紀錄下一筆裂化資料`,
      "actions": [
        {
          "type": "postback",
          "label": "紀錄下一筆",
          "data": `next:`
        },
        {
          "type": "postback",
          "label": "結束",
          "data": `write`
        }
      ]
    }
}

function constrain(num, min = -1, max = -1){
  if(isNaN(num))
    return false;
  return (min < 0 || num >= min) && (max < 0 || num <= max)
}

function houseInfo(info){
  return {
    "type": "template",
    "altText": "this is a confirm template",
    "template": {
      "type": "confirm",
      "text": info,
      "actions": [
        {
          "type": "postback",
          "label": "查看圖片",
          "data": "查看圖片"
        },
        {
          "type": "postback",
          "label": "繪製平面圖",
          "data": "繪製平面圖"
        }
      ]
    }
  }
}

var finalQ =  {
      "type": "template",
      "altText": "檢測結果為",
      "template":{ 
        "type": "buttons",
        "style": "primary",
        "text": "檢測結果為",
        "actions": [
        {
          "type": "postback",
          "label": "需回報建築師",
          "data": `call_`
        },{
          "type": "postback",
          "label": "評估中",
          "data": `think`
        },{
          "type": "postback",
          "label": "沒有問題",
          "data": `good_`
        }]
      }
    }

function sendPictures(crack, floor){
  var num = crack.length;

  var columns = []
  for(let i = 0; i < num; i ++){
    var text = `空間類型: ${anss[0][crack[i].spaceType]} \n 發生樓層: ${crack[i].floor}`;

    var fplan = -1
    for(let j=0; j<floor.length;j++){
      if(floor[j].floor == crack[i].floor)
        fplan = floor[j].fileId
    }

    if(crack[i]['length'] != null)
      text += "\n(已填寫詳細資料)"

    var url = `line://app/1567045903-VWxApKem?hId=${crack[i].id}&pId=${crack[i].picId}&cT=${crack[i].crackType}&cP=${crack[i].crackPart}&info=${crack[i].info}&x=${crack[i].x}&y=${crack[i].y}&l=${crack[i].length}&w=${crack[i].width}&pic=${crack[i].fileId}&pic2=${crack[++i].fileId}&fplan=${fplan}`
    var col ={
        "thumbnailImageUrl": `https://drive.google.com/uc?export=view&id=${crack[i].fileId}`,
        "text": text,
        "defaultAction": {
          "type": "message",
          "text": "1"
        },
        "actions": [
          {
            "type": "postback",
            "label": "重新拍照",
            "data": `pict: ${crack[i].picId}`
          },
          {
            "type": "uri",
            "label": "填寫詳細狀況",
            "uri":url 
          }
        ]
      }
    columns.push(col);
  }

  var reply={ 
    "type": "template",
    "altText": "在不支援顯示樣板的地方顯示的文字",
    "template": {
      "type": "carousel",
      "imageAspectRatio": "square",
      "imageSize": "cover",
      "columns": columns
    }
  }
  return [reply, end]
}

var end = {
  "type": "flex",
  "altText": "This is a Flex Message",
  "contents": {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "horizontal",
      "contents":[
        {
          "type": "button",
          "action": {
            "type": "postback",
            "label": "結束請按此",
            "data": "end_:"
          }
        },
        {
          "type": "button",
          "action": {
            "type": "postback",
            "label": "聯絡住戶",
            "data": "cont"
          }
        }    
      ]
    }
  }
}

var openMap =  {
      "type": "flex",
      "altText": "This is a Flex Message",
      "contents": {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
          	{
            "type": "button",
            //"style": "primary",
            "action": {
              "type": "uri",
              "label": "開啟地圖選擇",
              "uri": "line://app/1567045903-PJbpekMA"
            }
        }]
      }
    }
}

function selectFloor(hid, allFloor){
  var content = [];
  console.log('ssss');
  console.log(hid);

  for(let i = 0; i < allFloor.length; i++){
    var aFloor = {
      "type": "button",
      //"style": "primary",
      "action": {
        "type": "uri",
   
        "label": allFloor[i].floor.toString(),
        "uri": `line://app/1567045903-dnlnyv0g?hid=${hid}&floor=${allFloor[i].floor}`
      }
    }
    content.push(aFloor)
  }

  var allFloor = {
      "type": "flex",
      "altText": "This is a Flex Message",
      "contents": {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "horizontal",
          "contents": content
        }
      }
  }
  return allFloor;
}


function sendMesg(mesg, sender, from){
  if(from == 1)//志工 -> 民眾
  { 
    return {
      "type": "template",
      "altText": "來自志工的訊息: " + mesg,
      "template": {
        "type": "buttons",
        "style": "primary",
        "text": "來自志工的訊息: " + mesg,
        "actions": [
        {
          "type": "postback",
          "label": "回覆",
          "data": `reply_${from}_${sender}`
        }]
      }
    }
  }
  else{ //民眾->志工
    return {
      "type": "template",
      "altText": "來自民眾的訊息: " + mesg,
      "template":{ 
        "type": "buttons",
        "style": "primary",
        "text": "來自民眾的訊息: " + mesg,
        "actions": [
        {
          "type": "postback",
          "label": "回覆",
          "data": `reply_${from}_${sender}`
        },{
          "type": "postback",
          "label": "結束",
          "data": `endre_${from}_${sender}`
        },{
          "type": "postback",
          "label": "確定拜訪",
          "data": `gogo!_${from}_${sender}`
        }]
      }
    }  
  }
}

var questions = ["請問房屋大致屋齡?", "請問所在位置總樓層數", "請問現在樓層?",  askSpaceType, ["劣化部位", askCrackPart], ["劣化種類", askCrackType], "拍照或選擇一張遠照"];
var qs = ["屋齡", "總樓層", "劣化發生樓層","空間類型", "劣化部位", "劣化種類"]
var anss = [["客廳", "廚房", "房間", "廁所"], ["柱", "樑", "牆", "樓板", "開口", "轉角"], ["裂縫", "剝落", "鋼筋外露", "裂縫", "剝落"]]

var constrains = [
  (num)=>{return constrain(num, 1)},
  (num)=>{return constrain(num, 1)},
  (num)=>{return constrain(num)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 4)},
  (num)=>{return constrain(num, 0, 4)},
  (num)=>{return false}
];

function learn(){
	var a = Math.floor(Math.random()*4);
	return reply[a];
}

var reply = [
	"材料老化: \n建築物承受風吹、日曬、雨淋，使建築材料隨著時間逐漸劣化，結構耐震能力也跟著降低。\n一般建築的使用年限約為50年左右，如果想延長老舊建築的使用壽命，住戶可考慮對結構進行補強。",
	"目前RC建築物常見的劣化行為有：\n1.混凝土 裂縫\n2.混凝土 剝落\n3.建築物滲漏水\n一般都設定限制寬度為0.1~0.4mm",
	"主結構首要注意的是柱樑牆 此外如果有鋼筋外露很嚴重在柱梁接點處的裂縫會比較需要注意，再來就是結構設計上我們希望是強柱弱梁\n\n強柱弱梁:\n因為柱支撐梁 梁支撐樓板 所以柱子強的話 當梁發生變形 人們會開始有警惕心 知道要往外跑",
	{
    "type": "image",
    "originalContentUrl": "https://drive.google.com/uc?export=view&id=1AmwzumBdcDFA6wZlJb90pbiF-poii1vY",
    "previewImageUrl": "https://drive.google.com/uc?export=view&id=1AmwzumBdcDFA6wZlJb90pbiF-poii1vY"
	}
]

module.exports.end = end;
module.exports.selectFloor = selectFloor;
module.exports.openMap = openMap;
module.exports.sendPic = sendPictures;
module.exports.askLocation = askLocation;
module.exports.ifNextCrack = ifNextCrack;
module.exports.getYesNo =  getYesNo;
module.exports.qs = questions;
module.exports.constrains = constrains;
module.exports.houseInfo = houseInfo;
module.exports.sendMesg = sendMesg;
module.exports.finalQ = finalQ;
module.exports.learn = learn;
