const express = require('express')
const favoriteController = require('../controller/favorite-controller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const favoriteRoute = Router()

favoriteRoute.post('/create',favoriteController.post)
favoriteRoute.get('/search/:id',favoriteController.getById)
favoriteRoute.get('/findAll',favoriteController.findAll)
favoriteRoute.put('/update/:id',favoriteController.update)
favoriteRoute.delete('/delete/:id',favoriteController.remove)

module.exports = favoriteRoute  