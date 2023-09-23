const express = require('express')
const { Router } = require('express')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const productRoute = Router()
const productController = require('../controller/pruduct-controller')



productRoute.post("/add",productController.post)
productRoute.get("/get/:id",productController.get)
productRoute.put("/update/:id",productController.put)
productRoute.delete("/delete/:id",productController.remove)
productRoute.get("/",productController.findAll)
productRoute.get("/a",productController.getSearch)









module.exports = productRoute