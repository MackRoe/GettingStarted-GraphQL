// Import dependancies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Create a schema
const schema = buildSchema(`
type About {
  message: String!
}

type Query {
  getAbout: About
}`)

// Define a resolver
const root = {
  getAbout: () => {
    return { message: 'Hello World' }
  }
}
