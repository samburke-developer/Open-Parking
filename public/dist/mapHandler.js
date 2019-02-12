function getLocations()
{
    var req = new XMLHttpRequest();

    req.onload = function(res) {
        console.log(req.response)
        let locations = req.response.map(spot => 
            {
                let distance = getDistanceFromLatLonInm(window.geoPosition.coords.latitude,window.geoPosition.coords.longitude,spot.lat,spot.lon)
                return {'lat': parseFloat(spot.lat), 'lng': parseFloat(spot.lon), distance: distance }
            })
        locations.sort((a,b) => a.distance - b.distance)
        window.nearestPark = locations[0];
        addMarkers(locations)
        calcRoute();
        document.getElementById('loader').style.visibility = 'hidden';
        document.getElementById('mapsUrl').href = buildGoogleMaspUrl({lat: window.geoPosition.coords.latitude, lng: window.geoPosition.coords.longitude}, window.nearestPark);
        document.getElementById('mapsUrl').style.visibility = 'visible';
    }
    req.open("POST", '/free', true);
    req.setRequestHeader('Content-type','application/json; charset=utf-8');
    req.responseType = "json";
    req.send(JSON.stringify({lat: window.geoPosition.coords.latitude, lng: window.geoPosition.coords.longitude}));
}

function getLocation() 
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function setPosition(position) {
    window.geoPosition = position
    console.log(window.geoPosition)
    initMap();
  }

function addMarkers(locations)
{
    console.log(locations)
    locations.forEach(location => 
        {
            var marker = new google.maps.Marker({
                position: location,
                map: window.map,
            });   
        })
}

function initMap() {
    
    window.directionsService = new google.maps.DirectionsService();
    window.directionsDisplay = new google.maps.DirectionsRenderer();
    window.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: window.geoPosition.coords.latitude, lng: window.geoPosition.coords.longitude},
        zoom: 15,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
        
    });
    window.directionsDisplay.setMap(window.map);

    getLocations();
}

function calcRoute() {
    var currentPos = new google.maps.LatLng(parseFloat(window.geoPosition.coords.latitude), parseFloat(window.geoPosition.coords.longitude));
    var nearestPark = new google.maps.LatLng(window.nearestPark.lat, window.nearestPark.lng);
    var selectedMode = 'DRIVING'
    var request = {
        origin: currentPos,
        destination: nearestPark,
        travelMode: google.maps.TravelMode[selectedMode]
    };
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
  }

function getDistanceFromLatLonInm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function buildGoogleMaspUrl (origin, destination)
{
    let url = 'https://www.google.com/maps/dir/?api=1&'
    let textOrigin = `origin=${origin.lat},${origin.lng}&`
    let textDestination = `destination=${destination.lat},${destination.lng}&`
    let travelMode = `travelmode=driving`
    return url + textOrigin + textDestination + travelMode;
}