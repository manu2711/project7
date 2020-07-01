require('mariadb')
const pool = require('../db_connect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const aws = require('aws-sdk')
const validation = require('../middleware/validation')

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Handle register requests
exports.register = async (req, res) => {
  // User input validation
  const { error } = validation.credential(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  const { name, email, password } = req.body
  // We define the default avatar picture for users profile
  const avatar =
    'https://manu2711groupomania.s3.eu-west-3.amazonaws.com/avatar/default.png'
  try {
    // Connection to Database
    const conn = await pool.getConnection()

    // We check if email entered by new user already exists
    const emailExists = await conn.query(
      'SELECT * FROM users WHERE email = ?', [req.body.email]
    )
    if (emailExists[0]) {
      // If email already exists we send back an error message
      return res.status(400).json({ error: 'Email already in use' })
    }

    // If email is valid, creation of hashed password and saving of the new user in DB
    const hashedPassword = await bcrypt.hash(password, 10)

    // We insert the new user details into db
    await conn.query(
      'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, NULL)', [name, email, hashedPassword, avatar]
    )
    res.status(201).send({ message: `user ${name} has been registered !` })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Handle login requests
exports.login = async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const rows = await conn.query(
      'SELECT * FROM users WHERE email= ?', [req.body.email]
    )

    // Check if login email exists
    if (rows[0] === null) {
      return res.status(400).send({ error: 'Email or Password invalid' })
    }

    // If login email exists, we compare the passwords
    const match = await bcrypt.compare(req.body.password, rows[0].password)
    if (!match) {
      return res.status(400).json({ message: 'Username or Password invalid' })
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
    // Connection to db
    const conn = await pool.getConnection()
    // we get from db the list of articles pubished by user
    const articles = await conn.query(
      'SELECT users.name, articles.* FROM users INNER JOIN articles ON users.id = articles.user_id WHERE articles.user_id= ? ORDER BY articles.date DESC', [userId]
    )
      // we retrieve from db user informations
    const user = await conn.query(
      'SELECT users.name, users.email, users.avatar_url FROM users WHERE id= ?', [userId]
    )
    res.status(200).json({ articles, user })
    conn.release()
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Update user account
exports.updateAccount = async (req, res) => {
  // First we check user inputs
  const { error } = validation.editAccount(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  try {
    const { name, email } = req.body
    const userId = req.params.id
    const conn = await pool.getConnection()
    // we update users information in the db
    await conn.query('UPDATE users SET name= ?, email= ? WHERE id= ? ', [name, email, userId])
    conn.release()
    res.status(200).json({ message: 'Trying to update !' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Update user password
exports.updatePassword = async (req, res) => {
  // We check if passwords match the requirements
  const { error } = validation.updatePassword(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  try {
    const { password, confirmPassword } = req.body
    const userId = req.params.id
    if (password && confirmPassword && password === confirmPassword) {
      // We hash the new password and update the db
      const hashedPassword = await bcrypt.hash(password, 10)
      const conn = await pool.getConnection()
      await conn.query('UPDATE users SET password= ?  WHERE id= ?', [hashedPassword, userId])
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
    // When user deletes account, we affect all is articles to Admnistrator
    await conn.query("UPDATE articles SET user_id='30' WHERE user_id= ?", [id])
    // Then we delete the user from db
    await conn.query('DELETE FROM users WHERE id= ?', [id])
    res.status(200).json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

// For file processing (pictures), we define the location of temporary folder
const upload = multer({ dest: './uploads' })

exports.avatar = [
  upload.single('avatar'),
  async (req, res) => {
    const userId = req.params.id
    // Pictures are store on third party cloud server
    const s3 = new aws.S3()
    try {
      // Before saving the new avatar, we resize it
      const buffer = await sharp(req.file.path)
        .resize(200)
        .toBuffer()
      // Connection to cloud server
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
        'UPDATE users SET avatar_url= ? WHERE id= ?', [s3res.Location, userId]
      )
      conn.release()
      // Deletion of temporary iles
      fs.unlink(req.file.path, () => {
        res.json({ file: s3res.Location })
      })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
]
