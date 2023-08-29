const get = require('../controller/user.controller')
const express = require('express')
const { Router } = require('express')
const userRoute = Router()
const userController = require('../controller/user.controller')

userRoute.post('/add',userController.post)
userRoute.get('/information/:id',userController.get)
userRoute.put('/update/:id',userController.put)
userRoute.delete('/delete/:id',userController.remove)






module.exports = userRoute
