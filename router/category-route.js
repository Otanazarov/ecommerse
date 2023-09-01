const express = require('express')
const { Router } = require('express')
const categoryRoute = Router()
const jwt = require('jsonwebtoken')
const app = express()
const pool = require('../db/db.config')
const bcrypt = require('bcrypt')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const authRoute = require('./auth-route')
const categoryController = require('../controller/category-controlller.js')


categoryRoute.post("/controller",authGuard,roleGuard("admin","moderator"),categoryController.post)

categoryRoute.get("/page",categoryController.findAll)

categoryRoute.get("/search/:id",categoryController.getByID)

categoryRoute.put("/update/:id",categoryController.put)

categoryRoute.delete("/remove/:id",authGuard,roleGuard("admin","moderator"),categoryController.remove)




module.exports=categoryRoute