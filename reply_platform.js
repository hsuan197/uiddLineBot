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

var askCrackPart = {
  "type": "template",
  "altText": "this is a image carousel template",
  "template": {
      "type": "image_carousel",
      "columns": [
          {
            "imageUrl": "https://drive.google.com/uc?export=view&id=1pHYd7ws5vGVmT4pCupctAJvxYTpoyCPu",
            "action": {
              "type": "message",
              "label": "柱",
              "text": "0"
            }
          },
          {
            "imageUrl": "https://drive.google.com/uc?export=view&id=1lph5WYkT20Z-WS_Ub-8NVwJkdDeDcnaO",
            "action": {
              "type": "message",
              "label": "梁",
              "text": "1"
            }
          },
          {
            "imageUrl": "https://drive.google.com/uc?export=view&id=1E7bufTXYK8nyTigzB7j5SeUXS_Vnh7IA",
            "action": {
              "type": "message",
              "label": "牆",
              "text": "2"
            }
          },
          {
            "imageUrl": "https://drive.google.com/uc?export=view&id=1E7bufTXYK8nyTigzB7j5SeUXS_Vnh7IA",
            "action": {
              "type": "message",
              "label": "樓板",
              "text": "3"
            }
          },
          {
            "imageUrl": "https://drive.google.com/uc?export=view&id=1E7bufTXYK8nyTigzB7j5SeUXS_Vnh7IA",
            "action": {
              "type": "message",
              "label": "開口處",
              "text": "4"
            }
          },
          {
            "imageUrl": "https://drive.google.com/uc?export=view&id=1E7bufTXYK8nyTigzB7j5SeUXS_Vnh7IA",
            "action": {
              "type": "message",
              "label": "轉角",
              "text": "5"
            }
          }
      ]
  }
};

var askCrackType= {
  "type": "template",
  "altText": "在不支援顯示樣板的地方顯示的文字",
  "template": {
    "type": "carousel",
    "imageAspectRatio": "square",
    "imageSize": "cover",
    "columns": [
      {
        "thumbnailImageUrl": "https://drive.google.com/uc?export=view&id=1pHYd7ws5vGVmT4pCupctAJvxYTpoyCPu",
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
            "label": "裂縫寬度深度較小",
            "text": "0"
          }
        ]
      },
      {
        "thumbnailImageUrl": "https://drive.google.com/uc?export=view&id=1lph5WYkT20Z-WS_Ub-8NVwJkdDeDcnaO",
        "text": "剝落",
        "defaultAction": {
          "type": "message",
          "text": "1"
        },
        "actions": [
          {
            "type": "message",
            "label": "剝落碎片大於1.5cm",
            "text": "4"
          },
          {
            "type": "message",
            "label": "寬度大於0.3cm",
            "text": "1"
          },
        ]
      },
      {
        "thumbnailImageUrl": "https://drive.google.com/uc?export=view&id=1E7bufTXYK8nyTigzB7j5SeUXS_Vnh7IA",
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


function getYesNo(question, yes, no){
  var retYesNo = yesno;
  yesno.template.text = question;
  yesno.template.actions[0].label = yes;
  yesno.template.actions[0].text = yes;
  yesno.template.actions[1].label = no;
  yesno.template.actions[1].text = no;

  return retYesNo;
}

function constrain(num, min = -1, max = -1){
  if(isNaN(num))
    return false;
  return (min < 0 || num >= min) && (max < 0 || num <= max)
}

//var crackType = ["裂縫", "嚴重裂縫", "剝落", "鋼筋外露"];
//var crackPart = ["牆", "柱子", "樑"];
//var spaceType = ["客廳", "房間", "廚房", "其他"]


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
  "altText": "this is a confirm template",
  "template": {
    "type": "confirm",
    "text": "是否通報建築師",
    "actions": [
    {
      "type": "postback",
      "label": "是",
      "data": "call:"
    },
    {
      "type": "postback",
      "label": "否",
      "data": "save:"
    }]
  }
}


function sendPictures(crack){
  var num = crack.length;
  console.log(crack);
  console.log(num);
  var columns = []
  for(let i = 0; i < num; i ++){
    //var text = `裂縫類型: ${crackType[crack[i].crackType]}\n空間類型: ${spaceType[crack[i].spaceType]}\n劣化部位: ${crackPart[crack[i].crackPart]}`;
    var text = `裂縫類型: ${crack[i].crackType} 空間類型: ${crack[i].spaceType} 劣化部位: ${crack[i].crackPart}`;

    console.log(crack[i]['length'])
    if(crack[i]['length'] != null){
      text+= "\n(已填寫詳細資料)"
    }


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
            "uri": `line://app/1567045903-VWxApKem?hId=${crack[i].id}&pId=${crack[i].picId}&cT=${crack[i].crackType}&cP=${crack[i].crackPart}&info=${crack[i].info}&x=${crack[i].x}&y=${crack[i].y}&l=${crack[i].length}&w=${crack[i].width}&pic=${crack[i].fileId}&pic2=${crack[++i].fileId}`

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


	var end =  {
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
              "type": "postback",
              "label": "結束請按此",
              "data": "end_:"
            }
        }]
      }
    }
  }


  console.log(reply);
  return [reply, end];
  //return reply;
};


var questions = ["請問房屋大致屋齡?", "請問所在位置總樓層數", "請問現在樓層?",  askSpaceType, ["劣化部位", askCrackPart], ["劣化種類", askCrackType], "拍照或選擇一張照片"];
var constrains = [
  (num)=>{return constrain(num, 0)},
  (num)=>{return constrain(num, 0)},
  (num)=>{return constrain(num)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return false}
];

module.exports.sendPic = sendPictures;
module.exports.askLocation = askLocation;
module.exports.getYesNo =  getYesNo;
module.exports.yesno = yesno;
module.exports.qs = questions;
module.exports.constrains = constrains;
module.exports.houseInfo = houseInfo;
module.exports.finalQ = finalQ;
