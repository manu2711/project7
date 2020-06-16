require('mariadb')
const pool = require('../db_connect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Handle register requests
exports.register = async (req, res) => {
  const { name, email, password } = req.body
  try {
    // Connection to Database
    const conn = await pool.getConnection()

    // Check if email entered by new user already exists
    const emailExists = await conn.query(
      `SELECT * FROM users WHERE user_email = '${req.body.email}'`
    )
    if (emailExists[0]) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // If email is valid, creation of hashed password and saving of the new user in DB
    const hashedPassword = await bcrypt.hash(password, 10)

    await conn.query(
      `INSERT INTO users VALUES (NULL, '${name}', '${email}', '${hashedPassword}')`
    )
    res.status(201).send({ message: `user ${name} has been registered !` })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
    console.log(error)
  }
}

// Handle login requests
exports.login = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const rows = await conn.query(
      `SELECT * FROM users WHERE user_email= '${req.body.email}'`
    )

    // Check if login email exists
    if (rows[0] == null) {
      return res.send({ message: 'Email or Password invalid' })
    }

    // If login email exists, we compare the passwords
    const match = await bcrypt.compare(req.body.password, rows[0].user_password)
    if (!match) {
      return res.status(403).json({ message: 'Incorrect Password' })
    } else if (match) {
      // If credentials are ok, we return a token
      res.status(200).json({
        user: {
          name: rows[0].user_name,
          id: rows[0].id
        },
        token: jwt.sign({ userId: rows[0].id }, process.env.SECRET_TOKEN, {
          expiresIn: '24h'
        })
      })
    }
    conn.release()
  } catch (error) {
    res.status(500).json({ message: 'Username or Password invalid' })
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const conn = await pool.getConnection()
    await conn.query(
      `DELETE FROM users WHERE id='${id}'`
    )
    res.status(200).json({ message: 'user deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
}
