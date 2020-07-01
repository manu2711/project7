const jwt = require('jsonwebtoken')

// Creation of Auth middleware in order to check availability and validity of token
module.exports = (req, res, next) => {
  try {
    // We check the token received with the request
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    const userId = decodedToken.userId
    // We check that the userId from the token matches the userId from the request
    if (req.body.userId && req.body.userId !== userId) {
      // if we have a no match, we throw an error
      throw 'Invalid user ID'
    } else {
      // otherwise we jump to the following controller
      next()
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    })
  }
}
