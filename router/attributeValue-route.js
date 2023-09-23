const express = require('express')
const attributeValueController = require('../controller/attributeValue-controller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const attributeValueRoute = Router()

attributeValueRoute.post('/create',attributeValueController.post)
attributeValueRoute.get('/search/:id',attributeValueController.getById)
attributeValueRoute.get('/findAll',attributeValueController.findAll)
attributeValueRoute.put('/update/:id',attributeValueController.update)
attributeValueRoute.delete('delete/:id',attributeValueController.remove)

module.exports = attributeValueRoute
