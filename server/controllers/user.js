const mariadb = require('mariadb')
// Creation of new user

// Manage signup requests
exports.signup = (req, res) => {
  const { name, email, password } = req.body

  mariadb
    .createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'groupo'
    })
    .then(conn => {
      conn
        .query(
          `INSERT INTO users VALUES (NULL, '${name}', '${email}', '${password}')`
        )
        .then(rows => {
          res.status(201).send({ rows })
          conn.end()
        })
    })
    .catch(error => {
      console.log(error)
      // throw error
    })

  console.log(name)
}

// Manage login requests
exports.login = (req, res) => {
  res.send('Trying to login')
}
