require('mariadb')
const pool = require('../db_connect')

// Render all articles
exports.allArticles = async (req, res) => {
// Connection to db which will return the list of all articles
  try {
    const conn = await pool.getConnection()
    const rows = await conn.query('SELECT * FROM articles')
    res.status(201).send(rows)
    conn.end()
  } catch (error) {
    console.log(error)
  }
}

// Create a new article
exports.newArticle = async (req, res) => {
  try {
    const { title, content, userId } = req.body
    // Connection to Database
    const conn = await pool.getConnection()

    // Save new article inside database
    await conn.query(
      `INSERT INTO articles VALUES (NULL, '${title}', '${content}', NULL, '${userId}')`
    )
    res.status(201).send({ message: `Thanks for sharing your new article: ${title} !` })
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

    // Save new article inside database
    await conn.query(
      `DELETE FROM articles WHERE id = '${id}'`
    )
    res.status(200).send({ message: 'Article deleted' })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}
