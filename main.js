// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filtersListDiv = document.getElementById('filtersListDiv');
let bgList;
const filtersList = []; //array with all existent filter values
let filtersValues = []; //array with filter values that are checked

// ------------------------------------- CODE ------------------------------------- //
function generateFilters() {
  for (let i = 0; i < bgList.length; i++) {
    let bg = bgList[i];
    for (let j = 0; j < bg.Mode.length; j++) {
      let filterName = bg.Mode[j].trim();
      if (!filtersList.includes(filterName)) {
        filtersList.push(filterName);
      }
    }
  }
  displayFilters(filtersList);
  const checkboxesNode = document.querySelectorAll('.checkbox');
  const checkboxesArray = Array.from(checkboxesNode);
  checkboxesArray.forEach((checkbox) => {
    checkbox.addEventListener('change', selectFilter);
  });
}

function displayFilters(filtersList) {
  const htmlString = filtersList.map((item) => {
    return `
    <li>
      <input type="checkbox" id="${item}" class="checkbox" value="${item}">
      <label for="${item}">${item}</label>
      <br>
    </li>`;
  }).join('');
  filtersListDiv.innerHTML = htmlString;
}

//performs search action if filter is checked/unchecked
function selectFilter(e) {
  let filter = e.target;
  if (filter.checked) {
    filtersValues.push(filter.value);
  } else {
    let index = filtersValues.indexOf(filter.value);
    filtersValues.splice(index, 1);
  }
  let searchResult = getResults();
  displayResults(searchResult);
}

//checks if filter value is the same as array element from spreadsheet
function isFilterIncluded(bg) {
  if (filtersValues.length > 0) {
    for (let i = 0; i < bg.Mode.length; i++) {
      let mode = bg.Mode[i];
      for (let j = 0; j < filtersValues.length; j++) {
        if (mode == filtersValues[j]) {
          return true;
        }
      }
    }
  } else {
    return true;
  }
}

function getResults() {
  const searchString = searchBar.value.toLowerCase();
  const searchLenght = searchBar.value.length;
  if (searchLenght >= 3) {
    const filteredBgs = bgList.filter((bg) => {
      return (
        (bg.Game.toLowerCase().includes(searchString) ||
        isStringIncluded(bg.Players, searchString) ||
        isStringIncluded(bg.Mode, searchString)) &&
        isFilterIncluded(bg)
      );
    });
    console.log(filteredBgs);
    return filteredBgs;
  } else {
    const filteredBgs = bgList.filter((bg) => {
      return (
        isFilterIncluded(bg)
      );
    });
    console.log(filteredBgs);
    return filteredBgs;
  }
}

searchBar.addEventListener('keyup', () => {
    let searchResult = getResults();
    displayResults(searchResult);
});

//checks if search value is included in array element from spreadsheet
function isStringIncluded(array, string) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].toLowerCase().includes(string)) {
      return true;
    }
  }
}

function displayResults(bgs) {
  const htmlString = bgs.map((bg) => {
    return `
    <li class = "game">
      <h2>${bg.Game}</h2>
      <p>Players: ${bg.Players}</p>
      <p>Mode: ${bg.Mode}</p>
      <img src="${bg.Picture}"></img>
    </li>`;
  }).join('');
  resultsList.innerHTML = htmlString;
}