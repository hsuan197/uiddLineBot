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


module.exports.getYesNo =  getYesNo;
module.exports.yesno;
