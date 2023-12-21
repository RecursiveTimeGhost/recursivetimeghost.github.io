// const isDayLightTime = (current, sunrise, sunset) =>
//   {
//   const sunriseTime = sunrise.getHours() * 60 + sunrise.getMinutes();
//   const sunsetTime  = sunset.getHours()  * 60 + sunset.getMinutes();
//   const currentTime = current.getHours()    * 60 + timestamp.getMinutes();

//   return (currentTime >= sunsetTime || currentTime < sunriseTime) ? true : false;
//   }

// const displayWeatherMetaData = (metadata) =>
//   {
//   // Get the reference to the UL element
//   var list = document.getElementById('metadata');

//   if (!list) throw new Error("List element "+ list.id +" not found.");

//   for (var p in metadata)
//     {
//     if (metadata.hasOwnProperty(p))
//       {
//       var listItem = document.createElement("li");
//       listItem.textContent = p + ": " + metadata[p];
//       list.appendChild(listItem);
//       }
//     }
//   }

//const clickFeedback = (event) => console.log({type: event.type, content: event.target.textContent});


function handleOnLoadEvent()
  {
  fetchOpenWeatherMapAPIData()
    .then((data) =>
      {
      console.log(data);
      })
    .catch((error) =>
      {
      console.error("Error: " + error.message);
      });
  }

window.addEventListener('load', handleOnLoadEvent);

// PREVIOUS SNIPPETS THAT MIGHT BE REUSED OR REPURPOSED
// const METADATA =
//     {
//     options: Object.freeze({dark: "DARK", light: "LIGHT"}),
//     };

// const hhmmss_est = new Intl.DateTimeFormat('en-US', {timeZone: 'America/New_York', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric'});
// const date_timezone = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' });
// const timestamp = new Date(data.dt * 1000);
// const sunriseTime = new Date(data.sys.sunrise * 1000);
// const sunsetTime = new Date(data.sys.sunset * 1000);
// const sunMode = detectSunMode (timestamp, sunriseTime, sunsetTime);

// const jsonData =
//   {
//   name: data.name,
//   timestamp: data.dt,
//   sunrise: data.sys.sunrise,
//   sunset: data.sys.sunset,
//   isDayLightTime: isDayLightTime (data.dt, data.sys.sunrise, data.sys.sunset),
//   id: data.weather[0].id,
//   main: data.weather[0].main,
//   description: data.weather[0].description,
//   icon: data.weather[0].icon,
//   };
