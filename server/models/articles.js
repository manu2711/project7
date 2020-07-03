require('mariadb')
const pool = require('../db_connect')

// Prevent script tag injection
const escapeScript = text => {
  return text.replace(/script/g, '&script;')
}

exports.userByEmail = async email => {
  const conn = await pool.getConnection()
  conn.query('SELECT * FROM users WHER email = ?', [email])
}

// Create a new article
exports.createArticle = async (title, content, date, userId, imageURL) => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'INSERT INTO articles VALUES (NULL, ?, ?, ?, ?, ?)',
    [escapeScript(title), escapeScript(content), date, userId, imageURL]
  )
  conn.release()
  return result
}

// Render all articles
exports.allArticles = async () => {
  const conn = await pool.getConnection()
  const result = conn.query('SELECT * FROM articles ORDER BY date DESC')
  conn.release()
  return result
}

// Render one article
exports.oneArticle = async articleId => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'SELECT articles.*, users.name FROM articles INNER JOIN users ON articles.user_id = users.id WHERE articles.id=?',
    [articleId]
  )
  conn.release()
  return result
}

// Render Comments related to articleId
exports.articleComments = async articleId => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'SELECT comments.id, comments.content, users.id AS owner, users.name FROM comments INNER JOIN articles ON comments.article_id = articles.id INNER JOIN users ON comments.user_id = users.id WHERE articles.id=?',
    [articleId]
  )
  conn.release()
  return result
}

// Edit article
exports.editArticle = async (title, content, articleId, imageURL) => {
  const conn = await pool.getConnection()
  if (imageURL) {
    const result = conn.query(
      'UPDATE articles SET title= ?, content= ?, image_url=? WHERE id=?',
      [escapeScript(title), escapeScript(content), imageURL, articleId]
    )
    conn.release()
    return result
  } else if (!imageURL) {
    const result = conn.query(
      'UPDATE articles SET title= ?, content= ? WHERE id=?',
      [escapeScript(title), escapeScript(content), articleId]
    )
    conn.release()
    return result
  }
}

// Delete article
exports.deleteArticle = async (articleId) => {
  const conn = await pool.getConnection()
  const result = conn.query('DELETE FROM articles WHERE id = ?', [articleId])
  conn.release()
  return result
}

// Add a new comment
exports.addComment = async (articleId, userId, content) => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'INSERT INTO comments VALUES(NULL, ?, ?, ?, NULL)',
    [articleId, userId, escapeScript(content)]
  )
  conn.release()
  return result
}

// Delete a comment
exports.deleteComment = async articleId => {
  const conn = await pool.getConnection()
  const result = conn.query('DELETE FROM comments WHERE id = ?', [articleId])
  conn.release()
  return result
}

// Render Like number
exports.likeNumber = async (articleId) => {
  const conn = await pool.getConnection()
  const result = conn.query(
    'SELECT COUNT(*) AS number FROM likes INNER JOIN articles ON likes.article_id = articles.id WHERE articles.id = ?', [articleId]
  )
  conn.release()
  return result
}

// Add Like
exports.addLike = async (articleId, userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('INSERT INTO likes VALUES(NULL, ?,?)', [articleId, userId])
  conn.release()
  return result
}

// Delete Like
exports.deleteLike = async (likeId) => {
  const conn = await pool.getConnection()
  const result = conn.query('DELETE FROM likes WHERE id = ?', [likeId])
  conn.release()
  return result
}

// Check if user liked an article
exports.userHasLiked = async (articleId, userId) => {
  const conn = await pool.getConnection()
  const result = conn.query('SELECT id FROM likes WHERE article_id = ? AND user_id = ?', [articleId, userId])
  conn.release()
  return result
}
