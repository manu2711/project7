const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin.js')
// const auth = require('../middleware/auth')

// linking routes to controllers
router.get('/', adminController.all)
router.put('/', adminController.adminRights)

module.exports = router
