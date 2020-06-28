const express = require('express')
const router = express.Router()

const articleController = require('../controllers/article.js')
const auth = require('../middleware/auth')

router.post('/', articleController.newArticle)
router.post('/comments', articleController.newComment)
router.get('/', auth, articleController.allArticles)
router.get('/:id', articleController.oneArticle)
router.get('/edit/:id', articleController.articleToEdit)
router.put('/:id', articleController.editArticle)
router.delete('/:id', articleController.deleteArticle)

module.exports = router
