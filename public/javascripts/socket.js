// Make connection

var hostname = "";

if (window.location.hostname === "gist1.herokuapp.com") {
    hostname = "https://gist1.herokuapp.com";
} else {
    hostname = "http://localhost:3000";
}

var socket = io.connect(hostname);


// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
// } else {
//     alert("Your Brouser is out of fashion, no support this browser");
// }

function onGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
    } else {
        alert("Your Brouser is out of fashion, no support this browser");
    }
}

var firstClick = document.getElementById('refresh');
firstClick.addEventListener("click", onGeolocation)

function positionSuccess(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var acr = position.coords.accuracy;
    console.log(lat, lng, acr);
    var btn = document.getElementById('refresh');
    btn.removeEventListener("click", onGeolocation)
    btn.addEventListener("click", function () {
        var sentData = {
            coords: {
                lat: lat,
                lng: lng,
                acr: acr
            }
        };
        socket.emit("send:coords", sentData);
    });
}



function positionError(error) {
    var errors = {
        1: 'Authorization fails', // permission denied
        2: 'Can\'t detect your location', //position unavailable
        3: 'Connection timeout' // timeout
    };
    showError('Error:' + errors[error.code]);
}
function showError(msg) {
    // create a function show error on client
    console.log(msg);
}


function updateItem(data) {
    var listGroup = document.querySelector(".list-group");
    while (listGroup.firstChild) {
        // clear old items
        listGroup.removeChild(listGroup.firstChild);
    }
    data.forEach(function(item) {
        var listGroupItem = document.createElement("div");
        var star = document.createElement("span");
        var starEmpty = document.createElement("span");
        var facilities = function (fac) {
            let facilities = "";
            for (let i = 0; i < fac.length; i++) {
                facilities += `<span class="label label-warning">${fac[i].title}</span>&nbsp;`
            }
            return facilities;
        }(item.facilities);
        
        star.setAttribute("class", "glyphicon glyphicon-star");
        starEmpty.setAttribute("class", "glyphicon glyphicon-star-empty");
        var rating = function (rat) {
            let rating = "";
            for (let i = 1; i <= rat; i++) {
                rating += star.outerHTML;
            }
            for (let i = rat; i < 5; i++) {
                rating += starEmpty.outerHTML;
            }
            return rating;
        }(item.rating);

        listGroupItem.innerHTML =
        `<h4>
            <a href="/location/${item._id}">${item.name}
            </a>
            <small>&nbsp;
                ${rating}
            </small>
            <span class="badge pull-right badge-default">${item.distance}</span>
        </h4>
        <p class="address">${item.address}</p>
        <p>${facilities}</p>
        `;
        listGroupItem.setAttribute("class", "col-xs-12 list-group-item");
        listGroup.appendChild(listGroupItem);
    });
}


// Emit event
socket.on("load:coords", function (data) {
    console.log("load data:", data);
    updateItem(data);
});
