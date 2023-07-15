
// For a deploy, setup the BE first and then get the API URL

// DEV-Local
// export const API_URL = "http://localhost:5000"

//! PROD
//export const API_URL = "https://blue.api.tarkovgunsmith.com"

//? DEV-TEST
// export const API_URL = "https://api.dev.tarkovgunsmith.com"

// for (const envVar in process.env) {
//     console.log(`${envVar}: ${process.env[envVar]}`);
//   }

// console.log(process.env.REACT_APP_WISHGRANTER_API_URL);

var api: string = process.env.REACT_APP_WISHGRANTER_API_URL ?? ''
var API: string = '';

var AEC_LocalStorage_Key = 'TarkovGunsmith_AEC_Default';
// empty strings are falsy/falsey
if (api) 
{ 
     API = api;
     AEC_LocalStorage_Key = "TarkovGunsmith_AEC";
}
else 
{ 
    API = "http://localhost:5000"

}

if(api === 'http://localhost:5000'){
    AEC_LocalStorage_Key = "TarkovGunsmith_AEC_DEV";
}
else{
    AEC_LocalStorage_Key = "TarkovGunsmith_AEC";
}

export const API_URL = API;
export const AEC_LS_KEY = AEC_LocalStorage_Key;