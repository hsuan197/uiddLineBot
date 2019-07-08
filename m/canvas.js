var canvas = new fabric.Canvas('canvas');
canvas.selection = false;
canvas.setWidth(321);
canvas.setHeight(401); 
var select = 0;
var mode = 0;
var helpmode = 0;

var floor
var hId

$( document ).ready(function() {
  var urlParams = new URLSearchParams(window.location.search);
  floor = urlParams.get('floor');
  hId = urlParams.get('hid');
})

//****************grid*******************
var grid = 20;

for (var i = 0; i <= (600 / grid); i++) {
  canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#bfbfbf', selectable: false }));
  canvas.add(new fabric.Line([ 0, i * grid, 600, i * grid], { stroke: '#bfbfbf', selectable: false }))
}

canvas.on('object:moving', function(options) { 
  options.target.set({
    left: Math.round(options.target.left / grid) * grid,
    top: Math.round(options.target.top / grid) * grid
  });
});
//*****end grid**************

var wall = new fabric.Rect({
  id: "wall",
  top : 2*grid,
	left : 2*grid,
	width : 240,
	height : 300,
  stroke: '#0d0d0d',
  strokeWidth: 4,
  fill:'',
  noScaleCache: false,
  strokeUniform: true,
	hasRotatingPoint: false,
	cornerSize: 30,
	transparentCorners: false,
	cornerStyle: 'circle',
  opacity: 1,
  padding: 15
});
 
canvas.add(wall);
canvas.renderAll ();

var select = 0;
function text(){	
	if(select){
  select = 0;
  $(".addtext").hide(50);
	}
	else{
    $(".addtext").show(50);
    select = 1;
	}	
}

function text1(){
  var text = new fabric.Text('客廳', { 
  //fontFamily: 'Delicious_500', 
  left: 100, 
  top: 100, 
  fontSize: 25,
  //width : 220,
	//height : 300,
	hasRotatingPoint: false,
	cornerSize: 20,
	transparentCorners: false,
	cornerStyle: 'circle',
  padding: 10,
  id: "wall"
}).setControlsVisibility({
    tr: true,
    tl: true,
    br: true,
    bl: true,
    ml: false,
    mt: false,
    mr: false,
    mb: false,
});
  canvas.add(text).setActiveObject(text);
  $(".addtext").hide(50);
  select = 0;
}

function text2(){
  var text = new fabric.Text('廚房', { 
  //fontFamily: 'Delicious_500', 
  left: 100, 
  top: 100, 
  fontSize: 25,
  //width : 220,
	//height : 300,
	hasRotatingPoint: false,
	cornerSize: 20,
	transparentCorners: false,
	cornerStyle: 'circle',
  padding: 10,
  id: "wall"
}).setControlsVisibility({
    tr: true,
    tl: true,
    br: true,
    bl: true,
    ml: false,
    mt: false,
    mr: false,
    mb: false,
});
  canvas.add(text).setActiveObject(text);
  $(".addtext").hide(50);
  select = 0;
}

function text3(){
  var text = new fabric.Text('浴室', { 
  //fontFamily: 'Delicious_500', 
  left: 100, 
  top: 100, 
  fontSize: 25,
  //width : 220,
	//height : 300,
	hasRotatingPoint: false,
	cornerSize: 20,
	transparentCorners: false,
	cornerStyle: 'circle',
  padding: 10,
  id: "wall"
}).setControlsVisibility({
    tr: true,
    tl: true,
    br: true,
    bl: true,
    ml: false,
    mt: false,
    mr: false,
    mb: false,
});
  canvas.add(text).setActiveObject(text);
  $(".addtext").hide(50);
  select = 0;
}

function text4(){
  var text = new fabric.Text('廁所', { 
  //fontFamily: 'Delicious_500', 
  left: 100, 
  top: 100, 
  fontSize: 25,
  //width : 220,
	//height : 300,
	hasRotatingPoint: false,
	cornerSize: 20,
	transparentCorners: false,
	cornerStyle: 'circle',
  padding: 10,
  id: "wall"
}).setControlsVisibility({
    tr: true,
    tl: true,
    br: true,
    bl: true,
    ml: false,
    mt: false,
    mr: false,
    mb: false,
});
  canvas.add(text).setActiveObject(text);
  $(".addtext").hide(50);
  select = 0;
}

function text5(){
  var text = new fabric.Text('房間', { 
  //fontFamily: 'Delicious_500', 
  left: 100, 
  top: 100, 
  fontSize: 25,
  //width : 220,
	//height : 300,
	hasRotatingPoint: false,
	cornerSize: 20,
	transparentCorners: false,
	cornerStyle: 'circle',
  padding: 10,
  id: "wall"
}).setControlsVisibility({
    tr: true,
    tl: true,
    br: true,
    bl: true,
    ml: false,
    mt: false,
    mr: false,
    mb: false,
});
  canvas.add(text).setActiveObject(text);
  $(".addtext").hide(50);
  select = 0;
}


function addItem1(){	
fabric.Image.fromURL('./image/門.svg', function(img) {
    img.set({ 
      left: 250, 
      top: 250, 
      angle: 0, 
      id: "item",
      opacity: 1,
      xgrid: 3,
      hasControls: false,
      //padding:1,
      borderColor: 'red',
      //sroke: 'black',
      //strokeWidth: 50
      //width: 2*grid,
      //height: 2*grid
    }).scale(2*grid/img.width);
    canvas.add(img).setActiveObject(img);

});
}

function addItem2(){
  fabric.Image.fromURL('./image/窗.svg', function(img) {
    img.set({ 
      left: 250, 
      top: 250, 
      angle: 0, 
      id: "item",
      opacity: 1,
      xgrid: 3,
      hasControls: false,
      //padding:1,
      borderColor: 'red',
      //sroke: 'black',
      //strokeWidth: 50
      //width: 2*grid,
      //height: 2*grid
      padding: 10
    }).scale(2*grid/img.width);
    canvas.add(img).setActiveObject(img);

});
}

select = 0;
function addLad(){	
	if(select){
  select = 0;
  $(".addLad").hide(200);
	}
	else{
    $(".addLad").show(200);
    select = 1;
	}
	
}

function addItem3(){	
fabric.Image.fromURL('./image/折梯.svg', function(img) {
    img.set({ 
      left: 250, 
      top: 250, 
      angle: 0, 
      id: "item",
      opacity: 1,
      xgrid: 3,
      hasControls: false,
      //padding:1,
      borderColor: 'red',
      //sroke: 'black',
      //strokeWidth: 50
      //width: 2*grid,
      //height: 2*grid
    }).scale(2*grid/img.width);
    canvas.add(img).setActiveObject(img);

});
  $(".addLad").hide(200);
  select = 0;
}

function addItem4(){	
fabric.Image.fromURL('./image/直梯.svg', function(img) {
    img.set({ 
      left: 250, 
      top: 250, 
      angle: 0, 
      id: "item",
      opacity: 1,
      xgrid: 3,
      hasControls: false,
      //padding:1,
      borderColor: 'red',
      //sroke: 'black',
      //strokeWidth: 50
      //width: 2*grid,
      //height: 2*grid
    }).scale(2*grid/img.width);
    canvas.add(img).setActiveObject(img);

});
  $(".addLad").hide(200);
  select = 0;
}

function addItem5(){	
fabric.Image.fromURL('./image/剪刀梯.svg', function(img) {
    img.set({ 
      left: 250, 
      top: 250, 
      angle: 0, 
      id: "item",
      opacity: 1,
      xgrid: 3,
      hasControls: false,
      //padding:1,
      borderColor: 'red',
      //sroke: 'black',
      //strokeWidth: 50
      //width: 2*grid,
      //height: 2*grid
    }).scale(2*grid/img.width);
    canvas.add(img).setActiveObject(img);

});
  $(".addLad").hide(200);
  select = 0;
}

function Addwall(){ 
  var subwall = new fabric.Rect({
    id: "wall",
	  top : 10,
    left : 10,
	  width : 100,
    height : 200,
    stroke: '#0d0d0d',
    strokeWidth: 3,
    fill:'',
    noScaleCache: false,
    strokeUniform: true,
  	hasRotatingPoint: false,
  	cornerSize: 30,
		padding: 15,
  	transparentCorners: false,
  	cornerStyle: 'circle'
  });
 
  canvas.add(subwall).setActiveObject(subwall);
  canvas.renderAll();
}

function save(){
  document.getElementById("result").src = canvas.toSVG();
}

function rotate(){
  var active = canvas.getActiveObject();
  var angle = active.get('angle');
  active.rotate(angle+90);
  canvas.renderAll();
}


canvas.on('selection:cleared', e => {
    $("#lowbutton").hide(50);
})

canvas.on('selection:created', e => {
    if(canvas.getActiveObject().id=='item'){
      $("#lowbutton").show(50);
    }
    if(canvas.getActiveObject().id=='wall'){
      $("#lowbutton").show(50);
    }
})

canvas.on('selection:updated', e => {
    if(canvas.getActiveObject().id=='item'){
      $("#lowbutton").show(50);
    }
    if(canvas.getActiveObject().id=='wall'){
      $("#lowbutton").show(50);
    }
})

wall.on('selected', e => {
    console.log('HI!');
    wall.opacity = 0.5;
})

wall.on('deselected', e => {
  console.log('deselect');  
  wall.opacity = 1;
})

function Delete(){
  var active = canvas.getActiveObject();
  canvas.remove(active);
}

function Itemmode(){
  canvas.discardActiveObject();
  canvas.getObjects().forEach(obj => {
    console.log('for each');
    if(obj.id == "wall") obj.set({selectable: false});
    if(obj.id == "item") obj.set({selectable: true, opacity: 1 });
  });
  canvas.renderAll();
  mode = 1;
}

function Wallmode(){
  canvas.discardActiveObject();
  canvas.getObjects().forEach(obj => {
    if(obj.id == "item") obj.set({selectable: false, opacity: 0.5 });
    if(obj.id == "wall") obj.set({selectable: true});
  });
  canvas.renderAll();
  mode = 0;
}

function larger(){
  var active = canvas.getActiveObject();
  if(active.id=="item") active.scaleToWidth((active.xgrid+1)*grid).set({xgrid: active.xgrid+1});
  //active.scaleToHeight(grid);
  canvas.renderAll();
}

function smaller(){
  var active = canvas.getActiveObject();
  if(active.id=="item") active.scaleToWidth((active.xgrid-1)*grid).set({xgrid: active.xgrid-1});
  //active.scaleToHeight(grid);
  canvas.renderAll();
}


function clickOK(){
  $("#text").hide();
  $("#addwall").hide();
  $(".addBtn").show();
  $("#large").show(100);
  $("#small").show(200);
  $("#rotate").show(300);
  //$("delete").show();
  Itemmode();
  if(mode) savetoline();
  mode = 1;
}

var liston = 0;
function help(){
  if(helpmode==0){
    if(mode==0){
      $(".helppic.1").show();
    }
    else{
      $(".helppic.2").show();
    }
    helpmode = 1;
  }
  else{ 
    hide();
    helpmode = 0;
  }
}

function hide(){
  $(".helppic").hide();
}

canvas.on('object:scaling', function(options) {
   var target = options.target;
   console.log(options);
   console.error(target.width);
      var w = target.width * target.scaleX,
      h = target.height * target.scaleY,
      snap = {      // Closest snapping points
         top: Math.round(target.top / grid) * grid,
         left: Math.round(target.left / grid) * grid,
         bottom: Math.round((target.top + h) / grid) * grid,
         right: Math.round((target.left + w) / grid) * grid
      },
      threshold = grid,
      dist = {      // Distance from snapping points
         top: Math.abs(snap.top - target.top),
         left: Math.abs(snap.left - target.left),
         bottom: Math.abs(snap.bottom - target.top - h),
         right: Math.abs(snap.right - target.left - w)
      },
      attrs = {
         scaleX: target.scaleX,
         scaleY: target.scaleY,
         top: target.top,
         left: target.left
      };
   switch (target.__corner) {
      case 'tl':
         if (dist.left < dist.top && dist.left < threshold) {
            attrs.scaleX = (w - (snap.left - target.left)) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
            attrs.top = target.top + (h - target.height * attrs.scaleY);
            attrs.left = snap.left;
         } else if (dist.top < threshold) {
            attrs.scaleY = (h - (snap.top - target.top)) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
            attrs.left = attrs.left + (w - target.width * attrs.scaleX);
            attrs.top = snap.top;
         }
         break;
      case 'mt':
         if (dist.top < threshold) {
            attrs.scaleY = (h - (snap.top - target.top)) / target.height;
            attrs.top = snap.top;
         }
         break;
      case 'tr':
         if (dist.right < dist.top && dist.right < threshold) {
            attrs.scaleX = (snap.right - target.left) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
            attrs.top = target.top + (h - target.height * attrs.scaleY);
         } else if (dist.top < threshold) {
            attrs.scaleY = (h - (snap.top - target.top)) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
            attrs.top = snap.top;
         }
         break;
      case 'ml':
         if (dist.left < threshold) {
            attrs.scaleX = (w - (snap.left - target.left)) / target.width;
            attrs.left = snap.left;
         }
         break;
      case 'mr':
         if (dist.right < threshold) attrs.scaleX = (snap.right - target.left) / target.width;
         break;
      case 'bl':
         if (dist.left < dist.bottom && dist.left < threshold) {
            attrs.scaleX = (w - (snap.left - target.left)) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
            attrs.left = snap.left;
         } else if (dist.bottom < threshold) {
            attrs.scaleY = (snap.bottom - target.top) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
            attrs.left = attrs.left + (w - target.width * attrs.scaleX);
         }
         break;
      case 'mb':
         if (dist.bottom < threshold) attrs.scaleY = (snap.bottom - target.top) / target.height;
         break;
      case 'br':
         if (dist.right < dist.bottom && dist.right < threshold) {
            attrs.scaleX = (snap.right - target.left) / target.width;
            attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
         } else if (dist.bottom < threshold) {
            attrs.scaleY = (snap.bottom - target.top) / target.height;
            attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
         }
         break;
   }
   target.set(attrs);
});

function savetoline(){
    var dataURL = canvas.toDataURL();

		$.post('drawSave', {
        hId: hId,
        floor: floor,
    		imgBase64: dataURL,
		}, function(o) {
    		console.log('send');
        window.close();
		});
};

//*********************
$('#save').mousedown(
    function(){
      $(this).attr('src','./image/okicon_2.svg')
    }
)
$('#save').mouseup(
    function(e){
      $(this).attr('src','./image/okicon.svg')
    }
)

function next(){
  $(".text").hide();
  $("#addwall").hide();
  $(".addBtn").show();
  $("#large").show(100);
  $("#small").show(200);
  $("#rotate").show(300);
  //$("delete").show();
  Itemmode();
  $(".back").show();
  $(".next").hide();
  $("#save").show();
}

function back(){
  $(".text").show();
  $("#addwall").show();
  $(".addBtn").hide();
  $("#large").hide(100);
  $("#small").hide(200);
  $("#rotate").hide(300);
  //$("delete").show();
  Wallmode();
  $(".back").hide();
  $(".next").show();
  $("#save").hide();
}
