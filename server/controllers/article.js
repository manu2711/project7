require('mariadb')
const pool = require('../db_connect')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const aws = require('aws-sdk')

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create a new article

const upload = multer({ dest: './uploads' })

exports.newArticle = [
  upload.single('cover'),
  async (req, res) => {
    console.log(req.file)
    console.log(req.body)
    
    try {
      const { title, content, userId } = req.body
      // const imageUrl = './images/default-article.jpg'
      const revContent = content.split('"').join("'")
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
        // Connection to Database
        const conn = await pool.getConnection()

        // Save new article inside database
        await conn.query(
          `INSERT INTO articles VALUES (NULL, "${title}", "${revContent}", "${date}", "${userId}", "${s3res.Location}")`
        )
        fs.unlink(req.file.path, () => {
          console.log(s3res.Location)
        })
        res.status(201).send({
          message: `Thanks for sharing your new article: ${title} ! `
        })
        conn.release()
      }

      if (!req.file) {
        const articleCoverDefault = 'https://manu2711groupomania.s3.eu-west-3.amazonaws.com/cover/default_cover.png'
        // Connection to Database
        const conn = await pool.getConnection()

        // Save new article inside database
        await conn.query(
          `INSERT INTO articles VALUES (NULL, "${title}", "${revContent}", "${date}", "${userId}", "${articleCoverDefault}")`
        )
        res.status(201).send({
          message: `Thanks for sharing your new article: ${title} ! `
        })
        conn.release()
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
    const conn = await pool.getConnection()
    const rows = await conn.query('SELECT * FROM articles ORDER BY date DESC')
    res.status(200).send(rows)
    conn.end()
  } catch (error) {
    console.log(error)
  }
}

// Render one article
exports.oneArticle = async (req, res) => {
  try {
    const articleId = req.params.id
    const conn = await pool.getConnection()
    const article = await conn.query(`
    SELECT articles.*, users.name FROM articles
    INNER JOIN users
    ON articles.user_id = users.id
    WHERE articles.id="${articleId}"
    `)
    if (article[0] == null) {
      return res.send({ message: 'There is no article with that id !' })
    }
    const comments = await conn.query(`
    SELECT comments.content, users.name FROM comments
    INNER JOIN articles ON comments.article_id = articles.id
    INNER JOIN users ON comments.user_id = users.id
    WHERE articles.id="${articleId}"
    `)
    res.status(200).send({ article, comments })
    conn.end()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// Render article to edit
exports.articleToEdit = async (req, res) => {
  try {
    // const articleId = req.params.id
    const conn = await pool.getConnection()
    const row = await conn.query(
      `SELECT * FROM articles WHERE id=${req.params.id} `
    )
    res.status(200).send(row)
    conn.release()
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
        // Connection to Database
        const conn = await pool.getConnection()

        // Save new article inside database
        await conn.query(
          `UPDATE articles SET title="${title}", content="${content}", image_url="${s3res.Location}" WHERE id="${articleId}"`
        )
        fs.unlink(req.file.path, () => {
          console.log(s3res.Location)
        })
        res.status(201).send({
          message: `Thanks for sharing your new article: ${title} ! `
        })
        conn.release()
      }

      if (!req.file) {
        const conn = await pool.getConnection()
        await conn.query(
          `UPDATE articles SET title='${title}', content="${content}" WHERE id='${articleId}'`
        )
        res.status(200).json({ message: 'Your article has been updated !' })
        conn.release()
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
    const id = req.params.id
    // Connection to Database
    const conn = await pool.getConnection()

    await conn.query(`DELETE FROM articles WHERE id = '${id}'`)
    res.status(200).send({ message: 'Article deleted' })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

/* Comments */
exports.newComment = async (req, res) => {
  try {
    const { articleId, userId, content } = req.body
    console.log(articleId, userId, content)
    const conn = await pool.getConnection()
    await conn.query(`
      INSERT INTO comments VALUES(NULL, "${articleId}", "${userId}", "${content}", NULL)
    `)
    res.status(201).json({ message: 'Thanks for your comment !' })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}
