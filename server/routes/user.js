const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.js')

router.get('/profile/:id', userController.profile)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/profile/:id/avatar', userController.avatar)
router.put('/account/:id', userController.updateAccount)
router.put('/password/:id', userController.updatePassword)
router.delete('/:id', userController.delete)

module.exports = router
