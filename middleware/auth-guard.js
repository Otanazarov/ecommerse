const jwt = require('jsonwebtoken');
const pool = require('../db/db.config')
const authGuard = async (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1]
  try {
    const accesTokenSecret = process.env.ACCES_WEP_TOKEN
    const decoded = jwt.verify(token,accesTokenSecret);
    req.ID = decoded.ID;
    req.role = decoded.role
    const user = await pool.query(`SELECT * FROM user WHERE ID=${decoded.ID}`)
    console.log(user);
    if(user[0][0].hashedRefreshToken == null){
      throw new Error('refresh token not found')
    }
    next();
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
module.exports = authGuard;