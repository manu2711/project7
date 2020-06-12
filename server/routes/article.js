const express = require('express')
const router = express.Router()

const articleController = require('../controllers/article.js')

router.post('/', articleController.newArticle)
router.get('/', articleController.allArticles)
router.delete('/:id', articleController.deleteArticle)

module.exports = router
