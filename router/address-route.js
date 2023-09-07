const express = require('express')
const addressController = require('../controller/address-controller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const addressRoute = Router()

addressRoute.post('/post',authGuard,roleGuard("admin"),addressController.post)
addressRoute.get('/find/:id',addressController.getByID)
addressRoute.get('/findAll',addressController.findAll)
addressRoute.put('/update/:id',addressController.update)
addressRoute.delete('/delete/:id',addressController.remove)

module.exports = addressRoute
