const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.js')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.delete('/:id', userController.delete)

module.exports = router
