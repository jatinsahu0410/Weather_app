const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchFrom]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorpage = document.querySelector(".errorpage");
// Initail variable needed
const API_KEY = "7aecd2e772ded37b44ff7e90583034b2";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();
// switching function for switching tabs

function switchTab(clickedTab){
    errorpage.classList.remove("active");
    // if clicked tab is diff from current tab
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");  
        }
        else{
            // search pe tha me your weather pe aana hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // for current coordinates 
            getfromSessionStorage();
        }
    }
}

// Event listener for switching tabs
userTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    // pass clicked tab
    switchTab(searchTab);
});

// check if coords are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinate");
    if(!localCoordinates){
        // if coordinate are not present then we have to show grant location container
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

const errorImg = document.querySelector("[data-notfoundimg]");
const errorMessage = document.querySelector("[data-apierrorText]");

// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }
  
// get  the info of weather 
 async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant location invisilbe to loading icon
    grantAccessContainer.classList.remove('active');
    // loading icon visible till api send data
    loadingScreen.classList.add("active");

    // /API call
    try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await result.json();
        // if permission is denied or erroe then stop the process by using throw function 
        if(!data.sys){
            throw data;
        }
        // now loader screen ko remove kar do
        loadingScreen.classList.remove("active");
        // to show data make the UI of show weather info visiblle
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        errorpage.classList.add("active");
        errorImg.style.display ="none";
        errorMessage.innerText = `Error : ${error?.message}`;
        showError();
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-humidity]");
    const humidity = document.querySelector("[data-windspeed]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // /fetch values from weather info and fill it in UI 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// finding current location bu using geolocation api
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("get the location");
    }
    else{
        grantAccessContainer.classList.remove("active");
        messageText.innerText ="Geolocation feature is not supported by your browswer";
    }
}

function showPosition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinate", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

// Event listener on grant btn to get th current location weather
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) => {
    e.preventDefault();

    let CityName = searchInput.value;
    if(CityName === ""){
        return;
    }else{
        fetchSearchWaetherInfo(searchInput.value)
    }
});

async function fetchSearchWaetherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorpage.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
          }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        errorpage.classList.add("active");
        errorMessage.innerText = `${error?.message}`;
    }
}
