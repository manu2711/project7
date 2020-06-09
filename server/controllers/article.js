const mariadb = require('mariadb')

const pool = mariadb.createPool({
  host: 'db-groupomania.cbkgmmwqybsk.eu-west-3.rds.amazonaws.com',
  user: 'admin',
  password: 'Groupo2020$',
  database: 'groupomania'
})

// Create article
exports.create = (req, res) => {
  const title = req.body.title
  const article = req.body.article
  const date = new Date()
  const createdOn =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  console.log(createdOn)

  // const sql = `INSERT INTO articles VALUES (NULL, '${title}', '${article}', '${createdOn}')`

  // connection.connect()

  // connection.query(sql, (error, result) => {
  //   if (error) throw error
  //   res.send(result)
  // })

  // connection.end()
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
