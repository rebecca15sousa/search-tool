const sheetIdBtn = document.getElementById('sheetIdBtn');
const sheetIdInput = document.getElementById('sheetIdInput');
const sheetIdModal = document.getElementById('sheetIdModal');
const changeIdBtn = document.getElementById('changeIdBtn');
const columnsForm = document.getElementById('columnsForm');
const formBtn = document.getElementById('formBtn');
let formInputs = [];

function start() {
  // Initializes the Google Sheets API library.
  gapi.client.init({
    'apiKey': 'AIzaSyDaGUPSr4asMfHt_Qlie01vzbpl8B35nBo',
    'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    'clientId': '37348095959-i0nd20ns5vklh6q2drb7mf2am83vqou4.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/spreadsheets.readonly',
  }).then(function() {
    parseSheet(sheetIdInput.value);
  });
};

function parseSheet(spreadsheetId) {
  // Reads values on the spreadsheet, starting from row 1.
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: "A:Z"
  }).then((response) => {
    let completeList = response.result.values;
    let gameList = [];
    for (let i = 1; i < completeList.length; i++) {
      // Creates a new game object and adds it to list.
      let item = completeList[i];
      let itemParsed = new Object();
      for (let j = 0; j < item.length; j++) {
        let index = formInputs[j];
        itemParsed[j] = splitArray(item[index]);
      }
      gameList.push(itemParsed);
    }
    spreadsheet = gameList;
    displayResults(spreadsheet);
    generateFilters();
  });
}

function splitArray(array) {
  if (array) {
    return (array.length > 1) ? array.split(",") : array;
  } else {return "";}
}

// Loads the Google Sheets API library.
changeIdBtn.addEventListener('click', function() {
  sheetIdModal.style.display = "block";
});

sheetIdBtn.addEventListener('click', function() {
  if (sheetIdInput.value != "") {
    sheetIdModal.style.display = "none";
    columnsForm.style.display = "block";
    localStorage.setItem("ID", sheetIdInput.value);
  }
});

formBtn.addEventListener('click', function() {
  columnsForm.style.display = "none";
  const formItems = document.querySelectorAll('.form-items');
  formInputs = [];
  for (let k = 0; k < formItems.length; k++) {
    let input = formItems[k].value;
    formInputs.push(input);
  }
  localStorage.setItem("formInputs", JSON.stringify(formInputs));
  gapi.load('client', start);
});

if (localStorage.getItem("ID")) {
  sheetIdModal.style.display = "none";
  sheetIdInput.value = localStorage.getItem("ID");
  formInputs = JSON.parse(localStorage.getItem("formInputs"));
  gapi.load('client', start);
}