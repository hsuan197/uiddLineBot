window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

var allData;
var mymap;
var allmarkers = [];
var newmarkers = [];
var seriousmarkers = [];
var notmarkers = [];
var currenmarkers;
var showingLayer;

var sIcon;
var hNum;

$(document).ready(function() {
  var bicon = L.icon({
    iconUrl: 'map/marker_b.png',
    iconSize:     [120, 120],
    iconAnchor:   [60, 120],
    popupAnchor:  [0, -100] 
  });

  var gicon = L.icon({
    iconUrl: 'map/marker_g.png',
    iconSize:     [120, 120],
    iconAnchor:   [60, 120],
    popupAnchor:  [0, -100] 
  }); 

	var oicon = L.icon({
    iconUrl: 'map/marker_o.png',
    iconSize:     [120, 120],
    iconAnchor:   [60, 120],
    popupAnchor:  [0, -100] 
  });

  var ricon = L.icon({
    iconUrl: 'map/marker_r.png',
    iconSize:     [120, 120],
    iconAnchor:   [60, 120],
    popupAnchor:  [0, -100] 
  });

  var yicon = L.icon({
    iconUrl: 'map/marker_y.png',
    iconSize:     [120, 120],
    iconAnchor:   [60, 120],
    popupAnchor:  [0, -100] 
  });

  var icons = [ricon, bicon, gicon, gicon, gicon, yicon, yicon, yicon]
  
  $.get('mapStart', {
    }, (data) => {
      allData = data;
      console.log(allData);

      //資料庫取出的資訊
      var houses = data;
      sIcon = houses.length - 1;
      hNum = houses.length;
      for(let i = 0; i < hNum; i++){
        //放置marker
        var marker = L.marker([houses[i].lat, houses[i].lng], {icon: icons[houses[i].statu - '0']} );//.addTo(mymap);
     		var div_popup = new L.DomUtil.create('div', 'popup');
        div_popup.innerHTML = `<h2 style="font-size:2.8rem;">${houses[i].text}</h2>`;
        if(houses[i].statu < '5')
          div_popup.innerHTML += `<button type="button" onclick="sendStart(${i})" class="pbtn1" id="popupbtn${i}" hid=${i} style="font-size:2.8rem;">開始檢測</button>`;
        else
          div_popup.innerHTML += `<button onclick="lookRecord(${i})" type="button" class="pbtn1" id="popupbtn${i}" hid=${i} style="font-size:2.8rem;">察看結果</button>`;
        div_popup.innerHTML += `<button type="button" class="pbtn2" id="gmapbtn${i}" hid=${i} style="font-size:2.8rem;">前往</button>`;				

        marker.bindPopup(div_popup);
				marker.on('click', clickZoom);

        $(`#gmapbtn${i}`, div_popup).on('click', function() {
          var lat = allmarkers[$(this).attr('hid')].getLatLng().lat;
          var lng = allmarkers[$(this).attr('hid')].getLatLng().lng;
          window.open(`https://www.google.com.tw/maps/search/${lat},${lng}`)
        });


        //put in layers
        //all
        allmarkers.push(marker);
        //not
        if(houses[i].statu == "1"){
          notmarkers.push(marker);
        }
        //new
        parseInt(houses[i].time)
        var time = new Date()
        var now = time.getFullYear() * 10000 + (time.getMonth()+1)*100 + time.getDate();
        if(now - parseInt(houses[i].time) < 100){
          newmarkers.push(marker);
        }
        //serious
        if(houses[i].dangerCrack == true || houses[i].info > 0){
          seriousmarkers.push(marker);
        }
      }

      //set map
      mymap = L.map('mapid', {
        center:[houses[sIcon].lat, houses[sIcon].lng], 
        zoom:15,
      });

      var m = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
        id: 'mapbox.streets',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGlzdHVyYjE5NyIsImEiOiJjanZjcHJ0MXExOGI2M3lubW9rYW0xbXBzIn0.F9Zr5DF_sLsIREPgHCDJCA'
      }).addTo(mymap);
     
      showingLayer = L.layerGroup(allmarkers)
      showingLayer.addTo(mymap);
      currenmarkers = allmarkers;
      allmarkers[sIcon].openPopup();
  })
})

function clickZoom(e) {
  mymap.setView(e.target.getLatLng());
}

function setLayer(num){
  //select markers
  if(num == 0)
    currenmarkers = allmarkers;
  else if(num == 1)
    currenmarkers = newmarkers;
  else if(num == 2)
    currenmarkers = seriousmarkers;
  else if(num == 3)
    currenmarkers = notmarkers;

  //put on map
  mymap.removeLayer(showingLayer);
  showingLayer = L.layerGroup(currenmarkers);
  showingLayer.addTo(mymap);
  
  hNum = currenmarkers.length;
  
  if(currenmarkers.length > 0){
    sIcon = 0;
    currenmarkers[sIcon].openPopup();
    mymap.setView(currenmarkers[sIcon].getLatLng());
  }
}

function lArrow(){
  if(--sIcon <= 0)
    sIcon = hNum - 1;
  currenmarkers[sIcon].openPopup();
  mymap.setView(currenmarkers[sIcon].getLatLng());
}

function rArrow(){
  if(++sIcon >= hNum)
    sIcon = 0
  currenmarkers[sIcon].openPopup();
  mymap.setView(currenmarkers[sIcon].getLatLng());
}

function sendStart(hid){
  console.log(hid);
  liff.sendMessages([{
    type: 'text',
    text: `start_${hid}`
  }]).then(function () {
    window.alert("資料送出");
    liff.closeWindow(); 
  }).catch(function (error) {
    window.alert("Error sending message: " + error);
    liff.closeWindow();
  });
}

function lookRecord(hid){
  window.open(`http://luffy.ee.ncku.edu.tw:12398?hid=${hid}`);
}

