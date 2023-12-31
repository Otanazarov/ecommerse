const express = require('express')
const authRoute = express.Router()
const { Router } = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const pool = require('../db/db.config')
const bcrypt = require('bcrypt')
const authGuard = require('../middleware/auth-guard')
const roleGuard = require('../middleware/role-guard')

authRoute.post('/register',async(req,res,next)=>{
    try{
        const {name,phone,Password} =req.body
        const phone_ = await pool.query("select phone from user where phone = '"+phone+"'")
        console.log(phone_);
        if(phone===undefined){
            throw new Error(`need phone`)
        }
        if(phone_[0].length!=0){
            throw new Error(`phone:${phone} already taken`)
        }
        await pool.query(`insert into user(name,phone,hashedPassword,role) values('${name}','${phone}','${await bcrypt.hash(Password,2)}','user')`)
        res.send({succes:true})
    }
    catch(error){
        next(error)
        
    }
})

authRoute.post('/sign',async(req,res,next)=>{
    try {
        const  {phone,Password} = req.body;
        const user= (await pool.query("select * from user where phone='"+phone+"'"))[0][0]
        console.log(user);
        if(user==undefined ){  
            throw new Error(`WRONG: phone`)
        }
        const hashedPassword=user.hashedPassword
        if (!bcrypt.compareSync(Password,hashedPassword)) {
            throw new Error("password not current");
          }
        const accessTokenSecret = process.env.ACCES_WEP_TOKEN
        const refreshTokenSecret = process.env.REFRESH_WEP_TOKEN
        const accesToken = jwt.sign({role:user.role,ID:user.ID},accessTokenSecret, {
            expiresIn:"30m"
        });
        const refreshToken = jwt.sign(
            {ID:user.ID,role:user.role},
            refreshTokenSecret,
            {expiresIn:"5d"}
        );
        await pool.query(`Update user set hashedRefreshToken= "${await bcrypt.hash(refreshToken,5)}" where phone='${user.phone}'`)
        res.send({succes:true,error: null,data:{accesToken,refreshToken}})
    } catch (error) {
        next(error)
    }
})
authRoute.post('/refresh',async(req,res,next)=>{
    const refreshTokenFromClient = req.body.refreshToken
    try {
        const accessTokenSecret = process.env.ACCES_WEP_TOKEN
        const refreshTokenSecret = process.env.REFRESH_WEP_TOKEN
        if (!refreshTokenFromClient){
            throw new Error("JWT MUST BE PROVIDED")
        }
        const {ID,role} =  jwt.verify(refreshTokenFromClient,refreshTokenSecret)
        const user = await pool.query(`SELECT * FROM user WHERE ID=${ID}`)
        if(user[0][0].hashedPassword === undefined){
            throw new Error("refreshToken not found")
        }
        
        const newAccesToken = jwt.sign({ID,role},accessTokenSecret,{expiresIn:"1h"})
        const newRefreshToken =  jwt.sign({ID,role},refreshTokenSecret,{expiresIn:"30d"})
        console.log(newRefreshToken);
        await pool.query(`UPDATE user SET hashedRefreshToken='${newRefreshToken}'`)
         res.send({succes:true,data:{newAccesToken,newRefreshToken}})
    } catch (error) {
        next(error)
    }
})
authRoute.post('/logout/:id',async(req,res,next)=>{
    try {
        const ID=req.params.id
        const [[verify]] = await pool.query(`SELECT * FROM user WHERE ID=${ID}`)
        if(verify===undefined){
            throw new Error(`ID not Found`)
        }
        if(verify.hashedRefreshToken===null){
            throw new Error(`Refresh Already NULL`)
        }
        await pool.query(`UPDATE user SET hashedRefreshToken=NULL WHERE ID='${ID}'`)
       res.send({succes:true})
    } catch (error) {
        next(error)
    }   
})



module.exports = authRoute
