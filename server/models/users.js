require('mariadb')
const pool = require('../db_connect')

// Find user by email
exports.userByEmail = async (email) => {
  const conn = await pool.getConnection()
  const result = conn.query('SELECT * FROM users WHERE email = ?', [email])
  conn.release()
  return result
}

// Create a new user
exports.createUser = async (name, email, hashedPassword, avatar) => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?)', [name, email, hashedPassword, avatar, 'false']
  )
  conn.release()
  return result
}

// Login
exports.login = async (email) => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'SELECT * FROM users WHERE email= ?', [email]
  )
  conn.release()
  return result
}

// Render user profile informations
exports.userProfile = async (userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('SELECT users.name, users.email, users.avatar_url FROM users WHERE id= ?', [userId])
  conn.release()
  return result
}

// Render user list of articles
exports.userArticles = async (userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('SELECT users.name, articles.* FROM users INNER JOIN articles ON users.id = articles.user_id WHERE articles.user_id= ? ORDER BY articles.date DESC', [userId])
  conn.release()
  return result
}

// Update user details
exports.updateAccount = async (name, email, userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('UPDATE users SET name= ?, email= ? WHERE id= ? ', [name, email, userId])
  conn.release()
  return result
}

// Update user password
exports.updatePassword = async (hashedPassword, userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('UPDATE users SET password= ?  WHERE id= ?', [hashedPassword, userId])
  conn.release()
  return result
}

// Update avatar
exports.updateAvatar = async (avatarURL, userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('UPDATE users SET avatar_url= ? WHERE id= ?', [avatarURL, userId])
  conn.release()
  return result
}

// Before deleteUSer, assign articles to Administrator
exports.assignToAdmin = async (userId) => {
  const conn = await pool.getConnection()
  const result = conn.query("UPDATE articles SET user_id='30' WHERE user_id= ?", [userId])
  conn.release()
  return result
}

// Delete user
exports.deleteUser = async (userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('DELETE FROM users WHERE id= ?', [userId])
  conn.release()
  return result
}
