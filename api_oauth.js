const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const PROPERTIES_PARH='properties.json'
const PROPERTIES =JSON.parse(fs.readFileSync(PROPERTIES_PARH))
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), retrieve_overall_info_sales);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
  
    
    // console.log(JSON.parse(fileproperties).sheet_id)
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
   async function retrieve_overall_info_sales(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  var years = PROPERTIES.sheet_id

  let SHEET_ID=''
  let overall_data_every_year = {}
  for(var year of Object.keys(years)){
    let yearly_data = await makeapicall(years,year,sheets)
    // console.log(yearly_data)
    
    overall_data_every_year[year]=yearly_data
    
}
var jsonData = JSON.stringify(overall_data_every_year);
console.log(jsonData)
fs.writeFile('overall_sales_data.json', jsonData, 'utf8', write_callback);
// console.log(overall_data_every_year)
}
const write_callback=(err,res)=>{
  if(err){
    console.log("error writing to file",err)
  }
  return res
}
async function makeapicall(years,year,sheets){

    SHEET_ID = years[year]

  let values = (await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'US-DSBU!A3:K',
  })).data;
  const rows = values.values;
  let overall_data ={}
    if (rows.length) {
      rows.map((row) => {
        if(row[0]){
        overall_data[row[0]]={
          "actual_mrr":row[2],
          "actual_nrr":row[3],
          "target_mrr":row[4],
          "target_nrr":row[5],
          "achieve_mrr":row[6],
          "achieve_nrr":row[7],
          "new_ent_sold":row[10]
        }
      }
      });
      console.log("sdfsdf",year)
  
    } else {
      console.log('No data found.');
    }
  // console.log(overall_data)
  
  return overall_data
}
