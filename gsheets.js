function start() {
  // Initializes the Google Sheets API library.
  gapi.client.init({
    'apiKey': 'AIzaSyDaGUPSr4asMfHt_Qlie01vzbpl8B35nBo',
    'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    'clientId': '37348095959-i0nd20ns5vklh6q2drb7mf2am83vqou4.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/spreadsheets.readonly',
  }).then(function() {
    parseSheet("1ZLdvkWefFzPAZtWy8s6GG2HN17eRvJdH-LvL3Uqbeoc");
  });
};

function parseSheet(spreadsheetId) {
  // Reads values on the spreadsheet, starting from row 2.
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: "A2:Z"
  }).then((response) => {
    let completeList = response.result.values;
    let gameList = [];
    for (let i=0; i < completeList.length; i++) {
      // Creates a new game object and adds it to list.
      let item = completeList[i];
      let game = new Game(item[0], item[1], item[5], item[6]);
      gameList.push(game);
    }
    bgList = gameList;
    displayResults(bgList);
    generateFilters();
  });
}

function Game(title, players, mode, picture) {
  this.Game = title;
  this.Players = splitArray(players);
  this.Mode = splitArray(mode);
  this.Picture = picture;
}

function splitArray(array) {
  if (array) {
    return (array.length > 1) ? array.split(",") : array;
  } else {return "";}
}

// Loads the Google Sheets API library.
gapi.load('client', start);
