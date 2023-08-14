var APIKey = "0ba3133cb694a7de240bc9e5f4fceed2";
var todayForecast = document.querySelector("#today");
var futureForecast = document.querySelector("#forecast-cards");
var searchBtn = document.querySelector("#search-btn");
var cityList = document.querySelector("#city-list");
var todayDate = new Date();
var day = todayDate.getDate();
var month = todayDate.getMonth() + 1;
todayDate = month+"/"+day;




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
                saveSearch(cityLatitude, cityLongitude);
                cityList.style.display = "none";
            }
            
            
            
        })
    })
}


function getZipCode(userInput){
    var requestUrl = "http://api.openweathermap.org/geo/1.0/zip?zip="+userInput+",US&appid="+APIKey;
    var cityLongitude;
    var cityLatitude;


    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        cityLatitude = data.lat;
        cityLongitude = data.lon;
        getWeather(cityLatitude, cityLongitude);
        saveSearch(cityLatitude, cityLongitude);
    })
}

function getWeather(lat, lon){
    if(futureForecast.children.length > 0){
        document.querySelectorAll('.weather-cards').forEach(e => e.remove());
    }
    var requestURLToday = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+APIKey+"&units=imperial";
    var requestURlFiveDay = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+APIKey+"&units=imperial";

    
    fetch(requestURLToday)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var todayText = document.createElement("h2");
        var todayTemp = document.createElement("p");
        var todayHum = document.createElement("p");
        var todayWind = document.createElement("p");
        var weatherIconElement = document.createElement("img");
        var weatherIcon = "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";

        todayText.setAttribute("class", "weather-cards");
        todayTemp.setAttribute("class", "weather-cards");
        todayHum.setAttribute("class", "weather-cards");
        todayWind.setAttribute("class", "weather-cards");
        weatherIconElement.setAttribute("class", "weather-cards");

        todayText.textContent = data.name+" "+todayDate;
        todayTemp.textContent = "Temp: "+data.main.temp;
        todayHum.textContent = "Humidity: "+data.main.humidity+"%";
        todayWind.textContent = "Wind Speed: "+data.wind.speed+" MPH";
        weatherIconElement.setAttribute("src", weatherIcon);


        todayForecast.appendChild(weatherIconElement);
        todayForecast.appendChild(todayText);
        todayForecast.appendChild(todayTemp);
        todayForecast.appendChild(todayHum);
        todayForecast.appendChild(todayWind);
        futureForecast.style.display = "flex";
        console.log(data);
    });
    
    fetch(requestURlFiveDay)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);  

        for(let x = 0; x < data.list.length; x+= 8){
            var futureText = document.createElement("h5");
            var futureTemp = document.createElement("p");
            var futureHum = document.createElement("p");
            var futureWind = document.createElement("p");
            var i = 0;
            if(x > 0){
                i = x / 8;
            }
            console.log(i);
            var futureForecastCard = document.getElementById("day-"+i);
            var formatDate = data.list[x].dt_txt.slice(6, 10);

            futureText.setAttribute("class", "weather-cards");
            futureTemp.setAttribute("class", "weather-cards");
            futureHum.setAttribute("class", "weather-cards");
            futureWind.setAttribute("class", "weather-cards");

            futureText.textContent = formatDate;
            futureTemp.textContent = "Temp: "+data.list[x].main.temp;
            futureHum.textContent = "Humidity: "+data.list[x].main.humidity+"%";
            futureWind.textContent = "Wind Speed: "+data.list[x].wind.speed;+" MPH";

            futureForecastCard.appendChild(futureText);
            futureForecastCard.appendChild(futureTemp);
            futureForecastCard.appendChild(futureHum);
            futureForecastCard.appendChild(futureWind);

        }
    })

}

function saveSearch(lat , lon){
    return;
}