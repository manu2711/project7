const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

// Importations des différentes routes
const userRoutes = require('./routes/user.js')
const articleRoutes = require('./routes/article')

app.use(bodyParser.json())
app.use(cors())

// CORS

app.use('/api/users', userRoutes)
app.use('/api/articles', articleRoutes)

module.exports = app
