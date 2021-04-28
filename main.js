// Dogs test
// const searchBar = document.getElementById('searchBar');
// let dogs = [
//     {
//         breed: "Golden Retriever",
//         size: "large",
//         image: "",
//         tags: ["friendly", "obedient", "active", "swimmer"]
//     },
//     {
//         breed: "Italian Greyhound",
//         size: "small",
//         image: "",
//         tags: ["shy", "lazy", "runner"]
//     },
//     {
//         breed: "Bull Terrier",
//         size: "medium",
//         image: "",
//         tags: ["friendly", "independent", "active"]
//     },
//     {
//         breed: "German Shepherd",
//         size: "large",
//         image: "",
//         tags: ["obedient", "alert", "guard dog"]
//     },
// ];
// searchBar.addEventListener('keyup', (e) => {
//     const searchString = e.target.value.toLowerCase();
//     const filteredDogs = dogs.filter(dog => {
//         return (
//             dog.breed.toLowerCase().includes(searchString) ||
//             dog.size.toLowerCase().includes(searchString) ||
//             // loop(dog.tags);
//             dog.tags.includes(searchString)
//         );
//     });
//     console.log(filteredDogs);
// });
//
// funçao pra loopar no array das tags e transformar cada elemento em lower case
// function loop (array) {
//     for (let i = 0; i < array.lenght; i++) {
//         array[i].toLowerCase();
//     }
//     return
// }

// BG Library test
const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const filtersListDiv = document.getElementById('filtersListDiv');
let bgList;
const filtersList = [];
let filtersValues = [];


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

function selectFilter(e) {
  let filter = e.target;
  if (filter.checked) {
    filtersValues.push(filter.value);
  } else {
    let index = filtersValues.indexOf(filter.value);
    filtersValues.splice(index, 1);
  }
  const filteredBgs = bgList.filter(searchFilters);
  displayResults(filteredBgs);
}

function searchFilters(bg) {
  for (let i = 0; i < bg.Mode.length; i++) {
    let mode = bg.Mode[i];
    for (let j = 0; j < filtersValues.length; j++) {
      if (mode == filtersValues[j]) {
        return true;
      }
    }
  }
}

searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  const filteredBgs = bgList.filter((bg) => {
    return (
      bg.Game.toLowerCase().includes(searchString) ||
      includeSearch(bg.Players, searchString) ||
      includeSearch(bg.Mode, searchString)
    );
  });
  displayResults(filteredBgs);
});

function includeSearch(array, string) {
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