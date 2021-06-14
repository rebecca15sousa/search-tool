// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filtersPlayed = document.getElementById('filtersPlayed');
const filtersMode = document.getElementById('filtersMode');
const capsuleFiltersDiv = document.getElementById('capsuleFiltersDiv');
let spreadsheet;
const sortBtn = document.getElementById('sortBtn');
const dropContent = document.getElementById('dropContent');
let valuesComplex = []; //array with complexity filter values that are checked
let valuesPlayed = []; //array with played filter values that are checked
let valuesMode = []; //array with mode filter values that are checked

let noNumber = 0;
let yesNumber = 0;
let sortValue;
// ------------------------------------- CODE ------------------------------------- //
//"Sort by" button functionality
sortBtn.addEventListener('click', toggleSortBy);

function toggleSortBy() {
  dropContent.classList.toggle("show");
}

window.addEventListener('click', closeSortBy);

function closeSortBy(e) {
  if (!e.target.matches('#sortBtn')) {
    dropContent.classList.remove("show");
  }
}

//Sorting functionality
dropContent.addEventListener('click', getSortValue);

function getSortValue(e) {
  let target = e.target;
  sortValue = target.getAttribute("data-value");
  let searchResult = getResults();
  displayResults(searchResult);
}

function sortItems(filteredItems) {
  if (sortValue == "Yes") {
    sortYes(filteredItems);
  } else if (sortValue == "No") {
    sortNo(filteredItems);
  }
}

function countYes(filteredItems) {
  yesNumber = 0;
  for (let i = 0; i < filteredItems.length; i++) {
    let item = filteredItems[i];
    let key = item[4];
    for (let j = 0; j < key.length; j++) {
      if (key[j] == "Yes") {
        yesNumber++;
      }
    }
  }
}

function sortNo(filteredItems) {
  countYes(filteredItems);
  for (let i = 0; yesNumber > 0; i++) {
    let item = filteredItems[i];
    let key = item[4];
    for (let j = 0; j < key.length; j++) {
      if (key[j] == "Yes") {
        let temp = item;
        filteredItems.splice(i, 1);
        filteredItems.push(temp);
        i--;
        yesNumber--;
      }
    }
  }
}

function countNo(filteredItems) {
  noNumber = 0;
  for (let i = 0; i < filteredItems.length; i++) {
    let item = filteredItems[i];
    let key = item[4];
    for (let j = 0; j < key.length; j++) {
      if (key[j] == "No") {
        noNumber++;
      }
    }
  }
}

function sortYes(filteredItems) {
  countNo(filteredItems);
  for (let i = 0; noNumber > 0; i++) {
    let item = filteredItems[i];
    let key = item[4];
    for (let j = 0; j < key.length; j++) {
      if (key[j] == "No") {
        let temp = item;
        filteredItems.splice(i, 1);
        filteredItems.push(temp);
        i--;
        noNumber--;
      }
    }
  }
}

function generateFilters() {
  let playedList, modeList, complexityList, sortByList;
  complexityList = getFiltersList("3");
  playedList = getFiltersList("4");
  modeList = getFiltersList("5");
  sortByList = getFiltersList("4");
  displaySortBy(sortByList, dropContent);
  displayFilters(complexityList, capsuleFiltersDiv, 3, "radio");
  const capsulesNode = document.querySelectorAll('.radio-input');
  const capsulesArray = Array.from(capsulesNode);
  capsulesArray.forEach((capsule) => {
    capsule.addEventListener('change', activateCapsule);
  });
  displayFilters(playedList, filtersPlayed, 4, "checkbox");
  displayFilters(modeList, filtersMode, 5, "checkbox");
  const checkboxesNode = document.querySelectorAll('input[type=checkbox]');
  const checkboxesArray = Array.from(checkboxesNode);
  checkboxesArray.forEach((checkbox) => {
    checkbox.addEventListener('change', selectFilter);
  });
}

function getFiltersList(category) {
  const filtersList = [];
  for (let i = 0; i < spreadsheet.length; i++) {
    let item = spreadsheet[i];
    let key = item[category];
    for (let j = 0; j < key.length; j++) {
      let filterName = key[j].trim();
      if (!filtersList.includes(filterName)) {
        filtersList.push(filterName);
      }
    }
  }
  return filtersList;
}

function displayFilters(filtersList, container, column, type) {
  const htmlString = filtersList.map((item) => {
    return `
    <li class="${type}-li">
      <input type="checkbox" id="${item}" class="${type}-input" data-column="${column}" value="${item}">
      <label for="${item}" class="${type}-label">${item}</label>
      <br>
    </li>`;
  }).join('');
  container.innerHTML += htmlString;
}

function displaySortBy(sortByList, container) {
  const htmlString = sortByList.map((item) => {
    return `
    <span class="drop-item" data-value="${item}">${item}</span>`;
  }).join('');
  container.innerHTML += htmlString;
}

function activateCapsule(e) {
  let radio = e.target;
  let allRadio = document.querySelectorAll('.radio-input');
  let capAllInput = document.getElementById('All');
  if (radio.checked) {
    for (let i = 0; i < allRadio.length; i++) {
      allRadio[i].checked = false;
    }
    radio.checked = true;
  } else {
    for (let i = 0; i < allRadio.length; i++) {
      allRadio[i].checked = false;
    }
    capAllInput.checked = true;
  }
}

//when filter is checked/unchecked, adds or deletes filter value from array and calls getResults
function selectFilter(e) {
  let filter = e.target;
  let column = filter.getAttribute("data-column");
  let capAllInput = document.getElementById('All');
  if (column == 3) {
    if (filter.checked) {
      valuesComplex = [];
      valuesComplex.push(filter.value);
    } else {
      valuesComplex = [];
      valuesComplex.push(capAllInput.value);
    }
  } else if (column == 4) {
    if (filter.checked) {
      valuesPlayed.push(filter.value);
    } else {
      let index = valuesPlayed.indexOf(filter.value);
      valuesPlayed.splice(index, 1);
    }
  } else if (column == 5) {
    if (filter.checked) {
      valuesMode.push(filter.value);
    } else {
      let index = valuesMode.indexOf(filter.value);
      valuesMode.splice(index, 1);
    }
  }
  let searchResult = getResults();
  displayResults(searchResult);
}

//checks if item contains all checked filters
function isFilterIncluded(item, category, filters) { 
  if (filters.length > 0) {
    if (filters[0] == "All") {
      return true;
    }
    let isMatch = filters.every((val) => item[category].includes(val));
    if (isMatch) {
      return true;
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
        (isStringIncluded(item[0], searchString) ||
        isStringIncluded(item[1], searchString) ||
        isStringIncluded(item[5], searchString)) &&
        isFilterIncluded(item, 3, valuesComplex) &&
        isFilterIncluded(item, 4, valuesPlayed) &&
        isFilterIncluded(item, 5, valuesMode)
      );
    });
    // console.log(filteredItems);
    sortItems(filteredItems);
    return filteredItems;
  } else {
    const filteredItems = spreadsheet.filter((item) => {
      return (
        isFilterIncluded(item, 3, valuesComplex) &&
        isFilterIncluded(item, 4, valuesPlayed) &&
        isFilterIncluded(item, 5, valuesMode)
      );
    });
    // console.log(filteredItems);
    sortItems(filteredItems);
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