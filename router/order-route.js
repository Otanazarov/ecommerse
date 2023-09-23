const express = require('express')
const orderController = require('../controller/order-controller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const orderRoute = Router()

orderRoute.post('/create',orderController.post)
orderRoute.get('/search/:id',orderController.getById)
orderRoute.get('/findAll',orderController.findAll)
orderRoute.put('/update/:id',orderController.update)
orderRoute.delete('/delete/:id',orderController.remove)

module.exports = orderRoute  