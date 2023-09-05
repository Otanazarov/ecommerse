const express = require('express')
const addressController = require('../controller/address-controller')
const { Router } = require('express')
const addressRoute = Router()

addressRoute.post('/post',addressController.post)
addressRoute.get('/find/:id',addressController.getByID)
addressRoute.get('/findAll',addressController.findAll)
addressRoute.put('/update/:id',addressController.update)
addressRoute.delete('/delete/:id',addressController.remove)

module.exports = addressRoute
