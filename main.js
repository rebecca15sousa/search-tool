// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filters1 = document.getElementById('filters1');
const filters2 = document.getElementById('filters2');
const capsuleFilters = document.getElementById('capsuleFilters');
let spreadsheet;
const leftCapBtn = document.getElementById('leftBtn');
const rightCapBtn = document.getElementById('rightBtn');
const dropContent = document.getElementById('dropContent');
let valuesComplex = []; //array with complexity filter values that are checked
let valuesPlayed = []; //array with played filter values that are checked
let valuesMode = []; //array with mode filter values that are checked
const tagSearch = document.getElementById('tagSearch');

let filterList2;

let sortValue;
// ------------------------------------- CODE ------------------------------------- //
// capsuleFilters.addEventListener('wheel', function(e) {
//   console.log("rodou");
//   let bla = e.target;
//   if (bla.deltaX < 0) {
//     console.log("esquerda");
//   } else if (bla.deltaX > 0) {
//     console.log("direita");
//   }
// });


// capsuleFilters.addEventListener('scroll', function(e) {
//   console.log("rodou");
//   //Element.scrollLeft
//   //pegar valores do capsuleFilters.scrollLeft de antes e depois do evento e subtrair, se o resultado for positivo ele vai pra direita, se for negativo vai pra esquerda
// });

// capsuleFilters.addEventListener('wheel', function(e) {
//   console.log("rodou");
//   // if (e.deltaX < 0) {
//   //   console.log('esquerda');
//   //   scrollLeft();
//   // } else if (e.deltaX > 0) {
//   //   console.log('direita');
//   //   scrollRight();
//   // }
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
  // console.log("fui pra direita");
}

//"Sort by" button functionality
sortBtn.addEventListener('click', toggleSortBy);

function toggleSortBy() {
  dropContent.classList.toggle("show");
  sortBtn.classList.toggle("dropdown-toggle-open");
}

window.addEventListener('click', closeSortBy);

function closeSortBy(e) {
  if (!e.target.matches('#sortBtn')) {
    dropContent.classList.remove("show");
    sortBtn.classList.remove("dropdown-toggle-open");
  }
}

//Sorting functionality
dropContent.addEventListener('click', getSortValue);

function getSortValue(e) {
  let target = e.target;
  sortValue = target.getAttribute("data-value");
  sortBtn.textContent = sortValue;
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
    return sortByHighestInstance(filteredItems, "7");
  } else {
    return sortByLowestInstance(filteredItems, "7");
  }
}

function sortByHighestInstance(filteredItems, category) {
  const sortedItems = filteredItems.sort((a, b) => b[category] > a[category] ? 1 : -1);
  return sortedItems;
}

function sortByLowestInstance(filteredItems, category) {
  const sortedItems = filteredItems.sort((a, b) => b[category] < a[category] ? 1 : -1);
  return sortedItems;
}

function generateFilters() {
  let filterList1, capsuleList, sortByList;
  capsuleList = getFiltersList("2");
  filterList1 = getFiltersList("3");
  filterList2 = getFiltersList("4");
  sortByList = getFiltersList("3");
  displaySortBy(sortByList, dropContent);
  startSortBy();
  displayFilters(capsuleList, capsuleFilters, 2, "radio");
  document.getElementById('All').checked = true;
  const capsulesNode = document.querySelectorAll('.radio-input');
  const capsulesArray = Array.from(capsulesNode);
  capsulesArray.forEach((capsule) => {
    capsule.addEventListener('change', activateCapsule);
  });
  displayFilters(filterList1, filters1, 3, "checkbox");
  displayFilters(filterList2, filters2, 4, "checkbox");
  // addEllipsis();
  const checkboxesNode = document.querySelectorAll('input[type=checkbox]');
  const checkboxesArray = Array.from(checkboxesNode);
  checkboxesArray.forEach((checkbox) => {
    checkbox.addEventListener('change', selectFilter);
  });
  // console.log("gerou filtros");
}

function startSortBy() {
  sortBtn.textContent = dropContent.firstElementChild.getAttribute("data-value");
  sortValue = sortBtn.textContent;
  let searchResult = getResults();
  displayResults(searchResult);
  // console.log("começou sort");
}

//loops through all cells of a specific collumn and gets every unique element to create a ordered filter list
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
      //checks every obj on array to see if current loop value already exists
      if (!filtersList.some((obj) => isIncluded(obj, filterName))) {
        //if it doesn't exist, create new obj for it
        let tag = new Tag(filterName);
        filtersList.push(tag);
      }
    }
  }
  return sortByHighestInstance(filtersList, "number");
}

function Tag(name) {
  this.name = name;
  this.number = 1;
}

//checks if obj name property is equal to current loop value
function isIncluded(obj, filterName) {
  if (obj.name === filterName) {
    //if it is equal, increment number property
    obj.number++;
    return true;
  } else {
    return false;
  }
}

function displayFilters(filtersList, container, column, type) {
  if (type == "radio") {
    container.innerHTML =  `<li class="radio-li">
    <input type="checkbox" id="All" class="radio-input" data-column="2" value="All">
    <label for="All" id="allLabel" class="radio-label">All</label>
    <br>
  </li>`;
  } else {
    container.innerHTML = "";
  }
  const htmlString = filtersList.map((item) => {
    return `
    <li class="${type}-li">
      <input type="checkbox" id="${type} + ${item.name}" class="${type}-input form-check-input" data-column="${column}" value="${item.name}">
      <label for="${type} + ${item.name}" class="${type}-label ellipsis">${item.name}</label>
      <br>
    </li>`;
  }).join('');
  container.innerHTML += htmlString;
}

function displaySortBy(sortByList, container) {
  if (localStorage.getItem("formDate")) {
    container.innerHTML = `<span class="dropdown-item" data-value="Newest">Newest</span>
    <span class="dropdown-item" data-value="Oldest">Oldest</span>`;
  } else {
    container.innerHTML = "";
  }
  const htmlString = sortByList.map((item) => {
    return `
    <span class="dropdown-item" data-value="${item.name}">${item.name}</span>`;
  }).join('');
  container.innerHTML += htmlString;
}

// function addEllipsis() {
//   let labels = document.querySelectorAll('.ellipsis');
//   for (let i = 0; i < labels.length; i++) {
//     let label = labels[i];
//     if (label.textContent.length > 27) {
//       label.textContent = label.textContent.substr(0, 24) + " (...)";
//     }
//   }
// }

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

tagSearch.addEventListener('keyup', () => {
  const searchString = tagSearch.value.toLowerCase();
  let filters2 = document.getElementById('filters2');
  let items = filters2.getElementsByTagName('li');
  for (let i = 0; i < items.length; i++) {
    let label = items[i].querySelector('.checkbox-label');
    let labelValue = label.textContent.toLowerCase();
    if (labelValue.includes(searchString)) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
});

function displayResults(searchResult) {
  const htmlString = searchResult.map((item) => {
    return `
    <li class="item-complete">
      <a href="${item[6]}" target="_blank" rel="noopener noreferrer"><img src="${item[5]}" class="item-img"></a>
      <div class="item-content">
        <h2 class="item-title mb-2"><a class="item-title-link" href="${item[6]}" target="_blank" rel="noopener noreferrer">${item[0]}</a></h2>
        <div class="item-subtitle">
          <div class="status-div me-3" style="background-color: ${setStatusBack(item)}">
            <div class="status-circle me-1" style="background-color: ${setStatusColour(item)}"></div>
            <p class="item-text" style="color: ${setStatusColour(item)}">${item[3]}</p>
          </div>
          <p class="item-text">${displayTags(item[2], "type")}</p>
        </div>
        <div>
          <a class="item-text-link" href="${item[6]}" target="_blank" rel="noopener noreferrer"><p class="item-text item-desc">${checkDescription(item)}</p></a>
          <p class="item-text my-1 fs-small">${displayDate(item)}</p>
          <p class="item-text fs-small">Tags: ${displayTags(item[4], "tag")}</p>
        </div>
      </div>
    </li>`;
  }).join('');
  resultsList.innerHTML = htmlString;
  let typeTextNode = document.querySelectorAll('.type-text');
  let typeTextArray = Array.from(typeTextNode);
  typeTextArray.forEach((typeText) => {
    typeText.addEventListener('click', searchTextType);
  });
  let tagTextNode = document.querySelectorAll('.tag-text');
  let tagTextArray = Array.from(tagTextNode);
  tagTextArray.forEach((tagText) => {
    tagText.addEventListener('click', searchTextTags);
  });
}

function displayTags(item, tagClass) {
  const htmlString = item.map((tag) => {
    for (let i = 0; i < valuesMode.length; i++) {
      if (tag == valuesMode[i]) {
        return `
        <span class="${tagClass}-text" style="font-weight: bold">${tag}</span>`
      }
    }
    return `
    <span class="${tagClass}-text">${tag}</span>`
  }).join();
  return htmlString;
}

function searchTextTags(e) {
  let filter = e.target;
  let list = document.querySelectorAll('.checkbox-input');
  for (let i = 0; i < list.length; i++) {
    if (filter.innerHTML == list[i].value && !valuesMode.includes(list[i].value)) {
      list[i].checked = true;
      let event = {
        target: list[i]
      };
      selectFilter(event);
    }
  }
}

function searchTextType(e) {
  let filter = e.target;
  let list = document.querySelectorAll('.radio-input');
  for (let i = 0; i < list.length; i++) {
    if (filter.innerHTML == list[i].value) {
      for (let j = 0; j < list.length; j++) {
        list[j].checked = false;
      }
      list[i].checked = true;
      let event = {
        target: list[i]
      };
      selectFilter(event);
    }
  }
}

function displayDate(item) {
  if (localStorage.getItem("formDate")) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (months[item[7].getMonth()] + " " + item[7].getFullYear());
  } else {
    return item[7];
  }
}

function setStatusBack(item) {
  if (item[3] == "Finished") {
    return "#ededed";
  } else if (item[3] == "On-going") {
    return "#565656";
  } else {
    return "#565656";
  }
}

function checkDescription(item) {
  if (item[1] == "") {
    return "No description available.";
  } else {
    return item[1];
  }
}

function setStatusColour(item) {
  if (item[3] == "Finished") {
    return "green";
  } else if (item[3] == "On-going") {
    return "yellow";
  } else {
    return "orange";
  }
}