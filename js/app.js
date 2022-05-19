var $elementoIpAdress = $("#ip-adress .info")
var $elementoLocation = $("#location .info")
var $elementoTimezone = $("#timezone .info")
var $elementoISP = $("#isp .info")
var lat;
var long;
var map
var marker
var $inputSearch = $("#InputSearch")
var $btnSearch = $("#btnSearch")
var api_key = "at_xkPDmv14KVUhYzHV6AOAjqTT0Yd55";

$(function () {
    InicializarMapa()
    InicializarBtnSearch()
});

function InicializarMapa(){

    lat = -15.793889
    long = -47.882778

    if(map === undefined){
        map = L.map('map', {
            center: [lat, long],
            zoom: 13
        });
    }

    var marker = L.marker([lat, long]).addTo(map);

	var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
    }).addTo(map);

    var circle = L.circle([lat, long], {
        color: '#4C52B2',
        fillColor: '#4C52B2',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
}
   
function InicializarBtnSearch(){
    $btnSearch.on("click", function(){
        
        let ip = PegarValorInput()
        if(ip != ''){
            BuscarDados(ip)
        }
    })
}

function PegarValorInput(){
    let value = $inputSearch.val()
    return value
}

function Resultado(data){
    var location = data.location;
    $elementoIpAdress.html(data.ip)
    $elementoLocation.html(location.region + ", " + location.country + " " + location.postalCode)
    $elementoTimezone.html("UTC "+ location.timezone)
    $elementoISP.html(data.isp)

}

function AplicarSkeleton(){
    let nodeSkeletonText = $(`<div class="skeleton skeleton-text"></div>`)
    
    $(".box-info .info").text("")
    $(".box-info").append(nodeSkeletonText)
}

function RemoverSkeleton(){
    $(".skeleton").remove()
}

function BuscarDados(ip){
    $.ajax({
        url: "https://geo.ipify.org/api/v1",
        data: {apiKey: api_key, ipAddress: ip},
        beforeSend: function(){
            AplicarSkeleton()
        },
        success: function(data) {
            RemoverSkeleton()
            Resultado(data)
            console.log(data)
            LoadMap(data.location.lat, data.location.lng)
        },
        timeout: 86000 // sets timeout to 86 seconds
    });
}

function LoadMap(lat, long){
    map.flyTo([lat, long], 13)
    L.marker([lat, long]).addTo(map);
}
