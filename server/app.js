const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Importations des différentes routes

app.use(bodyParser.json())

module.exports = app
