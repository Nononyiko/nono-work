function formatDateTime(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}`;
}

function updateDateTime() {
  const now = new Date();
  const dateElement = document.querySelector("#current-date");
  if (dateElement) {
    dateElement.textContent = formatDateTime(now);
  }
}

updateDateTime();
setInterval(updateDateTime, 60000);

function showLoadingState() {
  document.querySelector("#loading-spinner").style.display = "inline-block";

  document.querySelector("#city-name").textContent = "";
  document.querySelector("#temp-value").textContent = "";
  document.querySelector("#weather-description").textContent = "";
  document.querySelector("#wind-value").textContent = "";
  document.querySelector("#weather-icon").style.display = "none";
}

function displayWeather(response) {
  const data = response.data.data || response.data;

  const temperature = data.temperature ? Math.round(data.temperature.current) : "--";
  const city = data.city || "Unknown city";
  const description = data.condition ? data.condition.description : "";
  const windSpeed = data.wind ? Math.round(data.wind.speed) : null;
  const iconCode = data.condition ? data.condition.icon : "";

  document.querySelector("#loading-spinner").style.display = "none";

  document.querySelector("#city-name").textContent = city;
  document.querySelector("#temp-value").textContent = temperature !== "--" ? `${temperature}°C` : "--°C";
  document.querySelector("#weather-description").textContent = description;
  document.querySelector("#wind-value").textContent = windSpeed !== null ? `${windSpeed} km/h` : "";

  if (iconCode) {
    const iconUrl = `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${iconCode}.png`;
    const iconElement = document.querySelector("#weather-icon");
    iconElement.src = iconUrl;
    iconElement.alt = description;
    iconElement.style.display = "block";
  } else {
    document.querySelector("#weather-icon").style.display = "none";
  }
}

function showError() {
  document.querySelector("#loading-spinner").style.display = "none";
  document.querySelector("#city-name").textContent = "";
  document.querySelector("#temp-value").textContent = "--°C";
  document.querySelector("#weather-description").textContent = "City not found. Please try again.";
  document.querySelector("#wind-value").textContent = "";
  document.querySelector("#weather-icon").style.display = "none";
}

function searchCity(city) {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(city)}&key=${apiKey}&units=metric`;

  showLoadingState();

  axios.get(apiUrl)
    .then(displayWeather)
    .catch((error) => {
      showError();
      console.error("API error:", error);
    });
}

function handleSearch(event) {
  event.preventDefault();
  const input = document.querySelector("#search-input").value.trim();
  if (input) {
    searchCity(input);
  }
}

document.querySelector("#search-form").addEventListener("submit", handleSearch);

// Initial load
searchCity("Pretoria");
