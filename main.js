// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filtersPlayed = document.getElementById('filtersPlayed');
const filtersMode = document.getElementById('filtersMode');
const capsuleFiltersDiv = document.getElementById('capsuleFiltersDiv');
let spreadsheet;
const sortBtn = document.getElementById('sortBtn');
const dropContent = document.getElementById('dropContent');
// const filtersList = []; //array with all existent filter values
// let filtersValues = []; //array with filter values that are checked
let valuesPlayed = [];
let valuesMode = [];

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

function generateFilters() {
  let playedList, modeList, complexityList;
  complexityList = bla("3");
  playedList = bla("4");
  modeList = bla("5");
  displayCapsule(complexityList, capsuleFiltersDiv);
  const capsulesNode = document.querySelectorAll('.radio-input');
  const capsulesArray = Array.from(capsulesNode);
  capsulesArray.forEach((capsule) => {
    capsule.addEventListener('change', activateCapsule);
  });
  displayFilters(playedList, filtersPlayed, 4);
  displayFilters(modeList, filtersMode, 5);
  const checkboxesNode = document.querySelectorAll('.checkbox');
  const checkboxesArray = Array.from(checkboxesNode);
  checkboxesArray.forEach((checkbox) => {
    checkbox.addEventListener('change', selectFilter);
  });
}

function bla(category) {
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

function displayFilters(filtersList, container, column) {
  const htmlString = filtersList.map((item) => {
    return `
    <li>
      <input type="checkbox" id="${item}" class="checkbox" data-column="${column}" value="${item}">
      <label for="${item}">${item}</label>
      <br>
    </li>`;
  }).join('');
  container.innerHTML = htmlString;
}

//TEMPORARY
function displayCapsule(filtersList, container) {
  const htmlString = filtersList.map((item) => {
    return `
    <li class="radio-li">
      <input type="radio" id="${item}" class="radio-input" name="capsule" value="${item}">
      <label for="${item}" class="radio-label">${item}</label>
      <br>
    </li>`;
  }).join('');
  container.innerHTML = htmlString;
}

function activateCapsule(e) {
  let radio = e.target;
  let label = radio.nextElementSibling;
  console.log(label);
  let allLabel = document.querySelectorAll('.radio-label');
  if (radio.checked) {
    for (let i = 0; i < allLabel.length; i++) {
      allLabel[i].classList.remove("active");
    }
    label.classList.add("active");
  }
}

//when filter is checked/unchecked, adds or deletes filter value from array and calls getResults
function selectFilter(e) {
  let filter = e.target;
  let column = filter.getAttribute("data-column");
  if (column == 4) {
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
        (item.Game.toLowerCase().includes(searchString) ||
        isStringIncluded(item.Players, searchString) ||
        isStringIncluded(item.Mode, searchString)) &&
        isFilterIncluded(item, 4, valuesPlayed) &&
        isFilterIncluded(item, 5, valuesMode)
      );
    });
    console.log(filteredItems);
    return filteredItems;
  } else {
    const filteredItems = spreadsheet.filter((item) => {
      return (
        isFilterIncluded(item, 4, valuesPlayed) &&
        isFilterIncluded(item, 5, valuesMode)
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