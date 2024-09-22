const timezone = document.getElementById('time-zone');
const country = document.getElementById('country');
const timeA1 = document.getElementById('time');
const dateA1 = document.getElementById('date');

const weatherToday = document.getElementById('weather-today');
const weatherForecast = document.getElementById('weather-forecast');
const cityWeatherInfo = document.getElementById('city-weather-info');

const temperatureDay = document.getElementById('temperatureDay');
const temperatureNight = document.getElementById('temperatureNight');

const apiKey = '5ac1c2edb972ce9e2704a02be3153cc6';
const timeZoneApiKey = '49bb1574b4da4c28bc95d8aeee6f1e0e';

// api call: https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//get api call:https://api.geoapify.com/v1/geocode/reverse?lat={lat}&lon={lon}&apiKey={API key}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];  


//setInterval function without setting interval to have it run every 1 second



setInterval(() => {
    const timeCurrent = new Date();
    const hour = timeCurrent.getHours();
    const hoursHours = hour >=13 ? hour % 12 : hour;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const minutes = timeCurrent.getMinutes(); 
    const day = timeCurrent.getDay();
    const month = timeCurrent.getMonth();
    const date = timeCurrent.getDate();

    const hours = hoursHours < 10 ? '0' + hoursHours : hoursHours; 
    const minutes_ = minutes < 10 ? '0' + minutes : minutes; //converting the time to 12 hour format with 0 in front of single digit
    
    timeA1.innerHTML = `${hours}:${minutes_} <span id="pm-am">${amPm}</span>` //Changing time of the HTML from JS
    dateA1.innerHTML = `${days[day]}, ${date} ${months[month]}`
}, 1000);


function getWeatherDate(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((success) => {
            //  console.log(success);
            //object destructuring

            let {latitude, longitude} = success.coords;
            //  console.log(latitude, longitude);

            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(data =>{
                console.log(data);
                showWeatherData(data);
                // timezone.innerHTML = data.timezone; //calling showWeatherData function with data parameter
            })

            fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${timeZoneApiKey}`)
            .then(response => response.json())
            .then(result =>{
                // console.log(result);
                country.innerHTML = result.features[0].properties.city + `, ` + result.features[0].properties.country;
                timezone.innerHTML = result.features[0].properties.timezone.name + `, ` + result.features[0].properties.timezone.offset_DST;
                })
            .catch(error => console.log('error', error));
        }, (error) => {
            console.log(error);
            alert('Please allow location access');
        });
    } else {
        alert('Please allow location access (the search function still works)');
        console.log('Geolocation is not supported by your browser');
    }
}
//calling getWeatherDate function to get weather data
getWeatherDate();

//function to show weather data
function showWeatherData(data){
    let {humidity, pressure, wind_speed, sunrise, sunset} = data.current;

    const Sunrise_timeStamp = sunrise;
    const Sunset_timeStamp = sunset;

    const timeSunrise = new Date(Sunrise_timeStamp * 1000).toLocaleTimeString();
    const timeSunset = new Date(Sunset_timeStamp * 1000).toLocaleTimeString();

    cityWeatherInfo.innerHTML = `
                    <div class="weather-info" id="weather-info">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
            
                    <div class="weather-info" id="weather-info">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
            
                    <div class="weather-info" id="weather-info">
                        <div>Wind</div>
                        <div>${wind_speed}</div>
                    </div>
            
                    <div class="weather-info" id="weather-info">
                        <div>Sunrise</div>
                        <div>${timeSunrise}</div>
                    </div>
            
                    <div class="weather-info" id="weather-info">
                        <div>Sunset</div>
                        <div>${timeSunset}</div>
                    </div>`

                    //replacing the innerHTML of div with the api given weather data


    
    let otherDays = ''

    data.daily.forEach((day, idx) => {
        const timeCurrent = new Date();
        const dayA1 = ((timeCurrent.getDay() + idx) % 7); //printing all the days of the week in forecast
        // console.log(idx)
        if(idx = 0){
            weatherToday.innerHTML = 
            `
            <div id="weather-today" id="current-temp">
                <img class="t-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon">
                <div class="night">SSAD</div>
                <div class="temperature">Day - ${day.temp.day}° C</div>
                <div class="temperature">Night - ${day.temp.night}° C</div>
            </div>
            `
        }else{
            otherDays += 
            `
            <div class="future-weather-forecast" id="future-weather-forecast">          
                <div class="night">${days[dayA1]}</div>
                <img class="t-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon">
                <div class="temperatureDay" id="temperatureDay">Day : ${day.temp.day}° C</div>
                <div class="temperatureNight" id="temperatureNight">Night : ${day.temp.night}° C</div>
   
            </div>
            `
        }
    })

    weatherForecast.innerHTML = otherDays;
    
    // const changeTemp = document.getElementById('change-unit');
    // changeTemp.addEventListener('click', ()=>{
    //     for(const i = 0; i <= 8; i++){
    //         const temperatureDay = otherDays[i].querySelector('.temperatureDay');
    //         const temperatureNight = otherDays[i].querySelector('.temperatureNight');

    //         const dayTempCelcius = Number(temperatureDay.textContent.split(' ')[1]);
    //         const nightTempCelcius = Number(temperatureNight.textContent.split(' ')[1]);

    //         const dayTempFahrenheit = Math.round((dayTempCelcius * (9/5)) + 32);
    //         const nightTempFahrenheit = Math.round((nightTempCelcius * (9/5)) + 32);

    //         temperatureDay.textContent = `Day : ${dayTempFahrenheit}° F`;
    //         temperatureNight.textContent = `Night : ${nightTempFahrenheit}° F`;
    //     }
    // });



}



const searchData = document.getElementById('search-form');
searchData.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.getElementById('search-input').value.trim();
    if(location){
        fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${timeZoneApiKey}`)
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            const latitude = result.features[0].geometry.coordinates[1];
            const longitude = result.features[0].geometry.coordinates[0];
            // console.log(latitude, longitude);
            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(data =>{
                // console.log(data);
                showWeatherData(data);
                country.innerHTML = result.features[0].properties.city ? result.features[0].properties.city + `, ` + result.features[0].properties.country: result.features[0].properties.country;
                timezone.innerHTML = result.features[0].properties.timezone.name + `, ` + result.features[0].properties.timezone.offset_DST;
            })
        })
        .catch(error => console.log('error', error));
    }
})

