import './styles.css';

// gets unprocessed (i will obviously not use all of it) weather data.
async function getWeatherData(location){
  try{
    // sends a request to api. returns a promise.
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=1f04c74792054bc1b1f134424231407&q=${location}&days=3&aqi=no&alerts=no`,
      {mode: 'cors'}  
    );
    // promise resolves with datastream parsed as JSON.
    const weatherData = await response.json();
    return weatherData;
  }
  catch(err){
    console.log(err);
  }
}

// current day's weather data.
function processDataToday(data){

  return {
    locationName: data.location.name,
    text: data.current.condition.text,
    icon: data.current.condition.icon,
    tempCelcius: data.current.temp_c,
  };
}
// a 3 day forecast.
function processDataForecast(data){
  const forecastday0 = data.forecast.forecastday[0];
  const forecastday1 = data.forecast.forecastday[1];
  const forecastday2 = data.forecast.forecastday[2];

  const forecastday0Processed = {
    icon: forecastday0.day.condition.icon,
    tempCelcius: forecastday0.day.avgtemp_c,
    text: forecastday0.day.condition.text,
  };
  const forecastday1Processed = {
    icon: forecastday1.day.condition.icon,
    tempCelcius: forecastday1.day.avgtemp_c,
    text: forecastday1.day.condition.text,

  };
  const forecastday2Processed = {
    icon: forecastday2.day.condition.icon,
    tempCelcius: forecastday2.day.avgtemp_c,
    text: forecastday2.day.condition.text,

  };

  return {
    day0: forecastday0Processed,
    day1: forecastday1Processed,
    day2: forecastday2Processed,
  };
}

// appends divs to an existing dom element
function setDOMElement(element, setValue){
  const newDiv = document.createElement('div');
  newDiv.textContent = setValue;
  element.appendChild(newDiv);
}

function createAndAppenmdIMG(src, appendTo){
  const myImage = new Image();
  myImage.src = src;
  appendTo.appendChild(myImage);
}

function removeChildDivs (parent) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}


( async function () {

  const searchButt = document.getElementById('searchButt');
  const searchInput = document.getElementById('search-input');
  const todaysIconArea = document.getElementById('icon');
  const todaysDescription = document.getElementById('description');
  const forecast1 = document.getElementById('day1');
  const forecast2 = document.getElementById('day2');
  const forecast3 = document.getElementById('day3');

  searchButt.addEventListener('click', async function () {
    const unprocessedWeatherData = await getWeatherData(searchInput.value);
    console.log(unprocessedWeatherData);
    const processedCurrentWeatherData = processDataToday(unprocessedWeatherData);
    const processedForecastData = processDataForecast(unprocessedWeatherData);


    // remove the previous values.
    removeChildDivs(todaysIconArea);
    removeChildDivs(todaysDescription);
    removeChildDivs(forecast1);
    removeChildDivs(forecast2);
    removeChildDivs(forecast3);


    // sets today's weather icon.
    const todaysIcon = processedCurrentWeatherData.icon;
    setDOMElement(todaysDescription, 'Today:');
    createAndAppenmdIMG(todaysIcon,todaysIconArea);

    // appends today's info
    for (const property in processedCurrentWeatherData){
      if (property !== 'icon'){
        setDOMElement(todaysDescription, processedCurrentWeatherData[property]);
      }
    }


    // set forecast values
    setDOMElement(forecast1, 'Tomorrow:');
    createAndAppenmdIMG(processedForecastData.day0.icon, forecast1);
    setDOMElement(forecast2, 'The day after:');
    createAndAppenmdIMG(processedForecastData.day1.icon, forecast2);
    setDOMElement(forecast3, 'Too far away:');
    createAndAppenmdIMG(processedForecastData.day2.icon, forecast3);

    // three 'for' loops because i did not think.
    for (const property in processedForecastData.day0){
      if (property !== 'icon'){
        setDOMElement(forecast1, processedForecastData.day0[property]);
      }
    }


    for (const property in processedForecastData.day1){
      if (property !== 'icon'){
        setDOMElement(forecast2, processedForecastData.day1[property]);
      }
    }

    for (const property in processedForecastData.day2){
      if (property !== 'icon'){
        setDOMElement(forecast3, processedForecastData.day2[property]);
      }
    }


    console.log(processedCurrentWeatherData);
    console.log(processedForecastData);
  });

})();




