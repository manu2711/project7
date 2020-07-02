require('mariadb')
const pool = require('../db_connect')

// Render all articles
exports.allArticles = async () => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'SELECT articles.*, users.name FROM articles JOIN users ON articles.user_id = users.id ORDER BY articles.date DESC'
  )
  conn.release()
  return result
}

// Render all users
exports.allUsers = async () => {
  const conn = await pool.getConnection()
  const result = conn.query("SELECT id, name, email, is_admin FROM users WHERE name!='Administrator' ORDER BY name")
  conn.release()
  return result
}

// Update admin rights
exports.updateRights = async (adminRight, userId) => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'UPDATE users SET is_admin= ? WHERE id = ?', [`${adminRight}`, userId]
  )
  conn.release()
  return result
}
