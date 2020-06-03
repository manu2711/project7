const mariadb = require('mariadb')

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
exports.allArticles = (req, res) => {
  mariadb
    .createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'groupo'
    })
    .then(conn => {
      conn.query('SELECT * FROM articles').then(rows => {
        res.send(rows)
        conn.end()
      })
    })
    .catch(error => {
      console.log(error)
     // throw error
    })
}
