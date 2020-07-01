const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.js')
const auth = require('../middleware/auth')

// Linking routes to controllers
router.get('/profile/:id', auth, userController.profile)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/profile/:id/avatar', auth, userController.avatar)
router.put('/account/:id', auth, userController.updateAccount)
router.put('/password/:id', auth, userController.updatePassword)
router.delete('/:id', auth, userController.delete)

module.exports = router
