const jwt = require('jsonwebtoken');

const ensureAuthorized = (req, res, next) => {
  const bearerHeader = req.headers["authorization"]

  if (bearerHeader === undefined) {
    return res.status(400).json({ message: 'required to be auth' })
  }

  const token = bearerHeader.split("Bearer ")[1]

  if (token === undefined) {
    return res.status(400).json({ message: 'required to be auth' })
  }

  try {
    const bar_id = jwt.verify(token, process.env.JWT_SECRET)
    if (bar_id) {
      req.bar_id = bar_id
      next()
    }
  } catch (err) {
    return res.status(400).json({ message: 'jwt malformed' })
  }
}

module.exports = {ensureAuthorized};