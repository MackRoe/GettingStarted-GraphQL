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

type Query {
  getAbout: About
    getmeal(time: String!): Meal
  getPet(id: Int!): Pet # Add a query to get a single pet
  allPets: [Pet!]!      # Returns an array of type Pet
  firstPet: Pet     # Returns first pet in array
  lastPet: Pet     # Returns last pet in array
  getTime: Time     # Returns current time
}`)
// Define list of pets
const petList = [
    { name: 'Fluffy', species: 'Dog', age: 0 },
    { name: 'Sassy', species: 'Cat', age: 3 },
    { name: 'Goldberg', species: 'Frog', age: 1 }
]

let currentTime = { hour: 12, minute: 30, second: 11}

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
    getTime: () => {
        return currentTime
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
