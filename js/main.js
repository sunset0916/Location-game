const modalGameStart = document.getElementById('gameStartModal');
const modalResult = document.getElementById('resultModal');

const header0 = document.getElementById('gameMode0');
const header1 = document.getElementById('gameMode1');

const messageLat = document.getElementById('messageLat');
const messageLng = document.getElementById('messageLng');

const inputLat = document.getElementById('inputLat');
const inputLng = document.getElementById('inputLng');

const resultMessage = document.getElementById('resultMessage');

var gameMode;
var map;
var marker;
var ansLat;
var ansLng;
var myLat;
var myLng;
var resultLat;
var resultLng;

document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

window.onload = function () {
    function disableScroll(event) {
        event.preventDefault();
    }
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.addEventListener('mousewheel', disableScroll, { passive: false });
}

$(function () {
    function initMap() {
        var pos = { lat: 0, lng: 0 };
        var opts = {
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(pos),
            keyboardShortcuts: false,
            gestureHandling: "greedy",
            clickableIcons: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        };
        map = new google.maps.Map(document.getElementById("map"), opts);
    }

    initMap();

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(0,0),
        map: map
    });

    google.maps.event.addListener(map, 'click', mapListener);

    function mapListener(event){
        if(gameMode == 1){
            myLat = Math.round(event.latLng.lat());
            myLng = Math.round(event.latLng.lng());
            marker.setPosition(new google.maps.LatLng(myLat,myLng));
        }
    }
});

function startGame(){
    inputLat.value = 0;
    inputLng.value = 0;
    ansLat = generateLat();
    ansLng = generateLng();
    myLat = 0;
    myLng = 0;
    gameMode = $('input[name=gameMode]:checked').val();
    if(gameMode == 0){
        header1.style.display = 'none';
        header0.style.display = 'block';
        map.setCenter(new google.maps.LatLng(ansLat,ansLng));
        createMarker(ansLat,ansLng);
    }else{
        header0.style.display = 'none';
        header1.style.display = 'block';
        messageLat.textContent = ansLat;
        messageLng.textContent = ansLng;
        createMarker(0,0);
    }
    modalGameStart.style.display = 'none';
}

function generateLat(){
    if(Math.round(Math.random()) == 0){
        return Math.round(Math.random() * 90);
    }else{
        return Math.round(Math.random() * 90) * -1;
    }
}

function generateLng(){
    if(Math.round(Math.random()) == 0){
        return Math.round(Math.random() * 180);
    }else{
        return randomLng = Math.round(Math.random() * 180) * -1;
    }
}

function inputCheckLat(){
    if(inputLat.value == ''){
        inputLat.value = 0;
    }else if(inputLat.value < -90){
        inputLat.value = -90;
    }else if(inputLat.value > 90){
        inputLat.value = 90;
    }
    myLat = inputLat.value;
}

function inputCheckLng(){
    if(inputLng.value == ''){
        inputLng.value = 0;
    }else if(inputLng.value < -180){
        inputLng.value = -180;
    }else if(inputLat.value > 180){
        inputLng.value = 180;
    }
    myLng = inputLng.value;
}

function createMarker(lat, lng){
    marker.setPosition(null);
    var markerLatLng = new google.maps.LatLng(lat,lng);
    marker = new google.maps.Marker({
        position: markerLatLng,
        map: map
    });
}

function toResult(){
    resultLat = differenceLat(ansLat,myLat);
    resultLng = differenceLng(ansLng,myLng);
    resultMessage.textContent = '緯度' + resultLat + '度、経度' + resultLng + 'の差でした！'
    modalResult.style.display = 'block';
}

function differenceLat(aLat,mLat){
    var rLat = aLat - mLat;
    if(rLat < 0){
        rLat *= -1;
    }
    return rLat;
}

function differenceLng(aLng,mLng){
    if((aLng < 0 && mLng < 0) || (aLng > 0 && mLng > 0) || aLng == 0 || mLng == 0){
        var rLng = aLng - mLng;
    }else{
        if(aLng < 0){
            var lng0 = mLng - aLng;
            var lng180 = (180 - mLng) - (-180 - aLng);
        }else{
            var lng0 = aLng - mLng;
            var lng180 = (180 - aLng) - (-180 - mLng);
        }
        if(lng0 < lng180){
            var rLng = lng0;
        }else{
            var rLng = lng180;
        }
    }
    if(rLng < 0){
        rLng *= -1;
    }
    return rLng;
}

function retryGame(){
    modalResult.style.display = 'none';
    modalGameStart.style.display = 'block';
}

function postToTwitter(){
    const shareUrl = 'https://twitter.com/share?url=https://locagame.sunset0916.net&text=私のスコアは%20%0a緯度:' + resultLat + '度%20%0a経度:' + resultLng + '度%20%0aの差でした！%20%0a%20%0a下記URLから緯度経度当てゲームに挑戦！%20%0a';
    window.open(new URL(shareUrl));
}

function copyToClipboard() {
    var text = '私のスコアは\n緯度:' + resultLat + '度\n経度:' + resultLng + '度\nの差でした！\n\n下記URLから緯度経度当てゲームに挑戦！\nhttps://locagame.sunset0916.net';
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('Copy');
    document.body.removeChild(textarea);
}

$(document).ready(function () {
    hsize = $(window).height();
    headerSize = $('#gameMode0').height();
    $('#header').css("height", headerSize + "px");
    $('#map').css("height", (hsize - headerSize) - 10 + "px");
});

$(window).resize(function () {
    hsize = $(window).height();
    headerSize = $('#gameMode0').height();
    $('#header').css("height", headerSize + "px");
    $('#map').css("height", (hsize - headerSize) - 10 + "px");
});