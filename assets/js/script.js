var APIKey = "0ba3133cb694a7de240bc9e5f4fceed2";
var forecast = document.querySelector("#forecast-cards");
var searchBtn = document.querySelector("#search-btn");
var cityList = document.querySelector("#city-list");



searchBtn.addEventListener("click", function(event){
    event.preventDefault();

    while (cityList.hasChildNodes()){
        cityList.removeChild(cityList.firstChild);
    }

    var userInput = document.querySelector("#user-input").value;
    var checkUserInput = parseInt(userInput);

    if(isNaN(checkUserInput)){
        getCityName(userInput);
    }
    else{
        getZipCode(userInput);
    }

});

function getCityName(userInput){
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+userInput+"&limit=5&appid="+APIKey;
    var cityLongitude;
    var cityLatitude;
    var cityArray = [];

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        for(var i = 0; i < data.length; i++){
            var cityListItem = document.createElement("button");
            cityListItem.setAttribute("type", "button");
            cityListItem.setAttribute("data-array-index", i);
            cityListItem.setAttribute("class", "list-group-item list-group-item-action list-group-item-secondary");
            if(data[i].state === undefined || data[i].country !== "US"){
                cityListItem.textContent = data[i].name+", "+data[i].country;
            }
            else{
                cityListItem.textContent = data[i].name+", "+data[i].state;
            }
            cityArray.push(data[i]);
            cityList.appendChild(cityListItem);
        }
        cityList.style.display = "flex";

        document.addEventListener("click", function(event){
            event.preventDefault();
            const target = event.target.closest(".list-group-item");

            if(target){
                var cityArrayIndex = parseInt(target.getAttribute("data-array-index"));
                cityLatitude = cityArray[cityArrayIndex].lat;
                cityLongitude = cityArray[cityArrayIndex].lon;

                getWeather(cityLatitude, cityLongitude);
            }
            
            
            
        })
    })
}


function getZipCode(userInput){
    var requestUrl = "http://api.openweathermap.org/geo/1.0/zip?zip="+userInput+",US&appid="+APIKey;
    
    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
}

function getWeather(lat, lon){
    var requestURl = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+APIKey+"&units=imperial";

    fetch(requestURl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })

}