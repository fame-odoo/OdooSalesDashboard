
// https://github.com/itsmefarhan/react-google-sheet-crud/blob/master/src/pages/Home.js
/*https://accounts.google.com/o/oauth2/...
 scope=https://mail.google.com&
 access_type=offline&
 redirect_uri=http://localhost&
 response_type=code&
 client_id=[Client ID]
*/
import React from 'react';
import './App.css';

import { useEffect, useState } from "react";
import { GoogleApiProvider } from 'react-gapi'
import {GoogleLogin} from 'react-google-login'
import { useGoogleApi } from 'react-gapi'
import {google} from 'googleapis'
const SHEET_ID = '1tBskVCa3IGrJ7jBlUq5kwhtNMFG6YqrSC7-W3hbmLyw';
const ACCESS_TOKEN = 'ya29.a0AVA9y1ublSlwY0Xg7U6-fASVl3qHQcRWFz6CtrHIVMtJSI-Qkww3zospGsVMm2aAdbRTj6V3hcDJ-lJrfk_4LPbXGxc2DkaECUSzM0jhda0HPbFNltbS_c4YzAz0cMktp4LYKcTixBhRTW42MD4xs9kx5GQu'
window.googleDocCallback = function () { return true; };
const App=()=> {
  const [data, setData] = useState();
   const UpdateSheetValues= async ()=>{
    

    let val = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/sheet1?majorDimension=ROWS`, {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        //update this token with yours. 
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    })
    
    // const d = await val.json()
    console.log(val.json())
    // setData(Object.keys(d).map((key) => data[key]));

    // console.log(data)
  }

  return (
    
     <>
     
      <div className = "App" >
        hello world 
        <button onClick={UpdateSheetValues}>Update A1</button>
      </div>
    

  </>)
}

export default App;


// get("url")
// .then((response) => {
//   console.log(response.data)
// })
