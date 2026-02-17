const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFound = document.querySelector(".not-found");
const searchCity = document.querySelector(".search-city");
const weatherInfo = document.querySelector(".weather-info");
const countryText = document.querySelector(".country-text");
const tempText = document.querySelector(".temp-text");
const conditionText = document.querySelector(".condition-text");
const humidityText = document.querySelector(".humidity-value-text");
const windValue = document.querySelector(".wind-value-text");
const weatherSummary = document.querySelector(".weather-summary-img");
const currentDate = document.querySelector(".current-date-text");
const forecastItems = document.querySelector(".forcat-items-container");

const apiKey = "e7197f286c5e9f8b88198d36ac15a9a5";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

currentDate.textContent = getCurrentDate();

async function getFetchData(endpoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&units=metric&lang=fa&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  return response.json();
}

async function updateWeatherInfo(city) {
  const weatherDate = await getFetchData("weather", city);
  if (weatherDate.cod !== 200) {
    showDisplaySection(notFound);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherDate;

  countryText.textContent = country;
  tempText.textContent = Math.round(temp) + " °C";
  conditionText.textContent = main;
  humidityText.textContent = humidity + "%";
  windValue.textContent = Math.round((speed * 3600) / 1000) + " Km/h";

  weatherSummary.src = `weather/${getWeatherIcon(id)}`;

  await updateForcatInfo(city);
  showDisplaySection(weatherInfo);
}

async function updateForcatInfo(city) {
  forecastItems.innerHTML = "";

  const forcatData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forcatData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecatItem(forecastWeather);
    }
  });
}

function updateForecatItem(weatherDate) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherDate;

  const dateTaken = new Date(date);
  const dateOptions = {
    day: "2-digit",
    month: "short",
  };

  const dateResult = dateTaken.toLocaleDateString("en-US", dateOptions);

  const forecastItem = `
    <div class="forcast-item">
      <h5 class="forcast-item-data regular-text">${dateResult}</h5>
      <img src="weather/${getWeatherIcon(id)}" class="forcast-item-img" />
      <h5 class="forcast-item-temp">${Math.round(temp)}</h5>
    </div>
  `;

  forecastItems.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfo, searchCity, notFound].forEach(
    (section) => (section.style.display = "none"),
  );

  section.style.display = "flex";
}
