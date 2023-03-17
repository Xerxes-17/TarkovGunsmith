
// For a deploy, setup the BE first and then get the API URL

// DEV-Local
// export const API_URL = "http://localhost:5000"

//! PROD
//export const API_URL = "https://blue.api.tarkovgunsmith.com"

//? DEV-TEST
// export const API_URL = "https://api.dev.tarkovgunsmith.com"


var api: string = process.env.GITHUB_API_URL ?? ''
var API: string = '';
// empty strings are falsy/falsey
if (api) 
{ 
     API = api;
}
else 
{ 
    API = "http://localhost:5000"
}

export const API_URL = API;