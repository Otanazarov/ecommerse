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

// const roles = {
//     admin: 'admin',
//     editor: 'editor',
//     guest: 'guest' 
//   }

//   function roleGuard(role) {
//     return function(req, res, next) {
//         console.log(role);
//       // Get user role from request
//       const userRole = req.body.role;
//       console.log(userRole);
      
//       if (userRole === roles[role]) {
//         next() // User has right role, call next middleware
//       } else {
//         res.status(403).send('Unauthorized')
//       }   
//     }
//   }

module.exports = roleGuard;