const express = require('express')
const reviewController = require('../controller/rerview-controller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const reviewRoute = Router()

reviewRoute.post('/create',reviewController.post)
reviewRoute.get('/search/:id',reviewController.getById)
reviewRoute.get('/findAll',reviewController.findAll)
reviewRoute.put('/update/:id',reviewController.update)
reviewRoute.delete('/delete/:id',reviewController.remove)

module.exports = reviewRoute  