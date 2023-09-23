const express = require('express')
const { Router } = require('express')
const attributeRoute = Router()
const attributeController = require('../controller/attrebute-controller')

attributeRoute.post('/create',attributeController.post)
attributeRoute.get('/',attributeController.findAll)
attributeRoute.get('/get/:id',attributeController.getById)
attributeRoute.put('/update/:id',attributeController.update)
attributeRoute.delete('/delete/:id',attributeController.remove)
attributeRoute.get('/cat',attributeController.findAllgetbyCatID)
attributeRoute.get('/name',attributeController.getSearch)




module.exports=attributeRoute