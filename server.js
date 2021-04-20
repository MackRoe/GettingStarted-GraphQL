// Import dependancies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// SCHEMA
const schema = buildSchema(`
type About {
  message: String!
}

type Meal {
    description: String!
}

enum Species {
    Cat
    Dog
    Frog
    Fish
    Snake
}

type Pet {
    name: String!
    species: Species!
    total: Int!
}

enum MealTime {
    breakfast
    lunch
    dinner
}

type Time {
    hour: Int!
    minute: Int!
    second: Int!
}

type Roll {
    total: Int!
    sides: Int!
    rolls: [Int!]!
}

type Mutation {
    addPet(name: String!, species: String!): Pet!
    updatePet(id: Int!, name: String, species: String): Pet
}

type Query {
  getAbout: About
    getmeal(time: String!): Meal
  getPet(id: Int!): Pet # Add a query to get a single pet
  allPets: [Pet!]!      # Returns an array of type Pet
  firstPet: Pet     # Returns first pet in array
  lastPet: Pet     # Returns last pet in array
  getTime: Time     # Returns current time
  getRandom(range: Int!): Int  # Returns a random number in specified range
  getRoll(sides: Int!, rolls: Int!): Roll
  petCount: Pet
  petsInRange(start: Int!, count: Int!): [Pet]
  getPetBySpecies(species: String!): [Pet]
  allSpecies: [Pet]
}`)
// Define list of pets
const petList = [
    { name: 'Fluffy', species: 'Dog', age: 0 },
    { name: 'Sassy', species: 'Cat', age: 3 },
    { name: 'Goldberg', species: 'Frog', age: 1 }
]

// Set up Random
function randomNumber(range){
    return Math.floor(Math.random() * range)
}


// RESOLVER
const root = {
    getAbout: () => {
        return { message: 'Hello World' }
    },
    getmeal: ({ time }) =>{
        const allMeals = {
            breakfast: 'toast',
            lunch: 'noodles',
            dinner: 'pizza'
        }
        const meal = allMeals[time]
        return { description: meal}
    },
    getPet: ({ id }) => {
        return petList[id]
    },
    allPets: ()=> {
        return petList
    },
    firstPet: ({ id = 0 }) => {
        return petList[id]
    },
    lastPet: ({ id = (petList.length - 1)}) => {
        return petList[id]
    },
    petCount: () => {
        const count = petList.length
        return { total: count}
    },
    petsInRange: ({ start, count }) => {
        const rangedArray = []
        if ((start + count) < petList.length) {
            // # accumulate array

            const limit = start + count
            console.log('start: ', start, 'count: ', count)
            for (let i = start; i < limit; i++) {
                console.log(petList[i])
                // get pet name at specified indexes
                rangedArray.push(petList[i])
            }
        }
        return rangedArray

    },
    getPetBySpecies: ({ species }) => {
        const specifiedSpeciesList = []
        for (let i = 0; i < petList.length -1; i++)
            if (petList[i].species === species) {
                specifiedSpeciesList.push(petList[i])
            }
        return specifiedSpeciesList
    },
    allSpecies: () => {
        const speciesList = []
        for (let i =0; i < petList.length -1; i++) {
            console.log('species: ', petList.species)
            speciesList.push(petList.species)
        }
        return speciesList
    },
    addPet: ({ name, species }) => {
        const pet = { name, species}
        petList.push(pet)
        return pet
    },
    updatePet: ({ id, name, species }) => {
		const pet = petList[id]  // is there anything at this id?
		if (pet === undefined) { // Id not return null
            console.log('Pet is ', pet)
			return null
		}
    // if name or species was not included use the original
		pet.name = name || pet.name
		pet.species = species || pet.species
		return pet
	},
    getTime: () => {
        const now = new Date(Date.now())
        const hourNow = now.getHours()
        const minuteNow = now.getMinutes()
        const secondNow = now.getSeconds()
        return { hour: hourNow, minute: minuteNow, second: secondNow}
    },
    getRandom: ({ range }) => {
        return randomNumber(range)
    },
    getRoll: ({ sides, rolls }) => {
        var i;
        var rollsTotal = 0
        var rollList = []
        for (i = 0; i < rolls; i++)
        {
            let oneRoll = (randomNumber(sides)+1);
            rollList.push(oneRoll)
            rollsTotal = rollsTotal + oneRoll
        }
        return { total: rollsTotal, sides, rolls: rollList}
    }

}

// Create an express app
const app = express()

// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

// Start this app
const port = 4000
app.listen(port, () => {
  console.log(`Running on port: ${port}`)
})
