const express = require('express')
const app = express()
const {config} = require('dotenv')
const pool =require('./db/db.config')
const authRoute = require('./router/auth-route')
const authGuard = require('./middleware/auth-guard')
const roleGuard = require('./middleware/role-guard')
const categoryRoute = require('./router/category-route')


config()
app.use(express.json())

const port= process.env.PORT || 3001
 
app.listen(port,()=> {
    console.log(`server on  running  ${port}` );
})

app.use("/auth",authRoute)
app.use("/category",categoryRoute)















