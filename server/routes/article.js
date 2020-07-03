const express = require('express')
const router = express.Router()

const articleController = require('../controllers/article.js')
const auth = require('../middleware/auth')

// Linking routes to controllers
router.post('/', auth, articleController.newArticle)
router.post('/comments', auth, articleController.newComment)
router.post('/likes', auth, articleController.addLike)
router.get('/', auth, articleController.allArticles)
router.get('/:id/:userId', articleController.oneArticle)
router.get('/edit/:id', auth, articleController.articleToEdit)
router.put('/:id', auth, articleController.editArticle)
router.delete('/:id', auth, articleController.deleteArticle)
router.delete('/comments/:id', auth, articleController.deleteComment)
router.delete('/likes/:id', auth, articleController.deleteLike)

module.exports = router
