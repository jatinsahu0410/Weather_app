console.log("we are ready to go");

const API_KEY = "7aecd2e772ded37b44ff7e90583034b2";

async function showweather() {

    try {
        let city = "Indore";

        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await result.json();

        console.log(" weather data: ->", data);

        let para = document.createElement('p');
        para.textContent = `${data?.main?.temp.toFixed(2)} C`

        document.body.appendChild(para);

        // functtion 2 which will render data on UI
        // renderWeatherInfo(data);
    } catch (error) {
        console.log("wrong Api key", error);
    }
}

showweather();

async function getCustomWeatherDetails(){
    let lat = 29.553;
    let lon = 92.782;

    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    let data = await response.json();

    console.log("custom data : ->", data);
}

getCustomWeatherDetails();

// to find the current location by using Geolocation Api 
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("access not grant");
    }
}

function showposition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    console.log(latitude,longitude);
}