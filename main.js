// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filters1 = document.getElementById('filters1');
const filters2 = document.getElementById('filters2');
const capsuleFilters = document.getElementById('capsuleFilters');
let spreadsheet;
const leftCapBtn = document.getElementById('left');
const rightCapBtn = document.getElementById('right');
const sortBtn = document.getElementById('sortBtn');
const arrowIcon = document.getElementById('arrowIcon');
const dropContent = document.getElementById('dropContent');
let valuesComplex = []; //array with complexity filter values that are checked
let valuesPlayed = []; //array with played filter values that are checked
let valuesMode = []; //array with mode filter values that are checked

let noNumber = 0;
let yesNumber = 0;
let sortValue;
// ------------------------------------- CODE ------------------------------------- //
// capsuleFilters.addEventListener('wheel', function(e) {
//   if (e.deltaX < 0) {
//     console.log('esquerda');
//     scrollLeft();
//   } else if (e.deltaX > 0) {
//     console.log('direita');
//     scrollRight();
//   }
// });



leftCapBtn.addEventListener('click', scrollLeft);
rightCapBtn.addEventListener('click', scrollRight);

function scrollLeft() {
  capsuleFilters.scrollBy({
    left: -400,
    behavior: 'smooth'
  });
}

function scrollRight() {
  capsuleFilters.scrollBy({
    left: 400,
    behavior: 'smooth'
  });
}

//"Sort by" button functionality
sortBtn.addEventListener('click', toggleSortBy);

function toggleSortBy() {
  dropContent.classList.toggle("show");
}

window.addEventListener('click', closeSortBy);

function closeSortBy(e) {
  if (!e.target.matches('#sortBtn') && !e.target.matches('#arrowIcon')) {
    dropContent.classList.remove("show");
  }
}

//Sorting functionality
dropContent.addEventListener('click', getSortValue);

function getSortValue(e) {
  let target = e.target;
  sortValue = target.getAttribute("data-value");
  sortBtn.textContent = sortValue;
  sortBtn.appendChild(arrowIcon);
  let searchResult = getResults();
  displayResults(searchResult);
}

function sortItems(filteredItems) {
  let temp = [];
  for (let i = 0; i < filteredItems.length; i++) {
    let item = filteredItems[i];
    let keys = item[3];
    if (keys.some((key) => key == sortValue)) {
      temp.unshift(item);
    } else {
      temp.push(item);
    }
  }
  return temp;
}

function sortDate(filteredItems) {
  for (let i = 0; i < filteredItems.length; i++) {
    let item = filteredItems[i];
    let dateStg = item[7];
    if (dateStg == "Living Document") {
      let dateObj = new Date();
      item[7] = dateObj;
    } else {
      let dateObj = new Date(dateStg);
      item[7] = dateObj;
    }
  }
  if (sortValue == "Newest") {
    const sortedItems = filteredItems.sort((a, b) => b[7] > a[7] ? 1 : -1);
    return sortedItems;
  } else {
    const sortedItems = filteredItems.sort((a, b) => b[7] < a[7] ? 1 : -1);
    return sortedItems;
  }
}

function generateFilters() {
  let filterList1, filterList2, capsuleList, sortByList;
  capsuleList = getFiltersList("2");
  filterList1 = getFiltersList("3");
  filterList2 = getFiltersList("4");
  sortByList = getFiltersList("3");
  displaySortBy(sortByList, dropContent);
  displayFilters(capsuleList, capsuleFilters, 2, "radio");
  const capsulesNode = document.querySelectorAll('.radio-input');
  const capsulesArray = Array.from(capsulesNode);
  capsulesArray.forEach((capsule) => {
    capsule.addEventListener('change', activateCapsule);
  });
  displayFilters(filterList1, filters1, 3, "checkbox");
  displayFilters(filterList2, filters2, 4, "checkbox");
  const checkboxesNode = document.querySelectorAll('input[type=checkbox]');
  const checkboxesArray = Array.from(checkboxesNode);
  checkboxesArray.forEach((checkbox) => {
    checkbox.addEventListener('change', selectFilter);
  });
}

//loops through all cells of a specific collumn and gets every unique element to create a filter list
function getFiltersList(category) {
  const filtersList = [];
  //loops through entire spreadsheet, line by line
  for (let i = 0; i < spreadsheet.length; i++) {
    //item is a complete single line in spreadsheet
    let item = spreadsheet[i];
    //key is a specific cell inside the line
    let key = item[category];
    //loops through specific cell
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
  if (type == "radio") {
    container.innerHTML =  `<li class="radio-li">
    <input type="checkbox" id="All" class="radio-input" data-column="3" value="All">
    <label for="All" id="allLabel" class="radio-label">All</label>
    <br>
  </li>`;
  } else {
    container.innerHTML = "";
  }
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
  if (localStorage.getItem("formDate")) {
    container.innerHTML = `<span class="drop-item" data-value="Newest">Newest</span>
    <span class="drop-item" data-value="Oldest">Oldest</span>`;
  } else {
    container.innerHTML = "";
  }
  const htmlString = sortByList.map((item) => {
    return `
    <span class="drop-item" data-value="${item}">${item}</span>`;
  }).join('');
  container.innerHTML += htmlString;
}

//changes checked status for capsule filters
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
  if (column == 2) {
    if (filter.checked) {
      valuesComplex = [];
      valuesComplex.push(filter.value);
    } else {
      valuesComplex = [];
      valuesComplex.push(capAllInput.value);
    }
  } else if (column == 3) {
    if (filter.checked) {
      valuesPlayed.push(filter.value);
    } else {
      let index = valuesPlayed.indexOf(filter.value);
      valuesPlayed.splice(index, 1);
    }
  } else if (column == 4) {
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

//executes search on spreadsheet
function getResults() {
  const searchString = searchBar.value.toLowerCase();
  const searchLenght = searchBar.value.length;
  let filteredItems;
  if (searchLenght >= 3) {
    filteredItems = spreadsheet.filter((item) => {
      return (
        (item[0].toLowerCase().includes(searchString) ||
        item[1].toLowerCase().includes(searchString) ||
        isStringIncluded(item[4], searchString)) &&
        isFilterIncluded(item, 2, valuesComplex) &&
        isFilterIncluded(item, 3, valuesPlayed) &&
        isFilterIncluded(item, 4, valuesMode)
      );
    });
  } else {
    filteredItems = spreadsheet.filter((item) => {
      return (
        isFilterIncluded(item, 2, valuesComplex) &&
        isFilterIncluded(item, 3, valuesPlayed) &&
        isFilterIncluded(item, 4, valuesMode)
      );
    });
  }
  if (sortValue == "Newest" || sortValue == "Oldest") {
    let sortedItems = sortDate(filteredItems);
    return sortedItems;
  } else {
    let sortedItems = sortItems(filteredItems);
    return sortedItems;
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
      <a href="${item[6]}" target="_blank" rel="noopener noreferrer"><img src="${item[5]}" class="item-img"></a>
      <div class="item-content">
        <h2 class="item-title"><a class="item-title-link" href="${item[6]}" target="_blank" rel="noopener noreferrer">${item[0]}</a></h2>
        <p class="item-text">${item[4].join(', ')}</p>
        <div>
          <a class="item-text-link" href="${item[6]}" target="_blank" rel="noopener noreferrer"><p class="item-text">${item[1]}</p></a>
        </div>
      </div>
    </li>`;
  }).join('');
  resultsList.innerHTML = htmlString;
}