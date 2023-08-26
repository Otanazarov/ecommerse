const jwt = require('jsonwebtoken');
const authGuard = (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1]
  console.log(token);
  try {
    const accesTokenSecret = process.env.ACCES_WEP_TOKEN
    const decoded = jwt.verify(token,accesTokenSecret);
    req.id = decoded.id;
    req.role = decoded.role
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports = authGuard;