const pool = require('../db/db.config.js')
const Pagination = require('../utils/pagination.js')


async function post(req, res, next) {
  try {
    const {productID,userID} = req.body;
    if(!productID || !userID){
      throw new Error(`productID or userID not found`)
    }
    const query = `INSERT INTO basket SET ? `
    const [[product]] = await pool.query(`SELECT * FROM product WHERE ID=${productID}`)
    const [[user]] = await pool.query(`SELECT * FROM user WHERE ID =${userID}`)
    if(!product){
        throw new Error(`productID not found`)
    }
    if(!user){
        throw new Error(`userID not found`)
    }
    const params = {productID,userID}
    await pool.query(query,params)
    res.send("true");
  } catch (error) {
    next(error);
  }
}

async function getById(req,res,next) {
  try {
    const ID = req.params.id
    const [[reselt]]  = await pool.query(`SELECT * FROM basket WHERE ID = ${ID}`)
    res.send(reselt)
  } catch (error) {
    next(error)
  }
}

async function findAll(req,res,next) {
  try {
    const {page,paginationLimit} = req.query
    const data = await pool.query(`SELECT * FROM basket`)
    const verify =  new Pagination(data[0].length,paginationLimit,page)
    const [result] = await pool.query(`SELECT * FROM basket LIMIT ${verify.limit} OFFSET ${verify.offset}`)
    if(result.length==0){
      throw new Error(`basket not found`)
  }
  res.send({data:result,pagination:verify})
  } catch (error) {
    next(error)
  }
}

async function update(req,res,next) {
  try {
    const ID = req.params.id
    const {productID,userID} = req.body
    if(!productID || !userID){
      throw new Error(`productID or userID not found`)
    }
    const [[product]] = await pool.query(`SELECT * FROM product WHERE ID=${ID}`)
    console.log(product);
    const [[user]] = await pool.query(`select * from user where ID = '${userID}'`)
    const [[basket]] = await pool.query(`SELECT * FROM basket WHERE ID=${ID}`)
    if(!product){
      throw new Error(`product id not found`)
    }
    if (!user){
      throw new Error(`user id not found`)
    }
    const params = {
      userID:userID !== undefined ? userID:basket.userID,
      productID:productID !== undefined ? productID:basket.productID
    }
        const update = `UPDATE basket SET ? WHERE ID=${ID}`
        await pool.query(update,params)
        res.send("true")

  } catch (error) {
    next(error)
  }
}

async function remove(req,res,next){
  try {
      const ID = req.params.id 
      const verify = await pool.query(`SELECT * FROM basket WHERE ID=${ID}`)
      if(verify[0].length==0){
          throw new Error(`ID not found`)
      }
      await pool.query(`DELETE FROM basket WHERE ID=${ID}`)
      res.send("true")
  } catch (error) {
      next(error)
  }
 
}

module.exports = {post,getById,findAll,update,remove}

