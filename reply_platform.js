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

var questions = ["總樓?", "現在樓?", "平面結構?", "入口?" , "樓梯?" ,"劣化種類?", "空間類型?", "劣化部位?", "長寬?", "拍照!!"];
var constrains = [
  (num)=>{return constrain(num, 0)},
  (num)=>{return constrain(num)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 4)},
  (num)=>{return constrain(num, 0, 3)},
  (num)=>{return constrain(num, 0, 4)},
  (num)=>{return constrain(num, 0, 5)},
  (num)=>{return false}
];


module.exports.getYesNo =  getYesNo;
module.exports.yesno = yesno;
module.exports.qs = questions;
module.exports.constrains = constrains;
