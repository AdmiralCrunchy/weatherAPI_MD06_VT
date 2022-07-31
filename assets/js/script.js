let searchInput = document.querySelector(`#searchInput`);
let search = document.querySelector(`#search`);
let city = document.querySelector(`#city`)
let previousCity = document.querySelector(`#prevCity`)
let savedCities = [];

//Weather API perameters
const apiId = '&appid=8cf04024f42609087112fc5d82e8a0e1'
let unitMeasure = 'metric';
let unitDegree = 'C';
let unitSpeed = 'KM';
let forecastCount = 0;

searchInput.addEventListener(`click`, event =>{
    event.preventDefault();
    findWeather();
});


function checkUnit(incomingUnit) {
    console.log("first step")
    switch(incomingUnit){
        case 1:
            unitMeasure = 'metric';
            unitDegree = 'C';
            unitSpeed = 'KM';
            console.log('it worked');
            break;
        case 2:
            unitMeasure = 'imperial';
            unitDegree = 'F';
            unitSpeed = 'MPH';
            console.log('it worked 2');
            break;
        default:
            console.log("Error at check Unit");
    }
}

function findWeather() {
    
    const apiUrl = `https://api.`
    const weatherUrl = `openweathermap.org/`
    let forecast = `data/2.5/forecast?q=${search.value}&units=${unitMeasure}${apiId}`
    

    fetch(apiUrl+weatherUrl+forecast).then(function (promise){
        return promise.json();
    }).then(function (weather){
        city.innerHTML = weather.city.name;
        let current = `data/2.5/onecall?lat=${weather.city.coord.lat}&lon=${weather.city.coord.lon}&units=${unitMeasure}${apiId}`
        fetch(apiUrl+weatherUrl+current).then(function (promise){
            return promise.json();
        }).then(function (data){
            
            console.log(data.current.weather[0].icon);
            console.log(`https://${weatherUrl}img/wn/${data.current.weather[0].icon}@2x.png`)

            document.querySelector(`#currentIcon`).setAttribute(`src`,`https://${weatherUrl}img/wn/${data.current.weather[0].icon}@2x.png`)
            let temp = document.querySelector('#currentTemp');
            let humid = document.querySelector('#currentHumid');
            let wind = document.querySelector('#currentWind');
            let uvText = document.querySelector('#currentUV');
            
            temp.innerHTML = `Temperature: ${data.current.temp} °${unitDegree}`;
            humid.innerHTML = `Humidity: ${data.current.humidity}%`;
            wind.innerHTML = `Wind Speed: ${data.current.wind_speed} ${unitSpeed}`;
            uvText.innerHTML = `UV Index Rating: ${data.current.uvi} ${checkUVI(data.current.uvi)}`
            
            createCards(weather, weatherUrl)

        })
    })

}

function checkUVI(number) {

    if(number > 2)
    {
        if(number > 5)
        {
                if(number > 7)
                {
                    return '🟥VERY HIGH🟥 <br> 💀 Limit time in Direct Sunlight!'
                }
                else{
                    return '🟧HIGH🟧 <br> 🥵  Wear Sun Screen!'
                }
        }
        else{
            return '🟨MODERATE🟨 <br> 😐 Be mindful of sun exposure.'
        }
    }
    else{
        return '🟩LOW🟩 <br> 🙂 No Worries!';
    }


}

function createCards(weather, weatherUrl){

    let totalForecast = document.querySelector('#totalForecast');
   
    if(forecastCount == 5)
    {
        forecastCount = 0;
        totalForecast.innerHTML = '';
    }

    for(let i = 0; i < weather.list.length; i+=8)
    {   



        const forecast = document.createElement('h5');
        forecast.innerHTML = moment.unix(weather.list[i].dt).format('M/D/YYYY')
        const forecastIcon = document.createElement('img');
        forecastIcon.src = `https://${weatherUrl}img/wn/${weather.list[i].weather[0].icon}@2x.png`
        const temperature = document.createElement('p');
        temperature.innerHTML = `Temerature: ${weather.list[i].main.temp} °${unitDegree}`;
        const humidity = document.createElement('p');
        humidity.innerHTML = `Humidity: ${weather.list[i].main.humidity}%`;
        const wind = document.createElement('p');
        wind.innerHTML = `Wind Speed: ${weather.list[i].wind.speed} ${unitSpeed}`

        let card = document.createElement("div");
        card.appendChild(forecast);
        card.appendChild(forecastIcon);
        card.appendChild(temperature);
        card.appendChild(humidity);
        card.appendChild(wind);

        card.setAttribute('class', 'card-panel col s11 m12 l2');
        card.style.margin = `10px`;
        card.style.padding = `30px`;


        totalForecast.appendChild(card);
        forecastCount++;
    }

}