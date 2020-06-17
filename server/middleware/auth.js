const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.header.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user Id'
    } else {
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request !')
    })
  }
}