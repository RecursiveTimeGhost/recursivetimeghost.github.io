const regexZipCode   = /^(\d{5})$/;
const regexCityState = /^\s*([\w\s]+)\s*,\s*([\w\s]+)\s*$/i;
const regexState     = /^(?:[A-Za-z]{2}|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/i;

const STATE_ABBREVIATIONS = {"Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};

const API_KEY = '5ba71ce449f4d7fe5a132fd6b5251ed1';
const DEFAULTS = { zipcode: '02140', city: 'Cambridge', state: 'MA' };

function convertStateToAbbreviation(state) {
    return regexState.test(state) ? STATE_ABBREVIATIONS[state] || state : 'MA';
}

    const fetchWeatherData = async (OpenWeatherMapQueryString) =>
        {
        try
            {
            const response = await fetch(OpenWeatherMapQueryString);

            if (!response.ok) throw new Error('Weather data not found.');

            const data = await response.json();

            return JSON.stringify(data);
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

                console.log("MATCHES(zipcode): ", zipcode);

                query = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${API_KEY}&units=imperial&lang=en`;
                break;

            case regexCityState.test(cleanInput):

                let citystate = cleanInput.match(regexCityState);

                console.log("MATCHES(citystate): ", citystate);

                query = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(citystate[1])},${encodeURIComponent(citystate[2])},us&appid=${API_KEY}&units=imperial&lang=en`;
                break;

            default:

                query = `https://api.openweathermap.org/data/2.5/weather?zip=${DEFAULTS.zipcode},us&appid=${API_KEY}&units=imperial&lang=en`;
                break;
            }

        return query;
        }


function handleWeatherData() {
    var tagPrompt = document.getElementById("prompt");
    var tagDataQuery = document.getElementById("dataQuery");
    var tagResult = document.getElementById("result");

    var inputString = '';
    var queryString = getWeatherQueryString(inputString);

    fetchWeatherData(queryString)
        .then((queryResults) => {
            console.log(inputString);
            console.log(queryString);
            console.log(queryResults);

            // Check if the element exists before manipulating it
            if (tagPrompt && tagDataQuery && tagResult) {
                // Replace the current contents with new content
                tagPrompt.innerHTML = "Prompt: " + inputString;
                tagDataQuery.innerHTML = "Query: " + queryString;
                tagResult.innerHTML = "Result: " + queryResults;
            } else {
                console.error("Spectacular fail! Game over!");
            }
        })
        .catch((error) => {
            console.error("Error handling weather data:", error.message);
        });
}

window.addEventListener('load', handleWeatherData);

/**/
// console.log("Query:  New ^$#  Boston  , New   Hampshire    | Result: ", getWeatherQueryString("  New ^$#  Boston  , New   Hampshire   "));
// console.log("");
// console.log("Query:   New Boston  , NH | Result: ", getWeatherQueryString("  New Boston  , NH"));
// console.log("");
// console.log("Query:  02140  | Result: ", getWeatherQueryString(" 02140  "));
// console.log("");
// console.log("Query: | Result: ", getWeatherQueryString());
/**/



