window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

/*
function setMaker(num, x, y){
    $(`#pla_${num}`).css('top', (x - 100).toString() + 'px')
    $(`#pla_${num}`).css('left', (y - 50).toString() + 'px')
}


$('#pic_3').load(()=>{
  	img_w = $('#pic_3').width()
	  img_h = $('#pic_3').height()
    let img_offset = $('#pic_3').offset()
    img_t = img_offset.top
    img_l = img_offset.left
    if(x > 0 || y > 0)
      setMaker(img_t + y * img_h, img_l + x * img_w)
})
*/

$(document).ready(()=>{

	var urlParams = new URLSearchParams(window.location.search);
  var hId = urlParams.get('hId');

  console.log(hId)

  $.get('hstart', {
      id:hId
    }, (data) => {
      console.log(data)


    });




});



/*
	$('#pic_3').on('click', function(ev) {
    setMaker(ev.pageY, ev.pageX)
    y = (ev.pageY - img_t)/img_h
    x = (ev.pageX - img_l)/img_w
  });
*/
/*
	$('#submit').on('click', function(ev) {
    l = $('#l').val()
    w = $('#w').val()
    
    if(parseFloat(l) <= 0 || parseFloat(w) <= 0){
      window.alert("請正確填寫劣化長寬")
      return
    }

    if(x < 0 || y < 0){
      window.alert("請在圖片上點選劣化位置")
      return
    }

    cT = 0
    info = 0
    cP1 = 0
    cP2 = 0

    for(var i = 0; i < 3; i++){
      var mask = 1 << i;
      if ($(`#ct${i}`).is(':checked'))
        cT += mask
      if ($(`#info${i}`).is(':checked'))
        info += mask
    }

    for(var i = 0; i<5; i++){
      var mask = 1 << i;
      if ($(`#cp1_${i}`).is(':checked'))
        cP1 += mask
      if ($(`#cp2_${i}`).is(':checked'))
        cP2 += mask
    }

    var result = `result_${hId}_${pId}_${cT}_${info}_${cP1}_${cP2}_${x}_${y}_${l}_${w}_`

    liff.sendMessages([{
      type: 'text',
      text: result
    }]).then(function () {
      window.alert("資料送出");
      liff.closeWindow(); 
    }).catch(function (error) {
      window.alert("Error sending message: " + error);
      liff.closeWindow();
    });
  });
*/
