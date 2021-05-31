// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filtersPlayed = document.getElementById('filtersPlayed');
const filtersMode = document.getElementById('filtersMode');
let spreadsheet;
const filtersList = []; //array with all existent filter values
let filtersValues = []; //array with filter values that are checked

// ------------------------------------- CODE ------------------------------------- //
function generateFilters() {
  let playedList, modeList;
  for (let i = 0; i < spreadsheet.length; i++) {
    let item = spreadsheet[i];
    playedList = bla(item[4]);
    modeList = bla(item[5]);
  }
  displayFilters(playedList, filtersMode);
  displayFilters(modeList, filtersPlayed);
  const checkboxesNode = document.querySelectorAll('.checkbox');
  const checkboxesArray = Array.from(checkboxesNode);
  checkboxesArray.forEach((checkbox) => {
    checkbox.addEventListener('change', selectFilter);
  });
}

function bla(category) {
  for (let j = 0; j < category.length; j++) {
    let filterName = category[j].trim();
    if (!filtersList.includes(filterName)) {
      filtersList.push(filterName);
    }
  }
  return filtersList;
}

function displayFilters(filtersList, container) {
  const htmlString = filtersList.map((item) => {
    return `
    <li>
      <input type="checkbox" id="${item}" class="checkbox" value="${item}">
      <label for="${item}">${item}</label>
      <br>
    </li>`;
  }).join('');
  container.innerHTML = htmlString;
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
function isFilterIncluded(item) {
  if (filtersValues.length > 0) {
    for (let i = 0; i < item.Mode.length; i++) {
      let mode = item.Mode[i];
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
    const filteredItems = spreadsheet.filter((item) => {
      return (
        (item.Game.toLowerCase().includes(searchString) ||
        isStringIncluded(item.Players, searchString) ||
        isStringIncluded(item.Mode, searchString)) &&
        isFilterIncluded(item)
      );
    });
    console.log(filteredItems);
    return filteredItems;
  } else {
    const filteredItems = spreadsheet.filter((item) => {
      return (
        isFilterIncluded(item)
      );
    });
    console.log(filteredItems);
    return filteredItems;
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

function displayResults(searchResult) {
  const htmlString = searchResult.map((item) => {
    return `
    <li class="item-complete">
      <img src="${item[6]}" class="item-img"></img>
      <div class="item-content">
        <h2 class="item-title">${item[0]}</h2>
        <p class="item-text">Players: ${item[1]}</p>
        <p class="item-text">Mode: ${item[5]}</p>
      </div>
    </li>`;
  }).join('');
  resultsList.innerHTML = htmlString;
}