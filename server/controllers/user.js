require('mariadb')
const pool = require('../db_connect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const aws = require('aws-sdk')

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Handle register requests
exports.register = async (req, res) => {
  const { name, email, password } = req.body
  const avatar =
    'https://manu2711groupomania.s3.eu-west-3.amazonaws.com/avatar/default.png'
  try {
    // Connection to Database
    const conn = await pool.getConnection()

    // Check if email entered by new user already exists
    const emailExists = await conn.query(
      `SELECT * FROM users WHERE email = '${req.body.email}'`
    )
    if (emailExists[0]) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // If email is valid, creation of hashed password and saving of the new user in DB
    const hashedPassword = await bcrypt.hash(password, 10)

    await conn.query(
      'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, NULL)', [name, email, hashedPassword, avatar]
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
    console.log(req.headers)
    const conn = await pool.getConnection()
    const rows = await conn.query(
      'SELECT * FROM users WHERE email= ?', [req.body.email]
    )

    // Check if login email exists
    if (rows[0] == null) {
      return res.send({ message: 'Email or Password invalid' })
    }

    // If login email exists, we compare the passwords
    const match = await bcrypt.compare(req.body.password, rows[0].password)
    if (!match) {
      return res.status(403).json({ message: 'Incorrect Password' })
    } else if (match) {
      // If credentials are ok, we return a token
      res.status(200).json({
        user: {
          name: rows[0].name,
          id: rows[0].id,
          isAdmin: rows[0].is_admin
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

// Render profile informations
exports.profile = async (req, res) => {
  try {
    const userId = req.params.id
    const conn = await pool.getConnection()
    const articles = await conn.query(
      `SELECT users.name, articles.*
      FROM users
      INNER JOIN articles
      ON users.id = articles.user_id
      WHERE articles.user_id='${userId}'
      ORDER BY articles.date DESC`
    )

    const user = await conn.query(
      `SELECT users.name, users.email, users.avatar_url  FROM users WHERE id=${userId}`
    )
    res.status(200).json({ articles, user })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Update user account
exports.updateAccount = async (req, res) => {
  try {
    const { name, email } = req.body
    console.log(name, email)
    const userId = req.params.id
    const conn = await pool.getConnection()
    await conn.query(`UPDATE users SET name='${name}', email='${email}' WHERE id='${userId}'`)
    conn.release()
    res.status(200).json({ message: 'Trying to update !' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body
    const userId = req.params.id
    if (password && confirmPassword && password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const conn = await pool.getConnection()
      await conn.query(`UPDATE users SET password='${hashedPassword}' WHERE id='${userId}'`)
      conn.release()
      res.status(200).json({ message: 'Password update !' })
    } else res.status(400).json({ message: 'passwords do not match' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Delete a user
exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const conn = await pool.getConnection()
    await conn.query(`UPDATE articles SET user_id='30' WHERE user_id='${id}'`)
    await conn.query(`DELETE FROM users WHERE id='${id}'`)
    res.status(200).json({ message: 'user deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Update user avatar
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/avatars')
  },
  filename: function (req, file, callback) {
    const unique = Date.now()
    callback(null, unique + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

exports.avatar = [
  upload.single('avatar'),
  async (req, res) => {
    const userId = req.params.id
    const s3 = new aws.S3()
    try {
      const buffer = await sharp(req.file.path)
        .resize(200)
        .toBuffer()

      const s3res = await s3
        .upload({
          Bucket: 'manu2711groupomania/avatar',
          Key: `${Date.now() + '-' + req.file.originalname}`,
          Body: buffer,
          ACL: 'public-read'
        })
        .promise()

      const conn = await pool.getConnection()

      await conn.query(
        `UPDATE users SET avatar_url='${s3res.Location}' WHERE id=${userId}`
      )
      conn.release()

      fs.unlink(req.file.path, () => {
        res.json({ file: s3res.Location })
      })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
]
