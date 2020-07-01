// Importation of all dependencies
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

// Importations of routes
const userRoutes = require('./routes/user.js')
const articleRoutes = require('./routes/article')
const adminRoutes = require('./routes/admin')

// Middlewares
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: false
}))

// CORS for accessing API from different port
app.use(cors())

app.use('/api/users', userRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/admin', adminRoutes)

module.exports = app
