var {google} = require('googleapis');
let privatekey = require("./credentials.json");
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets',
     'https://www.googleapis.com/auth/drive',
     'https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
if (err) {
console.log(err);
return;
} else {
console.log("Successfully connected!");
}
});
let spreadsheetId = '1tBskVCa3IGrJ7jBlUq5kwhtNMFG6YqrSC7-W3hbmLyw';
let sheetName = 'Sheet1!A1:B'
let sheets = google.sheets('v4');
sheets.spreadsheets.values.get({
   auth: jwtClient,
   spreadsheetId: spreadsheetId,
   range: sheetName
}, function (err, response) {
   if (err) {
       console.log('The API returned an error: ' + err);
   } else {
       console.log('Movie list from Google Sheets:');
       console.log(response.data)
       for (let row of response.data.values) {
           console.log('Title [%s]\t\tRating [%s]', row[0], row[1]);
       }
   }
});
