// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filtersPlayed = document.getElementById('filtersPlayed');
const filtersMode = document.getElementById('filtersMode');
const capsuleFiltersDiv = document.getElementById('capsuleFiltersDiv');
let spreadsheet;
const sortBtn = document.getElementById('sortBtn');
const dropContent = document.getElementById('dropContent');
const filtersList = []; //array with all existent filter values
let filtersValues = []; //array with filter values that are checked

// ------------------------------------- CODE ------------------------------------- //
//Sort by button functionality
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
  for (let i = 0; i < spreadsheet.length; i++) {
    let item = spreadsheet[i];
    complexityList = bla(item[3]);
    playedList = bla(item[4]);
    modeList = bla(item[5]);
  }
  displayCapsule(complexityList, capsuleFiltersDiv);
  const capsulesNode = document.querySelectorAll('.radio-input');
  const capsulesArray = Array.from(capsulesNode);
  capsulesArray.forEach((capsule) => {
    capsule.addEventListener('change', activateCapsule);
  });
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