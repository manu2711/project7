require('mariadb')
const pool = require('../db_connect')

// Render all articles and all users
exports.all = async (req, res) => {
  // Connection to db which will return the list of all articles
  try {
    const conn = await pool.getConnection()
    const users = await conn.query("SELECT id, name, email, is_admin FROM users WHERE name!='Administrator' ORDER BY name")
    const articles = await conn.query('SELECT articles.*, users.name FROM articles JOIN users ON articles.user_id = users.id ORDER BY articles.date DESC')
    res.status(200).send({ users, articles })
    conn.end()
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

// Update admin rights
exports.adminRights = async (req, res) => {
  try {
    const { userId, adminRight } = req.body

    const conn = await pool.getConnection()
    await conn.query('UPDATE users SET is_admin= ? WHERE id = ?', [adminRight, userId])

    res.status(200).json({ message: 'User rights have been updated' })
    conn.end()
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}
