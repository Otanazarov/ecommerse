const express = require('express')
const app = express()
const {config} = require('dotenv')
const pool =require('./db/db.config')
const authRoute = require('./router/auth-route')
const authGuard = require('./middleware/auth-guard')
const attributeRoute = require('./router/attribute-route.js')
const attributeValueRoute = require('./router/attributeValue-route')
const roleGuard = require('./middleware/role-guard')
const categoryRoute = require('./router/category-route')
const userRoute = require('./router/user-route')
const ApiResponse = require('./utils/response.js')
const addressRoute = require('./router/address-route')
const productRoute = require('./router/product-route')
const categoryaAttributeRoute = require('./router/categoryAttribute.route')
const category_productRoute = require('./router/category.product-route')
const basketRoute = require('./router/basket-route')
const favoriteRoute = require('./router/favorite-route')
const orderRoute = require ('./router/order-route')
const reviewRoute = require('./router/review-route')


const multer = require('multer');



config()

app.use(express.json())
const port= process.env.PORT || 3001
 
app.listen(port,()=> {
    console.log(`server on  running  ${port}` );
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+(".png"))
    }
  })
  const upload = multer({storage:storage})

app.post("/upload",upload.array('photos',12),(req,res)=>{
      const url = []
      for( i in req.files){
        url.push(req.files[i].path)
      }
      res.send(url)
})

app.use("/uploads",express.static("./uploads"))


app.use("/user",userRoute)
app.use("/auth",authRoute)
app.use("/category",categoryRoute)
app.use("/address",addressRoute)
app.use("/product",productRoute)
app.use("/attribute",attributeRoute)
app.use("/value",attributeValueRoute)
app.use("/categoryValue",categoryaAttributeRoute)
app.use("/categoryProduct",category_productRoute)
app.use("/basket",basketRoute)
app.use("/favorite",favoriteRoute)
app.use("/order",orderRoute)
app.use("/review",reviewRoute)


app.use((err,req,res,next)=>{
    res.send(new ApiResponse(null,null,err.message));
})












