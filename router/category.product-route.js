const express = require('express')
const category_productController = require('../controller/category_product-cantroller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const category_productRoute = Router()

category_productRoute.post('/create',category_productController.post)
category_productRoute.get('/search/:id',category_productController.getById)
category_productRoute.get('/',category_productController.findAll)
category_productRoute.put('/update/:id',category_productController.update)
category_productRoute.delete('/delete/:id',category_productController.remove)

module.exports = category_productRoute