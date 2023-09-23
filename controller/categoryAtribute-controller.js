const pool = require('../db/db.config.js')
const Pagination = require('../utils/pagination.js')


async function post(req, res, next) {
  try {
    const { category_ID,attribute_ID} = req.body;
    if(!category_ID || !attribute_ID){
      throw new Error(`category_ID or attributeID not found`)
    }
    const query = `INSERT INTO category_attribute SET ? `
    const [[category]] = await pool.query(`SELECT * FROM category WHERE ID=${category_ID}`)
    const [[attriubteID]] = await pool.query(`SELECT * FROM attribute WHERE ID =${attribute_ID}`)
    if(!category){
        throw new Error(`category id not found`)
    }
    if(!attriubteID){
        throw new Error(`attribute id not found`)
    }
    const params = {category_ID,attribute_ID}
    await pool.query(query,params)
    res.send("true");
  } catch (error) {
    next(error);
  }
}

async function getById(req,res,next) {
  try {
    const ID = req.params.id
    const [[reselt]]  = await pool.query(`SELECT * FROM category_attribute WHERE category_ID = ${ID}`)
    res.send(reselt)
  } catch (error) {
    next(error)
  }
}

async function findAll(req,res,next) {
  try {
    const {page,paginationLimit} = req.query
    const data = await pool.query(`SELECT * FROM attribute`)
    const verify =  new Pagination(data[0].length,paginationLimit,page)
    const [result] = await pool.query(`SELECT * FROM attribute LIMIT ${verify.limit} OFFSET ${verify.offset}`)
    if(result.length==0){
      throw new Error(`Category not found`)
  }
  res.send({data:result,pagination:verify})
  } catch (error) {
    next(error)
  }
}

async function update(req,res,next) {
  try {
    const ID = req.params.id
    const {category_ID,attribute_ID} = req.body
    if(!category_ID || !attribute_ID){
      throw new Error(`category_ID or attributeID not found`)
    }
    const [[categoryAttribute]] = await pool.query(`SELECT * FROM category_attribute WHERE category_ID=${ID}`)
    console.log(categoryAttribute.category_ID);
    const [[attributeID]] = await pool.query(`select * from attribute where ID = '${attribute_ID}'`)
    const [[category]] = await pool.query(`SELECT * FROM category WHERE ID=${category_ID}`)
    if(!category){
      throw new Error(`category id not found`)
    }
    if (!attributeID){
      throw new Error(`atribute id not found`)
    }
    const params = {
      category_ID:category_ID !== undefined ? category_ID:categoryAttribute.category_ID,
      attributeID:attribute_ID !== undefined ? attribute_ID:categoryAttribute.attribute_ID
    }
        const update = `UPDATE attribute SET ? WHERE ID=${ID}`
        await pool.query(update,params)
        res.send("true")

  } catch (error) {
    next(error)
  }
}

async function remove(req,res,next){
  try {
      const ID = req.params.id 
      const verify = await pool.query(`SELECT * FROM category_attribute WHERE category_ID=${ID}`)
      if(verify[0].length==0){
          throw new Error(`ID not found`)
      }
      await pool.query(`DELETE FROM category_attribute WHERE category_ID=${ID}`)
      res.send("true")
  } catch (error) {
      next(error)
  }
 
}

module.exports = {post,getById,findAll,update,remove}

