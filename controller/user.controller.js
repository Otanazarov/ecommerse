const pool = require('../db/db.config.js')
const bcrypt = require('bcrypt')
const Pagination = require('../utils/pagination.js')
async function post(req,res,next){
    try {
        let {name,phone,otp,image,region,role,hashedPassword} = req.body
        console.log(hashedPassword);
        const verify = await pool.query(`SELECT * FROM user WHERE name='${name}'`)
        const phoneVerify = await pool.query(`select phone from user where phone =${phone}`)
        if (phoneVerify[0].length!==0) {
            throw new Error(`phone already taken`)
        }
        if(verify[0].length!=0){
            throw new Error(`username already taken`)
        }
        hashedPassword = await bcrypt.hashSync(hashedPassword, 7)  
        console.log(hashedPassword);
        const params = {name,phone,otp,image,region,role,hashedPassword}
        console.log(params);
        const query = 'INSERT INTO user SET ?'
        await pool.query(query,params)
        res.send('true')
    } catch (error) {
        next(error)
    }
    

}

async function get(req,res,next){
    try {
        const ID = req.params.id
        const [result] = await pool.query(`SELECT * FROM user WHERE ID=${ID}`)
        console.log(result[0]);
        if(result[0]===undefined){
            throw new Error(`id not found`)
        }
        res.send(result)
    } catch (error) {
        next(error)
    }
}
async function put(req,res,next){
    try {
        const ID = req.params.id
        console.log(ID);
        const {name,phone,otp,image,region,role} = req.body
        const userID = await pool.query(`select * from category where ID = '${ID}'`)
        const user = {
            name: name !== undefined ? name : userID[0][0].name,
            phone: phone !== undefined ? phone : userID[0][0].phone,
            otp: otp !== undefined ? otp :  userID[0][0].otp,
            image: image !== undefined ? image : userID[0][0].image,
            region: region !== undefined ? region : userID[0][0].region,
            role: role  !==  undefined ? role : userID[0][0].role
          }
          console.log(user);
          const update = (`UPDATE user SET ? where ID = ${ID}`)
          await pool.query(update, user)
          res.send("true")
    } catch (error) {
        next(error)
    }
}
async function remove(req,res,next){
    try {
        const ID = req.params.id 
        const verify = await pool.query(`SELECT * FROM user WHERE ID=${ID}`)
        if(verify[0].length==0){
            throw new Error(`ID not found`)
        }
        await pool.query(`DELETE FROM user WHERE ID=${ID}`)
        res.send("true")
    } catch (error) {
        next(error)
    }
   
}

async function findAll(req,res,next){
    try {
        const {page,paginationLimit} = req.query
        console.log(page);
        const data = await pool.query(`SELECT * FROM user`) 
        const verify = new Pagination(data[0].length,paginationLimit,page)
        const [result] = await pool.query(`SELECT * FROM user LIMIT ${verify.limit} OFFSET ${verify.offset}`)
        if(result.length==0){
            throw new Error(`USER NOT FOUND`)
        }  
        res.send({data:result,pagination:verify})
    } catch (error) {
        next(error)
    }
}


module.exports = {post,get,put,remove,findAll}