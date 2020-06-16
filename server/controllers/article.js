require('mariadb')
const pool = require('../db_connect')

// Create a new article
exports.newArticle = async (req, res) => {
  try {
    const { title, content, userId } = req.body
    const revContent = content.split('"').join('\'')
    const url = Math.round(Math.random() * 1000000) + '-' + title.toLowerCase().split(' ').join('-')
    // Connection to Database
    const conn = await pool.getConnection()

    // Save new article inside database
    await conn.query(
      `INSERT INTO articles VALUES (NULL, "${title}", "${revContent}", NULL, "${userId}", '${url}')`
    )
    res
      .status(201)
      .send({ message: `Thanks for sharing your new article: ${title} ! avec l'url: ${url}` })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

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

    const conn = await pool.getConnection()
    const rows = await conn.query(
      `SELECT * FROM articles WHERE url='${articleId}'`
    )

    if (rows[0] == null) return res.send({ message: 'There is no article with that id !' })

    res.status(200).send(rows)
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
    console.log(id)

    const conn = await pool.getConnection()
    const rows = await conn.query(
      `UPDATE articles SET title='${title}', content='${content}', url='${url}' WHERE id='${id}'`
    )
    console.log(rows)
    res.status(200).json({ message: 'Your article has been updated !'})
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

    // Save new article inside database
    await conn.query(`DELETE FROM articles WHERE id = '${id}'`)
    res.status(200).send({ message: 'Article deleted' })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}
