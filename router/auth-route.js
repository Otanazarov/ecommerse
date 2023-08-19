const express = require('express')
const authRoute = express.Router()
const { Router } = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const pool = require('../db/db.config')
const bcrypt = require('bcrypt')

authRoute.post('/register',async(req,res)=>{
    try{
        const {name,phone,Password} =req.body
        const name_= await pool.query("SELECT name FROM user Where name='"+name+"'")   
        console.log(name_); 
        if(name_[0].length!=0){  
            throw new Error(`Username:${name} already taken`)
        }
        const phone_ = await pool.query("select phone from user where phone = '"+phone+"'")
        if(phone_[0].length!=0){
            throw new Error(`phone:${phone} already taken`)
        }
        await pool.query(`insert into user(name,phone,hashedPassword,role) values('${name}','${phone}','${await bcrypt.hash(Password,2)}','user')`)
        res.send({succes:true})
    }
    catch(error){
        res.send(error.message)
        
    }
})

authRoute.post('/sign',async(req,res)=>{
    try {
        const  {name,Password} = req.body;
        const user= (await pool.query("select * from user where name='"+name+"'"))[0][0]
        console.log(user);
        if(user==undefined ){  
            throw new Error(`WRONG:name or hashedpassword`)
        }
        if( await bcrypt.compareSync(user.hashedPassword,Password)){
            throw new Error("password not current")
        }
        console.log("haelle");
        const accessTokenSecret = process.env.ACCES_WEP_TOKEN
        const refreshTokenSecret = process.env.REFRESH_WEP_TOKEN
        const accesToken = jwt.sign({role:user.role,name:user.name},accessTokenSecret, {
            expiresIn:"120s"
        });
        const refreshToken = jwt.sign(
            {name,role: "admin"},
            refreshTokenSecret,
            {expiresIn:"1d"}
        );
        await pool.query(`Update user set hashedRefreshToken= "${await bcrypt.hash(refreshToken,5)}" where name='${user.name}'`)
        res.send({succes:true,error: null,data:{accesToken,refreshToken}})
    } catch (error) {
        res.send({succes:false,error: error,massage:error.message})
    }
})


module.exports = authRoute