function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyDaGUPSr4asMfHt_Qlie01vzbpl8B35nBo',
    'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    'clientId': '37348095959-i0nd20ns5vklh6q2drb7mf2am83vqou4.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/spreadsheets.readonly',
  }).then(function() {
    // 3. Initialize and make the API request.
    makeList();
  }, function(error) {
      appendPre(JSON.stringify(error, null, 2));
  });
};

function makeList() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: "1ZLdvkWefFzPAZtWy8s6GG2HN17eRvJdH-LvL3Uqbeoc",
    range: "Board Games Database!A:B"
  }).then((response) => {
    let result = response.result;
    let numRows = result.values ? result.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
  });
}

// 1. Load the JavaScript client library.
gapi.load('client', start);
