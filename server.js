// requires express
const express = require('express');

const PORT = process.env.PORT || 3001;

// instantiates the server
const app = express();

// reqires data from animals.json
const { animals } = require('./data/animals');
const { query } = require('express');

// will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array.
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait aainst each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait uin the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait,
            // so at the end well have an array of animals that have every one of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// adds route with stringifyed path, requires GET. creates let variable to access json, sets query paramater through filterByQuery function
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
})

// chains listen method to make our server listen
app.listen(PORT, () => {
    console.log(`API server is now port ${PORT}!`);
});