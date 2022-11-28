const modalGameStart = document.getElementById('gameStartModal');
const modalResult = document.getElementById('resultModal');

const headerPlaceToLatLng = document.getElementById('headerPlaceToLatLng');
const headerLatLngToPlace = document.getElementById('headerLatLngToPlace');

const messageLat = document.getElementById('messageLat');
const messageLng = document.getElementById('messageLng');

const inputLat = document.getElementById('inputLat');
const inputLng = document.getElementById('inputLng');

const resultMessage = document.getElementById('resultMessage');

const radioButton = document.getElementsByName('gameMode');

let gameMode = 0;
let map;
let marker;
let ansLat;
let ansLng;
let myLat;
let myLng;
let resultLat;
let resultLng;

document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

function initMap() {
    const pos = { lat: 0, lng: 0 };
    const opts = {
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

function displaySizeChange(){
    const hsize = document.body.clientHeight;
    const modalSize = hsize * 0.7;
    const modalHeaderSizeS = document.getElementById('modal-header-s').clientHeight;
    const modalHeaderSizeR = document.getElementById('modal-header-r').clientHeight;
    let headerSize;
    if(gameMode == 0){
        headerSize = headerPlaceToLatLng.clientHeight;
    }else{
        headerSize = headerLatLngToPlace.clientHeight;
    }
    document.getElementById('header').style.height = headerSize + 'px';
    document.getElementById('map').style.height = (hsize - headerSize) - 10 + 'px';
    document.getElementById('modal-body-s').style.height = modalSize - modalHeaderSizeS + 'px';
    document.getElementById('modal-body-r').style.height = modalSize - modalHeaderSizeR + 'px';
}

function startGame(){
    inputLat.value = 0;
    inputLng.value = 0;
    ansLat = generateLat();
    ansLng = generateLng();
    myLat = 0;
    myLng = 0;
    for(let i = 0; i < radioButton.length; i++){
        if(radioButton.item(i).checked){
            gameMode = radioButton.item(i).value;
        }
    }
    if(gameMode == 0){
        headerLatLngToPlace.style.display = 'none';
        headerPlaceToLatLng.style.display = 'block';
        map.setCenter(new google.maps.LatLng(ansLat,ansLng));
        createMarker(ansLat,ansLng);
    }else{
        headerPlaceToLatLng.style.display = 'none';
        headerLatLngToPlace.style.display = 'block';
        messageLat.textContent = ansLat;
        messageLng.textContent = ansLng;
        map.setCenter(new google.maps.LatLng(0,0));
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
        return Math.round(Math.random() * 180) * -1;
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
    }else if(inputLng.value > 180){
        inputLng.value = 180;
    }
    myLng = inputLng.value;
}

function createMarker(lat, lng){
    marker.setPosition(null);
    const markerLatLng = new google.maps.LatLng(lat,lng);
    marker = new google.maps.Marker({
        position: markerLatLng,
        map: map
    });
}

function toResult(){
    resultLat = differenceLat(ansLat,myLat);
    resultLng = differenceLng(ansLng,myLng);
    resultMessage.textContent = '緯度' + resultLat + '度、経度' + resultLng + '度の差でした！';
    modalResult.style.display = 'block';
    displaySizeChange();
}

function differenceLat(aLat,mLat){
    let rLat = aLat - mLat;
    if(rLat < 0){
        rLat *= -1;
    }
    return rLat;
}

function differenceLng(aLng,mLng){
    let rLng;
    if((aLng < 0 && mLng < 0) || (aLng > 0 && mLng > 0) || aLng == 0 || mLng == 0){
        rLng = aLng - mLng;
    }else{
        let lng0;
        let lng180;
        if(aLng < 0){
            lng0 = mLng - aLng;
            lng180 = (180 - mLng) - (-180 - aLng);
        }else{
            lng0 = aLng - mLng;
            lng180 = (180 - aLng) - (-180 - mLng);
        }
        if(lng0 < lng180){
            rLng = lng0;
        }else{
            rLng = lng180;
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
    displaySizeChange();
}

function postToTwitter(){
    const shareUrl = 'https://twitter.com/share?url=https://locagame.sunset0916.net&text=私のスコアは%20%0a緯度:' + resultLat + '度%20%0a経度:' + resultLng + '度%20%0aの差でした！%20%0a%20%0a下記URLから緯度経度当てゲームに挑戦！%20%0a';
    window.open(shareUrl);
}

function copyToClipboard() {
    const text = '私のスコアは\n緯度:' + resultLat + '度\n経度:' + resultLng + '度\nの差でした！\n\n下記URLから緯度経度当てゲームに挑戦！\nhttps://locagame.sunset0916.net';
    if(navigator.clipboard){
        navigator.clipboard.writeText(text);
    }else{
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy');
        document.body.removeChild(textarea);
    }
}

window.addEventListener('resize', displaySizeChange);
window.addEventListener('load', displaySizeChange);