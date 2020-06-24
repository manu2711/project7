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

exports.newArticle = [upload.single('cover'), async (req, res) => {
  console.log(req.file)
  console.log(req.body)
  const s3 = new aws.S3()
  try {
    const { title, content, userId } = req.body
    // const imageUrl = './images/default-article.jpg'
    const revContent = content.split('"').join('\'')
    const url = Math.round(Math.random() * 1000000) + '-' + title.toLowerCase().split(' ').join('-')
    const date = Date.now()

    const buffer = await sharp(req.file.path)
      .resize(950)
      .toBuffer()

    const s3res = await s3.upload({
      Bucket: 'manu2711groupomania/cover',
      Key: `${Date.now() + '-' + req.file.originalname}`,
      Body: buffer,
      ACL: 'public-read'
    }).promise()
    // Connection to Database
    const conn = await pool.getConnection()

    // Save new article inside database
    await conn.query(
      `INSERT INTO articles VALUES (NULL, "${title}", "${revContent}", "${date}", "${userId}", "${url}", "${s3res.Location}")`
    )
    fs.unlink(req.file.path, () => {
      console.log(s3res.Location)
    })
    res
      .status(201)
      .send({ message: `Thanks for sharing your new article: ${title} ! avec l'url: ${url}` })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}]

// Render all articles
exports.allArticles = async (req, res) => {
  // Connection to db which will return the list of all articles
  try {
    const conn = await pool.getConnection()
    const rows = await conn.query(
      'SELECT * FROM articles ORDER BY date DESC'
    )
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
    console.log(articleId)
    const conn = await pool.getConnection()
    const article = await conn.query(`
    SELECT articles.*, users.name FROM articles
    INNER JOIN users
    ON articles.user_id = users.id
    WHERE url="${articleId}"
    `)
    if (article[0] == null) return res.send({ message: 'There is no article with that id !' })

    const comments = await conn.query(`
    SELECT comments.content FROM comments
    INNER JOIN articles
    ON comments.article_id = articles.id
    WHERE articles.url="${articleId}"
    `)
    res.status(200).send({ article, comments })
    conn.end()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// Edit an article
exports.editArticle = async (req, res) => {
  try {
    const id = req.params.id
    const { title, content } = req.body
    const url = Math.round(Math.random() * 1000000) + '-' + title.toLowerCase().split(' ').join('-')

    const conn = await pool.getConnection()
    await conn.query(
      `UPDATE articles SET title='${title}', content='${content}', url='${url}' WHERE id='${id}'`
    )
    res.status(200).json({ message: 'Your article has been updated !' })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

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
