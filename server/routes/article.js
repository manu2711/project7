const express = require('express')
const router = express.Router()

const articleController = require('../controllers/article.js')

router.post('/', articleController.create)
router.get('/', articleController.allArticles)

module.exports = router
