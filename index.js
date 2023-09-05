const express = require('express')
const app = express()
const {config} = require('dotenv')
const pool =require('./db/db.config')
const authRoute = require('./router/auth-route')
const authGuard = require('./middleware/auth-guard')
const roleGuard = require('./middleware/role-guard')
const categoryRoute = require('./router/category-route')
const userRoute = require('./router/user-route')
const ApiResponse = require('./utils/response.js')
const addressRoute = require('./router/address-route')


config()

app.use(express.json())
const port= process.env.PORT || 3001
 
app.listen(port,()=> {
    console.log(`server on  running  ${port}` );
})
app.use("/user",userRoute)
app.use("/auth",authRoute)
app.use("/category",categoryRoute)
app.use("/address",addressRoute)


app.use((err,req,res,next)=>{
    res.send(new ApiResponse(null,null,err.message));
})












