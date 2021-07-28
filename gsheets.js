const sheetIdSubmit = document.getElementById('sheetIdSubmit');
const sheetIdCancel = document.getElementById('sheetIdCancel');
const sheetIdInput = document.getElementById('sheetIdInput');
const sheetIdModal = document.getElementById('sheetIdModal');
const changeIdBtn = document.getElementById('changeIdBtn');
const columnsForm = document.getElementById('columnsForm');
const formBtn = document.getElementById('formBtn');
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
    for (let k = 0; k < firstLine.length; k++) {
      let index = formInputs[k];
      if (k == 3) {
        filterTitle1.textContent = firstLine[index];
      } else if (k == 4) {
        filterTitle2.textContent = firstLine[index];
      }
    }
    let gameList = [];
    for (let i = 1; i < completeList.length; i++) {
      // Creates a new game object and adds it to list.
      let item = completeList[i];
      let itemParsed = new Object();
      for (let j = 0; j < item.length; j++) {
        let index = formInputs[j];
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
    localStorage.setItem("ID", sheetIdInput.value);
  }
});

sheetIdCancel.addEventListener('click', function() {
  sheetIdModal.style.display = "none";
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