const OpenWeatherMapAPIQueryString = (request = "") =>
  {
  const regexZipCode = /^(\d{5})$/;
  const regexCityState = /^\s*([\w\s]+)\s*,\s*([\w\s]+)\s*$/i;
  const regexState = /^(?:[A-Za-z]{2}|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/i;
  const STATE_ABBREVIATIONS = {"Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};
  const formatRequest = (i) => {return i.replace(/\s*,\s*/g, ",").replace(/([^\w\s,]*)/g, "").trim().replace(/(\s)+/g," ");}
  const isZipCodeRequest = (i) => {return regexZipCode.test(i) ? true : false;}
  const isCityStateRequest = (i) => {return regexCityState.test(i) ? true : false;}
  const convertStateToAbbreviation = (ss) => {return regexState.test(ss) ? STATE_ABBREVIATIONS[ss] : ss;}
  const queryByZipCode = (zzzzz) => {return `https://api.openweathermap.org/data/2.5/weather?zip=${zzzzz},us&appid=5ba71ce449f4d7fe5a132fd6b5251ed1&units=imperial&lang=en`;}
  const queryByCityState = (cty,stt) => {return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(sty)},${encodeURIComponent(convertStateToAbbreviation(stt))},us&appid=5ba71ce449f4d7fe5a132fd6b5251ed1&units=imperial&lang=en`;}
  const req = formatRequest(request);
  let query = null;

  switch (true)
    {
    case isZipCodeRequest(req): query = queryByZipCode(req.match(regexZipCode)[0]); break;
    case isCityStateRequest(req): query = queryByCityState(req.match(regexCityState)[1],req.match(regexCityState)[2]); break;
    default: query = queryByZipCode(formatRequest('02140')); break;
    }

  console.log("OpenWeatherMapAPIQueryString: " + query);
  return query;
  }

const fetchOpenWeatherMapAPIData = async () =>
  {
  const apiQueryString = OpenWeatherMapAPIQueryString();
  const response = await fetch(apiQueryString);

  if (!response.ok) throw new Error('Weather data not found.');

  const result = await response.json();

  return result;
  };

const isDayLightTime = (current, sunrise, sunset) =>
  {
  const sunriseTime = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetTime  = sunset.getHours()  * 60 + sunset.getMinutes();
  const currentTime = current.getHours()    * 60 + timestamp.getMinutes();

  return (currentTime >= sunsetTime || currentTime < sunriseTime) ? true : false;
  }

const extractMetaDataFromResponse = (data) =>
  {
  console.log(data);

  const metadata =
    {
    name: data.name,
    timestamp: data.dt,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    isDayLightTime: isDayLightTime (data.dt, data.sys.sunrise, data.sys.sunset),
    id: data.weather[0].id,
    main: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    };

  console.log(metadata);
  return metadata;
  }

const displayWeatherMetaData = (metadata) =>
  {
  // Get the reference to the UL element
  var list = document.getElementById('metadata');

  if (!list) throw new Error("List element "+ list.id +" not found.");

  for (var p in metadata)
    {
    if (metadata.hasOwnProperty(p))
      {
      var listItem = document.createElement("li");
      listItem.textContent = p + ": " + metadata[p];
      list.appendChild(listItem);
      }
    }
  }

const clickFeedback = (event) =>
  {
  console.log({type: event.type, content: event.target.textContent});
  }

function handleOnLoadEvent()
  {
  try
    {
    fetchOpenWeatherMapAPIData()
    .then((response) =>
      {
      const information = extractMetaDataFromResponse(response);

      displayWeatherInformation(information);

      console.log(metadata);
      })
    .catch((error) =>
      {
      console.error("error.message: " + error.message);
      });

    document.getElementById('light2dark').addEventListener('click', clickFeedback);
    document.getElementById('dark2light').addEventListener('click', clickFeedback);
    }
  catch (error)
    {
    console.error("error.message: " + error.message);
    }
  }

window.addEventListener('load', handleOnLoadEvent);

// PREVIOUS SNIPPETS THAT MIGHT BE REUSED OR REPURPOSED
// const $$ =
//     {
//     mode: Object.freeze({dark: "DARK", light: "LIGHT"}),
//     mode: $$.metadata.darkMode,
//     };

// const detectSunMode = (time, sunrise, sunset) =>
//     {
//     const sunriseTime = sunrise.getHours() * 60 + sunrise.getMinutes();
//     const sunsetTime  = sunset.getHours()  * 60 + sunset.getMinutes();
//     const currentTime = time.getHours()    * 60 + time.getMinutes();

//     return (currentTime >= sunsetTime || currentTime < sunriseTime) ? 'Night' : 'Day';
//     }

// function handleRefreshEvent ()
//     {
//     }

// const hhmmss_est = new Intl.DateTimeFormat('en-US', {timeZone: 'America/New_York', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric'});
// const date_timezone = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' });

// const timestamp = new Date(data.dt * 1000);
// const sunriseTime = new Date(data.sys.sunrise * 1000);
// const sunsetTime = new Date(data.sys.sunset * 1000);
// const sunMode = detectSunMode (timestamp, sunriseTime, sunsetTime);

/**/
// console.log("Query:  New ^$#  Boston  , New   Hampshire    | Result: ", getWeatherQueryString("  New ^$#  Boston  , New   Hampshire   "));
// console.log("");
// console.log("Query:   New Boston  , NH | Result: ", getWeatherQueryString("  New Boston  , NH"));
// console.log("");
// console.log("Query:  02140  | Result: ", getWeatherQueryString(" 02140  "));
// console.log("");
// console.log("Query: | Result: ", getWeatherQueryString());
/**/



