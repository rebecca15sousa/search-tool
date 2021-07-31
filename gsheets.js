const sheetIdSubmit = document.getElementById('sheetIdSubmit');
const sheetIdCancel = document.getElementById('sheetIdCancel');
const sheetIdInput = document.getElementById('sheetIdInput');
const sheetIdModal = document.getElementById('sheetIdModal');
const changeIdBtn = document.getElementById('changeIdBtn');
const columnsForm = document.getElementById('columnsForm');
const formSubmit = document.getElementById('formSubmit');
const formCancel = document.getElementById('formCancel');
let formInputs = [];
const filterTitle1 = document.getElementById('filterTitle1');
const filterTitle2 = document.getElementById('filterTitle2');

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
    let firstLine = completeList[0];
    createFilterTitle(firstLine, filterTitle1, 3);
    createFilterTitle(firstLine, filterTitle2, 4);
    let gameList = [];
    for (let i = 1; i < completeList.length; i++) {
      // Creates a new game object and adds it to list.
      let item = completeList[i];
      let itemParsed = new Object();
      for (let j = 0; j < formInputs.length; j++) {
        let letter = formInputs[j];
        let index = letter.charCodeAt(0) - 97;
        itemParsed[j] = splitArray(item[index], j);
      }
      gameList.push(itemParsed);
    }
    spreadsheet = gameList;
    displayResults(spreadsheet);
    generateFilters();
  });
}

function splitArray(array, j) {
  if (array) {
    if (j == 2 || j == 3 || j == 4) {
      return array.split(", ");
    } else {
      return array;
    }
  } else {return "";}
}

function createFilterTitle(firstLine, filterTitle, i) {
  let letter = formInputs[i];
  let index = letter.charCodeAt(0) - 97;
  filterTitle.textContent = firstLine[index];
}

// Loads the Google Sheets API library.
changeIdBtn.addEventListener('click', function() {
  sheetIdModal.style.display = "block";
});

sheetIdSubmit.addEventListener('click', function() {
  if (sheetIdInput.value != "") {
    sheetIdModal.style.display = "none";
    columnsForm.style.display = "block";
    let url = new URL(sheetIdInput.value);
    let urlArray = url.pathname.split('/');
    sheetIdInput.value = urlArray[3];
  }
});

sheetIdCancel.addEventListener('click', function() {
  sheetIdModal.style.display = "none";
});

formSubmit.addEventListener('click', function() {
  columnsForm.style.display = "none";
  const formItems = document.querySelectorAll('.form-items');
  formInputs = [];
  for (let k = 0; k < formItems.length; k++) {
    let input = formItems[k].value.toLowerCase();
    formInputs.push(input);
  }
  localStorage.setItem("ID", sheetIdInput.value);
  localStorage.setItem("formInputs", JSON.stringify(formInputs));
  gapi.load('client', start);
});

formCancel.addEventListener('click', function() {
  columnsForm.style.display = "none";
});

if (localStorage.getItem("ID")) {
  sheetIdModal.style.display = "none";
  sheetIdInput.value = localStorage.getItem("ID");
  formInputs = JSON.parse(localStorage.getItem("formInputs"));
  gapi.load('client', start);
}