
const pool = require('../db/db.config')
const Pagination = require('../utils/pagination')

async function post(req,res,next){
    try {
        const {userID,region,refrencePoint,street,house,room} = req.body
        const params = {userID,region,refrencePoint,street,house,room}
        const query = (`INSERT INTO address SET ?`)
        await pool.query(query,params)
        res.send('Succesfully created')
    } catch (error) {
        next(error)
    }
}

async function getByID(req,res,next){
    try {
       const ID = req.params.id
       const [find] = await pool.query
       (`SELECT user.ID, user.name, user.phone, address.region, address.street,address.house 
        FROM user INNER JOIN address ON ${ID} = user.ID`)  
        res.send(find)
    } catch (error) {
        next(error)
    }
}

async function findAll(req,res,next){
    try {
        const {page,paginatoinLimit} = req.query
        const all = await pool.query(`SELECT * FROM address`)
        const pagination = new Pagination(all[0].length,paginatoinLimit,page)
        console.log(pagination.offset);
        const [data] = await pool.query
        (`SELECT user.ID, user.name, user.phone, address.region, address.street,address.house  
        FROM user INNER JOIN address ON address.ID=user.ID LIMIT ${pagination.limit} OFFSET ${pagination.offset}`)
        if(data.length==0){
            throw new Error(`Category not found`)
        }
        res.send({data:data,pagination:pagination})
    } catch (error) {
        next(error)
    }
}

async function update(req,res,next){
    try {
        const ID = req.params.id
        console.log(ID);
    const [[information]] = await pool.query(`SELECT * FROM address WHERE ID=${ID}`)
    console.log(information);
    if (information===undefined){
        throw new Error(`ID not found`)
    }
    const {userID,region,refrencePoint,street,house,room} = req.body
    const params = {userID,region,refrencePoint,street,house,room}
    const address = {
        userID:userID!== undefined ? userID : information.userID,
        region:region!== undefined ? region : information.region,
        refrencePoint:refrencePoint!== undefined ? refrencePoint :information.refrencePoint,
        street:street!==undefined ? street : information.street,
        house:house!==undefined ? house : information.house,
        room:room!==undefined ? room : information.room
    }
        const update = `UPDATE address SET ? WHERE ID =${ID}`
        await pool.query(update,address)
        res.send('true')
    } catch (error) {
        next(error)
    }
}
async function remove(req,res,next){
    try {
        const ID = req.params.id
        const [[verify]] = await pool.query(`SELECT * FROM address WHERE ID=${ID}`)
        console.log(verify);
        if(verify === undefined){
            throw new Error(`id not found`)
        }
        await pool.query(`DELETE FROM address WHERE ID=${ID}`)
        res.send("succesfuly")
    } catch (error) {
        next(error)
    }
}


module.exports = {post,getByID,findAll,update,remove}