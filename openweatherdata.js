const regexZipCode   = /^(\d{5})$/;
const regexCityState = /^\s*([\w\s]+)\s*,\s*([\w\s]+)\s*$/i;
const regexState     = /^(?:[A-Za-z]{2}|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/i;

const STATE_ABBREVIATIONS = {"Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};

const API_KEY = '5ba71ce449f4d7fe5a132fd6b5251ed1';
const DEFAULTS = { zipcode: '02140', city: 'Cambridge', state: 'MA' };


    const convertStateToAbbreviation = (state) =>
        {
        return regexState.test(state) ? STATE_ABBREVIATIONS[state] || state : 'MA';
        }


    const fetchWeatherData = async (OpenWeatherMapQueryString) =>
        {
        try
            {
            const response = await fetch(OpenWeatherMapQueryString);

            if (!response.ok) throw new Error('Weather data not found.');

            const data = await response.json();

            if (!data.sys || !data.sys.sunrise || !data.sys.sunset)
                {
                throw new Error('Sunrise and sunset data not available.');
                }

            return data;
            }

        catch (error)
            {
            return `Fetch Error: ${error.message}`;
            }
        };


    const getWeatherQueryString = (input = "") =>
        {
        const cleanInput = input.replace(/\s*,\s*/g, ",").replace(/([^\w\s,]*)/g, "").trim().replace(/(\s)+/g," ");

        let query = "";

        switch (true)
            {
            case regexZipCode.test(cleanInput):

                let zipcode = cleanInput.match(regexZipCode)[0].trim().replace(/\s+/g, ' ');

                query = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${API_KEY}&units=imperial&lang=en`;
                break;

            case regexCityState.test(cleanInput):

                let citystate = cleanInput.match(regexCityState);

                query = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(citystate[1])},${encodeURIComponent(convertStateToAbbreviation(citystate[2]))},us&appid=${API_KEY}&units=imperial&lang=en`;
                break;

            default:

                query = `https://api.openweathermap.org/data/2.5/weather?zip=${DEFAULTS.zipcode},us&appid=${API_KEY}&units=imperial&lang=en`;
                break;
            }

        return query;
        }


    const isNightOrDay = (time, sunrise, sunset) =>
        {
      // Get the current hour and minute
        const currentHour = time.getHours();
        const currentMinute = time.getMinutes();

     // Get sunrise and sunset hours (you need to set these values according to your location)
        const sunriseHour = sunrise.getHours(); // Example sunrise hour
        const sunriseMinute = sunrise.getMinutes(); // Example sunrise minute
        const sunsetHour = sunset.getHours(); // Example sunset hour
        const sunsetMinute = sunset.getMinutes(); // Example sunset minute

     // Convert sunrise and sunset times to minutes for easier comparison
        const sunriseTime = sunriseHour * 60 + sunriseMinute;
        const sunsetTime = sunsetHour * 60 + sunsetMinute;
        const currentTime = currentHour * 60 + currentMinute;

     // Check if it's night or day
        return (currentTime >= sunsetTime || currentTime < sunriseTime) ? 'Night' : 'Day';
        }


    function handleWeatherData()
        {
        var tagPrompt = document.getElementById("prompt");
        var tagDataQuery = document.getElementById("dataQuery");
        var tagResult = document.getElementById("result");

        var inputString = '';
        var queryString = getWeatherQueryString(inputString);

        fetchWeatherData(queryString)
        .then((data) =>
            {
            console.log(inputString);
            console.log(queryString);
            console.log(data);

            const now = new Date();
            const sunriseTime = new Date(data.sys.sunrise * 1000);
            const sunsetTime = new Date(data.sys.sunset * 1000);
            const sunMode = isNightOrDay (now, sunriseTime, sunsetTime);
            const weatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            const weatherDescription = data.weather[0].description;

         // Check if the element exists before manipulating it
            if (tagPrompt && tagDataQuery && tagResult)
                {
             // Replace the current contents with new content
                tagPrompt.innerHTML = "Prompt: " + (inputString ? inputString : "DEFAULT");
                tagDataQuery.innerHTML = "Query: " + queryString;
                tagResult.innerHTML = "Result: " +
                    '<ul>' +
                    '<li>' + 'Time: ' + now.toLocaleTimeString() + '</li>' +
                    '<li>' + 'Sunrise: ' + sunriseTime.toLocaleTimeString() + '</li>' +
                    '<li>' + 'Sunset: ' + sunsetTime.toLocaleTimeString() + '</li>' +
                    '<li>' + 'SunMode: ' + sunMode + '</li>' +
                    '<li>' + 'Icon: ' + weatherDescription + '<br><img id="weatherIcon" src="'+ weatherIcon + '" alt="Weather Icon">' + '</li>' +
                    '</ul>';
                }
            else
                {
                console.error("Spectacular fail! Game over!");
                }
            })
        .catch((error) =>
            {
            console.error("Error handling weather data:", error.message);
            });
        }


    function handleOnLoadEvent()
        {
        handleWeatherData();
        }

    // function handleRefreshEvent ()
    //     {
    //     }

window.addEventListener('load', handleOnLoadEvent);

/**/
// console.log("Query:  New ^$#  Boston  , New   Hampshire    | Result: ", getWeatherQueryString("  New ^$#  Boston  , New   Hampshire   "));
// console.log("");
// console.log("Query:   New Boston  , NH | Result: ", getWeatherQueryString("  New Boston  , NH"));
// console.log("");
// console.log("Query:  02140  | Result: ", getWeatherQueryString(" 02140  "));
// console.log("");
// console.log("Query: | Result: ", getWeatherQueryString());
/**/



