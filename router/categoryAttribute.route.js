const express = require('express')
const attributeValueController = require('../controller/categoryAtribute-controller')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const { Router } = require('express')
const categoryaAttributeRoute = Router()

categoryaAttributeRoute.post('/create',attributeValueController.post)
categoryaAttributeRoute.get('/search/:id',attributeValueController.getById)
categoryaAttributeRoute.get('/findAll',attributeValueController.findAll)
categoryaAttributeRoute.put('/update/:id',attributeValueController.update)
categoryaAttributeRoute.delete('/delete/:id',attributeValueController.remove)

module.exports = categoryaAttributeRoute