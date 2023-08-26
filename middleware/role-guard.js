const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');





const roleGuard = (...roles) => {
  return (req, res, next) => {
    const userRole = req.role
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};
module.exports = roleGuard;