const OpenWeatherMapAPIQueryString = (request = '02140') =>
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
  const queryByCityState = (cty,st) => {return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cty)},${encodeURIComponent(convertStateToAbbreviation(st))},us&appid=5ba71ce449f4d7fe5a132fd6b5251ed1&units=imperial&lang=en`;}
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