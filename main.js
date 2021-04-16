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

// funçao pra loopar no array das tags e transformar cada elemento em lower case
// function loop (array) {
//     for (let i = 0; i < array.lenght; i++) {
//         array[i].toLowerCase();
//     }
//     return
// }

// BG Library test
const searchBar = document.getElementById('searchBar');
let bgList;

Papa.parse("https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vSK-1NdXaNwkyIZPiKHahN5jC3pckcvaU9PBv1dN-PCJ-aP5x8Iss4ghw5qCwe0KYSbE0Kzclv-5J8q/pub?gid=332499702&single=true&output=csv", {
  download: true,
  header: true,
  complete: function(results) {
    bgList = results.data;
    for(var i = 0; i < bgList.length; i++) {
      bgList[i].Players = bgList[i].Players.split(",");
      bgList[i].Mode = bgList[i].Mode.split(",");
    };
  }
});

searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  const filteredBgs = bgList.filter(bg => {
    return (
        bg.Game.toLowerCase().includes(searchString) ||
        includeSearch(bg.Players, searchString) ||
        includeSearch(bg.Mode, searchString)
    );
  });
  console.log(filteredBgs);
});

function includeSearch(array, string) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].toLowerCase().includes(string)) {
      return true;
    }
  }
}