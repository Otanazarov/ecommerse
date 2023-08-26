const express = require('express')
const { Router } = require('express')
const categoryRoute = Router()
const jwt = require('jsonwebtoken')
const app = express()
const pool = require('../db/db.config')
const bcrypt = require('bcrypt')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')
const authRoute = require('./auth-route')
const categoryController = require('../controller/category-controlller.js')


categoryRoute.post("/controller",authGuard,roleGuard("admin","moderator"),categoryController.post)

categoryRoute.get("/page",categoryController.findAll)

categoryRoute.get("/search/:id",categoryController.getByID)

categoryRoute.put("/update/:id",categoryController.put)

categoryRoute.delete("/remove/:id",authGuard,roleGuard("admin","moderator"),categoryController.remove)


// categoryRoute.post('/',authGuard,roleGuard("admin","moderator"),async(req,res)=>{
//     try {
//         const {nameUz,nameRu,descUz} = req.body
//         const js=await pool.query(`Insert into category(nameUZ,nameRu,descUz) values('${nameUz}','${nameRu}','${descUz}')`)
//         console.log(js);
//         res.send({succes:true})
//     } catch (error) {
//         res.send(error.message)
//     }
// })
// categoryRoute.get('/categories/:id', async (req, res) => {
//     const categoryId = req.params.id;
//     try {
//       const results = await pool.query(`SELECT * FROM category WHERE id='${categoryId}'`);
//       console.log(results[0]);
//       if (results[0].length ==0) {
//         res.status(404).json({ error: 'Category not found' });
//       } else {
//         res.json(results[0][0]);
//       }
//     } catch (err) {
//       res.send(err);
//     }
//   });
// categoryRoute.put('/',authGuard,roleGuard("admin","moderator"),async(req,res)=>{
//     try {
//       const {nameUz,nameRu,descUz} = req.body
//       await  pool.query(`UPDATE category SET nameUZ='${nameUz}',nameRu='${nameRu}',descUz='${descUz}'`)
//       res.send({succes:true})
//     } catch (error) {
//         res.send(error.message)
//     }
// })
// categoryRoute.delete('/:id',authGuard,roleGuard("admin"),async(req,res)=>{
//   try {
//     const deleteID = req.params.id
//     await pool.query(`Delete FROM category WHERE ID='${deleteID}'`)
//     res.send({succes:true})
//   } catch (error) {
//     res.send(error.message)
//   }
// })

module.exports=categoryRoute