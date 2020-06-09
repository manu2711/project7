require('mariadb')
const pool = require('../db_connect')

// Create article
exports.create = (req, res) => {
}

// Show all articles
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
