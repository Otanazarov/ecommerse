const pool = require('../db/db.config.js')
const Pagination = require('../utils/pagination.js')
async function post(req,res){
    try {
        const {nameUz,nameRu,descUz,descRu,image,parentCategoryID} = req.body
        const params = {nameUz,nameRu,descUz,descRu,image,parentCategoryID}
        if(parentCategoryID){
            const [[category]] = await pool.query(`SELECT * FROM category WHERE ID = ?`,parentCategoryID)
            if(!category){
                res.statusCode = 404
                throw new Error(`Category with ID ${parentCategoryID} not found`)
            }
        }
        const query = 'INSERT INTO category SET ?'
        await pool.query(query,params)
        res.send('Succesfully created')
    } catch (error) {
        console.log(error.status);
        res.status(res.statusCode ||
        500).send({succes:false,message:error.message})
    }
}
async function findAll(req,res){
    try {
        const {page,paginationLimit} = req.query
        const  {limit,offset} =  new Pagination(page,paginationLimit)
        const [result] = await pool.query(`SELECT * FROM category LIMIT ${limit} OFFSET ${offset}`)
        if(result.length==0){
            throw new Error(`Category not found`)
        }
        res.send(result)
    } catch (error) {
        res.status(res.statusCode ||
            500).send({succes:false,message:error.message})
    }
}
async function getByID(req,res){
    try {
     const ID = req.params.id
     const [category] = await pool.query(`SELECT * FROM category WHERE ID=${ID}`)
     if(category.length==0){
        throw new Error(`ID not found`)
     }
     res.send(verify[0])
    } catch (error) {
        res.send({succes:false,message:error.message})
    }
}

async function put(req, res) {
    try {
        const ID = req.params.id
        const categoryID = await pool.query(`select * from category where ID = '${ID}'`)
        if (categoryID[0][0] == undefined) {
            throw new Error(`category ${ID} ID not found`)
        }
        const { nameUz, nameRu, descUz, descRu, image } = req.body
        const category = {
            nameUz: nameUz || categoryID[0][0].nameUz,
            nameRu: nameRu || categoryID[0][0].nameRu,
            descUz: descUz || categoryID[0][0].descUz,
            descRu: descRu || categoryID[0][0].descRu,
            image: image   || categoryID[0][0].image
          }
        const update = (`update category set ? where ID = ${ID}`)
        await pool.query(update, category)
        res.send('bingo')
        } catch (error) {
        res.send(error.message)
        }
    }
async function remove(req,res){
    try {
        const ID = req.params.id
        const verify = await pool.query(`SELECT * FROM category WHERE ID=${ID}`)
        if(verify[0].length==0){
            throw new Error(`id not found`)
        }
        const remove = await pool.query(`DELETE FROM category WHERE ID=${ID}`)
        res.send('succes')
    } catch (error) {
        res.send(error.message)
    }
}    




module.exports={post,findAll,getByID,put,remove}