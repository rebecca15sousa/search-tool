// Dogs test
const searchBar = document.getElementById('searchBar');
let dogs = [
    {
        breed: "Golden Retriever",
        size: "large",
        image: "",
        tags: ["friendly", "obedient", "active", "swimmer"]
    },
    {
        breed: "Italian Greyhound",
        size: "small",
        image: "",
        tags: ["shy", "lazy", "runner"]
    },
    {
        breed: "Bull Terrier",
        size: "medium",
        image: "",
        tags: ["friendly", "independent", "active"]
    },
    {
        breed: "German Shepherd",
        size: "large",
        image: "",
        tags: ["obedient", "alert", "guard dog"]
    },
];

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredDogs = dogs.filter(dog => {
        return (
            dog.breed.toLowerCase().includes(searchString) ||
            dog.size.toLowerCase().includes(searchString) ||
            // loop(dog.tags);
            dog.tags.includes(searchString)
        );
    });
    console.log(filteredDogs);
});

// funçao pra loopar no array das tags e transformar cada elemento em lower case
// function loop (array) {
//     for (let i = 0; i < array.lenght; i++) {
//         array[i].toLowerCase();
//     }
//     return
// }

