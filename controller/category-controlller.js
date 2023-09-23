const pool = require('../db/db.config.js')
const Pagination = require('../utils/pagination.js')
async function post(req,res,next){
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
        next(error)
    }
}
async function findAll(req,res,next){
    try {
        const {page,paginationLimit} = req.query
        const data = await pool.query(`SELECT * FROM category`)
        const verify =  new Pagination(data[0].length,paginationLimit,page)
        const [result] = await pool.query(`SELECT * FROM category LIMIT ${verify.limit} OFFSET ${verify.offset}`)
        console.log(verify.limit);
        if(result.length==0){
            throw new Error(`Category not found`)
        }
        res.send({data:result,pagination:verify})
    } catch (error) {
        next(error)
    }
}
async function getByID(req,res,next){
    try {
     const ID = req.params.id
     const [category] = await pool.query(`SELECT * FROM category WHERE ID=${ID}`)
     console.log(category);
     if(category.length==0){
        throw new Error(`ID not found`)
     }
     res.send(category[0])
    } catch (error) {
        next(error)
    }
}

async function put(req, res,next) {
    try {
        const ID = req.params.id
        const categoryID = await pool.query(`select * from category where ID = '${ID}'`)
        if (categoryID[0][0] == undefined) {
            throw new Error(`category ${ID} ID not found`)
        }
        const { nameUz, nameRu, descUz, descRu, image } = req.body
        const params = { nameUz, nameRu, descUz, descRu, image }
        const category = {
            nameUz: nameUz !== undefined ? nameUz : categoryID[0][0].nameUz,    
            nameRu: nameRu !== undefined ? nameRu : categoryID[0][0].nameRu,
            descUz: descUz !== undefined ? descUz : categoryID[0][0].descUz,
            descRu: descRu !== undefined ? descRu : categoryID[0][0].descRu,
            image: image   !== undefined ? image  : categoryID[0][0].image
          }
          console.log(category);
        const update = (`update category set ? where ID = ${ID}`)
        await pool.query(update, category)
        res.send('bingo')}
         catch (error) {
         next(error)
        }
    }
    

async function remove(req,res,next){
    try {
        const ID = req.params.id
        const verify = await pool.query(`SELECT * FROM category WHERE ID=${ID}`)
        if(verify[0].length==0){
            throw new Error(`id not found`)
        }
        const remove = await pool.query(`DELETE FROM category WHERE ID=${ID}`)
        res.send('succes')
    } catch (error) {
        next(error)
    }
}    




module.exports={post,findAll,getByID,put,remove}