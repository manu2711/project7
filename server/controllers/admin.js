const dbQuery = require('../models/admin')


// Render all articles and all users
exports.all = async (req, res) => {
  // Connection to db which will return the list of all articles
  try {
    const users = await dbQuery.allUsers()
    const articles = await dbQuery.allArticles()
    res.status(200).send({ users, articles })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

// Update admin rights
exports.adminRights = async (req, res) => {
  try {
    const { userId, adminRight } = req.body
    await dbQuery.updateRights(adminRight, userId)
    res.status(200).json({ message: 'User rights have been updated' })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}
