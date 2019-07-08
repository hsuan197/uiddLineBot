window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

function setMaker(y, x){
    $('#pic_4').css('top', (y - 100).toString() + 'px')
    $('#pic_4').css('left', (x - 50).toString() + 'px')
}

//$( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search);
  var pId = urlParams.get('pId');
  var hId = urlParams.get('hId');
  var pic1 = urlParams.get('pic'); 
  var pic2 = urlParams.get('pic2');
  var cP = urlParams.get('cP');
  var cP2 = urlParams.get('cP2');
  var cT = urlParams.get('cT');
  var info = urlParams.get('info');
  var l = urlParams.get('l');
  var w = urlParams.get('w');
  var x = urlParams.get('x');
  var y = urlParams.get('y');
  var ff = urlParams.get('fplan');

  x = ( x == null || x == 'null')? -1 : x
  y = ( y == null || y == 'null')? -1 : y
  l = ( l == null || l == 'null')? 0 : l
  w = ( w == null || w == 'null')? 0 : w

  $("#pic_1").attr("src",`https://drive.google.com/uc?export=view&id=${pic1}`);
  $("#pic_2").attr("src",`https://drive.google.com/uc?export=view&id=${pic2}`);

  if(ff != -1)
    $('#pic_3').attr("src",`https://drive.google.com/uc?export=view&id=${ff}`);


  for(var i = 0; i < 3; i++){
    var mask = 1 << i;
    if ((mask & cT) > 0)
      $(`#ct${i}`).prop("checked", true).checkboxradio();      
    if ((mask & info) > 0)
      $(`#info${i}`).prop("checked", true).checkboxradio();      
  }

  for(var i = 0; i<5; i++){
    var mask = 1 << i;
    if ((mask & cP) > 0){
      $(`#cp1_${i}`).prop('checked', true).checkboxradio();
    } 
    if ((mask & cP2) > 0)
      $(`#cp2_${i}`).prop('checked', true).checkboxradio();
  }

  $(`#l`).attr("value", l);
  $(`#w`).attr("value", w);

  var img_h = -1
  var img_w = -1
  var img_t = -1
  var img_l = -1

  $('#pic_3').load(()=>{
  	img_w = $('#pic_3').width()
	  img_h = $('#pic_3').height()

    let img_offset = $('#pic_3').offset()
    img_t = img_offset.top
    img_l = img_offset.left
    if(x > 0 || y > 0)
      setMaker(img_t + y * img_h, img_l + x * img_w)
  })

	$('#pic_3').on('click', function(ev) {
    setMaker(ev.pageY, ev.pageX)
    y = (ev.pageY - img_t)/img_h
    x = (ev.pageX - img_l)/img_w
  });


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
//})
