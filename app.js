const {MongoClient} = require('mongodb')
const uri = require('./atlas_uri')

console.log(uri)

// initiating connection with the database

const client = new MongoClient(uri)

// connecting to the database