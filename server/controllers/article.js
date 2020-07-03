const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const aws = require('aws-sdk')
const dbQuery = require('../models/articles')

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Denfine location of temporary file folder
const upload = multer({ dest: './uploads' })

// Create a new article
exports.newArticle = [
  upload.single('cover'),
  async (req, res) => {
    try {
      const { title, content, userId } = req.body
      const date = Date.now()

      // If user uploaded a cover picture, we save the article including the cover image
      if (req.file) {
        const buffer = await sharp(req.file.path)
          .resize(950)
          .toBuffer()

        const s3 = new aws.S3()
        const s3res = await s3
          .upload({
            Bucket: 'manu2711groupomania/cover',
            Key: `${Date.now() + '-' + req.file.originalname}`,
            Body: buffer,
            ACL: 'public-read'
          })
          .promise()

        // Save new article inside database
        await dbQuery.createArticle(
          title,
          content,
          date,
          userId,
          s3res.Location
        )

        fs.unlink(req.file.path, (error) => {
          if (error) throw error
        })
        res.status(201).send({
          message: `Thanks for sharing your new article: ${title} ! `
        })
      }
      // in case the user did not upload any cover picture, we assign the default one
      if (!req.file) {
        const articleCoverDefault =
          'https://manu2711groupomania.s3.eu-west-3.amazonaws.com/cover/default_cover.png'

        // Save new article inside database
        await dbQuery.createArticle(
          title,
          content,
          date,
          userId,
          articleCoverDefault
        )

        res.status(201).send({
          message: `Thanks for sharing your new article: ${title} ! `
        })
      }
    } catch (error) {
      res.status(500).json({ error })
      console.log(error)
    }
  }
]

// Render all articles
exports.allArticles = async (req, res) => {
  // Connection to db which will return the list of all articles
  try {
    const rows = await dbQuery.allArticles()
    res.status(200).send(rows)
  } catch (error) {
    console.log(error)
  }
}

// Render one article
exports.oneArticle = async (req, res) => {
  const articleId = req.params.id
  const userId = req.params.userId
  try {
    // We retrieve from db article details
    const article = await dbQuery.oneArticle(articleId)
    if (article[0] == null) {
      return res.send({ message: 'There is no article with that id !' })
    }
    // We retrieve from db the comments related to article
    const comments = await dbQuery.articleComments(articleId)

    // We retrieve from db the number of likes
    const likes = await dbQuery.likeNumber(articleId)

    // We check if user has liked this article previously
    const userHasLiked = await dbQuery.userHasLiked(articleId, userId)

    // We send the article details and all related comments
    res.status(200).send({ article, comments, likes, userHasLiked })
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// Render article to edit
exports.articleToEdit = async (req, res) => {
  try {
    const row = await dbQuery.oneArticle(req.params.id)
    res.status(200).send(row)
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// Edit an article
exports.editArticle = [
  upload.single('cover'),
  async (req, res) => {
    try {
      const articleId = req.params.id
      const { title, content } = req.body

      // if user uploaded an new cover picture
      if (req.file) {
        const buffer = await sharp(req.file.path)
          .resize(950)
          .toBuffer()

        const s3 = new aws.S3()
        const s3res = await s3
          .upload({
            Bucket: 'manu2711groupomania/cover',
            Key: `${Date.now() + '-' + req.file.originalname}`,
            Body: buffer,
            ACL: 'public-read'
          })
          .promise()

        // Save new article inside database
        await dbQuery.editArticle(title, content, articleId, s3res.Location)

        fs.unlink(req.file.path, error => {
          if (error) throw error
        })
        res.status(200).send({
          message: `Thanks for sharing your new article: ${title} ! `
        })
      }
      // Else, if the no cover picture uploaded, we leave the previous one
      if (!req.file) {
        await dbQuery.editArticle(title, content, articleId)
        res.status(200).json({ message: 'Your article has been updated !' })
      }
    } catch (error) {
      res.status(500).json({ error })
      console.log(error)
    }
  }
]

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    await dbQuery.deleteArticle(req.params.id)
    res.status(200).send({ message: 'Article deleted' })
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

/* Comment management */
// Creation of a new comment
exports.newComment = async (req, res) => {
  try {
    const { articleId, userId, content } = req.body
    await dbQuery.addComment(articleId, userId, content)
    res.status(201).json({ message: 'Thanks for your comment !' })
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// Deletion of comments
exports.deleteComment = async (req, res) => {
  try {
    dbQuery.deleteComment(req.params.id)
    res.status(200).send('Comments deleted')
  } catch (error) {
    res.status(500).json({ error })
  }
}

/* Likes management */
// When user Liked
exports.addLike = async (req, res) => {
  try {
    const { articleId, userId } = req.body
    const result = await dbQuery.addLike(articleId, userId)
    res.status(201).json({ likeId: result.insertId, message: 'Thanks for your feedback !' })
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// When user cancelled his like
exports.deleteLike = async (req, res) => {
  try {
    await dbQuery.deleteLike(req.params.id)
    res.status(201).json({ message: 'Thanks for your feedback !' })
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}
