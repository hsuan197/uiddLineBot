var id = -1
var pid = -1
var img_w, img_h, img_t, img_l;
var crack_num;
var allData;
var floorPlan;
var popUp;
var poph2;
var popimg1;
var popimg2;
var curren_floor;

$(document).ready(()=>{ 
  popUp = document.getElementById("popup");
  poph2 = document.getElementById("poph2");
  popimg1 = document.getElementById("popimg1");
  popimg2 = document.getElementById("popimg2");
  closePupop();

  $('#pic1').load(()=>{

    img_w = $('#pic1').width()
	  img_h = $('#pic1').height()

    let img_offset = $('#pic1').offset()
    img_t = img_offset.top
    img_l = img_offset.left


    if(id < 0){
      
      var urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get('hid');
      $.get('start', {
        id: id
      }, (data) => {
        floorPlan = data[1];
        data = data[0]; 
        console.log(floorPlan);

        crack_num = data.length;
        allData = data;
        console.log(allData);

        for(var i=0;i<crack_num;i+=2){
        
          var a = data[i].x;
          var b = data[i].y;
          id = data[i].id;
          pid = data[i].picId;
        
          addElementImg(i);
          var n=document.getElementById("button"+data[i].floor);
          if(n==null){
            addElementButton(data[i].floor);
          }

          var bigImg=document.getElementById("bigImg");
          var pic1=document.getElementById("pic1");
          var width=img_w;
          var height=img_h;

          var k= document.getElementById('img'+i);
          var l=a*width;
          var t=b*height;

          k.style.left=-50+l+img_l+"px";
          k.style.top=-100+t+img_t+"px";
 
          Drag(k, i);
          addTopimg(i);
        }
      })
    }
  }) 
})

function addElementImg(a) {
  var bigImg = document.createElement("div");
  //bigImg.src="./img/marker.png";
  var wrap = document.getElementById('wrap');
  wrap.appendChild(bigImg);　
  //設定 img 屬性，如 id
  bigImg.setAttribute("id", 'img'+a);
  bigImg.setAttribute("class", 'marker');
  bigImg.style.display = 'none'; 


  var text = document.createElement("div");
  bigImg.appendChild(text);
  text.innerHTML = (a/2)+1;
}

function addTopimg(id){
  var topimg = document.createElement("div");
  var wrap = document.getElementById('scroll_item');
  wrap.appendChild(topimg);　
  topimg.setAttribute("onclick", `topimgClk(${id})`);
  topimg.setAttribute("id", `timg${id}`);
	topimg.innerHTML =' ' +  (id/2 + 1).toString();
	topimg.style.backgroundImage = `url('https://drive.google.com/uc?export=view&id=${allData[id].fileId}')`;
}

function topimgClk(id){
  popUp.style.display = "";
  var mData = allData[id];
  poph2.innerHTML = `所在樓層: ${mData.floor}F<br>
    劣化種類: ${mData.crackType}<br>劣化部位: ${mData.crackPart}<br>劣化空間: ${mData.spaceType}<br>
    長度: ${mData.length}cm 寬度: ${mData.width}cm`;
  
  popimg1.src=`https://drive.google.com/uc?export=view&id=${mData.fileId}`;
  popimg2.src=`https://drive.google.com/uc?export=view&id=${allData[id+1].fileId}`;

  selectAPic(id);
}

function selectAPic(id){
  for(var i=0;i<crack_num;i+=2){  
    var timg =  document.getElementById('timg'+i); 
    var bimg = document.getElementById('img'+i);
    if(i != id){
      timg.style.opacity = '0.5';
      bimg.src = "./summary/marker.png";
    }
    else{
      timg.style.opacity = '1';
      bimg.src = "./summary/marker2.png"
    }
  }
}

function showFloor(a){
  curren_floor = a;
  for(var i=0;i<crack_num;i+=2){
    var floor=allData[i].floor;
    var k= document.getElementById('img'+i);
    var timg =  document.getElementById('timg'+i);

    if(floor!=a){
      k.style.display = 'none';
      timg.style.display = 'none';
    }   
    if(floor==a){
      k.style.display = 'block';
      timg.style.display = ''
    }     
  }

  var pic1=document.getElementById("pic1"); 
  for(var j = 0; j < floorPlan.length; j++){
    if(floorPlan[j].floor == a){
      pic1.src = `https://drive.google.com/uc?export=view&id=${floorPlan[j].fileId}` 
      break;
    }
  }
  selectAPic(-1);
  closePupop();
}

function addElementButton(a) {
  var button = document.createElement("button");
  var floor = document.getElementById('floor2');
  floor.appendChild(button);　
  button.setAttribute("id", 'button'+a);
  button.setAttribute("class", 'fbtns');
  button.setAttribute('onclick','showFloor(a);');
  button.onclick=function() {showFloor(a);};
  document.getElementById('button'+a).innerHTML=a+'F';
}

function saveData(markerId){
    var i = markerId;
    var k= document.getElementById('img'+i);
    var a=parseInt(k.style.left) - img_l;
    var b=parseInt(k.style.top) - img_t;
    var saveX=(a+50)/img_w;
    var saveY=(b+100)/img_h;

    console.log(saveX)
    console.log(saveY)
    $.get('store', {
      X:saveX,
      Y:saveY,
      Id:id,
      Pid:i
    }, (data) => {})
}

function showFlywhere() {
  var pic1=document.getElementById("pic1"); 
  var width=pic1.width;
  var height=pic1.height; 

  x=window.event.offsetX/width;
  y=window.event.offsetY/height; 
}

function Drag(obj, id){
  obj.addEventListener('touchmove', function(event) { 
    if (event.targetTouches.length == 1) {
      var touch = event.targetTouches[0];
      obj.style.left = touch.pageX - 50 +'px';
      obj.style.top = touch.pageY - 100 +'px';
    }
  }, false);
  
  obj.addEventListener('touchstart', function(event) { 
    selectAPic(id);
  }, false);
  
  obj.addEventListener('touchend', function(event) { 
    saveData(id);
  }, false);
  event.preventDefault();
}

function closePupop(){
  popUp.style.display = "none";
}
