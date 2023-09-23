const express = require('express')
const basketController = require('../controller/basket-constroller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const basketRoute = Router()

basketRoute.post('/create',basketController.post)
basketRoute.get('/search/:id',basketController.getById)
basketRoute.get('/findAll',basketController.findAll)
basketRoute.put('/update/:id',basketController.update)
basketRoute.delete('/delete/:id',basketController.remove)

module.exports = basketRoute