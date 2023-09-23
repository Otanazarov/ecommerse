const pool = require('../db/db.config.js')
const Pagination = require('../utils/pagination.js')
async function post(req, res, next) {
    try {
      const { productID, userID, addressID, deliveryTime, orderStatus, deliveryPrice } = req.body;
      const query = `INSERT INTO \`order\` SET ?`; 
      const [[product]] = await pool.query(`SELECT * FROM product WHERE ID = ${productID}`);
      const [[user]] = await pool.query(`SELECT * FROM user WHERE ID = ${userID}`);
      const [[address]] = await pool.query(`SELECT * FROM address WHERE ID = ${addressID}`);
      if (!product) {
        throw new Error(`productID not found`);
      }
      if (!user) {
        throw new Error(`userID not found`);
      }
      if (!address) {
        throw new Error(`addressID not found`);
      }
      const params = { productID, userID, addressID, deliveryTime, orderStatus, deliveryPrice };
      await pool.query(query, params);
      res.send("true");
    } catch (error) {
      next(error);
    }
  }

async function getById(req,res,next) {
  try {
    const ID = req.params.id
    const [[reselt]]  = await pool.query(`SELECT * FROM \`order\` WHERE ID = ${ID}`)
    res.send(reselt)
  } catch (error) {
    next(error)
  }
}

async function findAll(req,res,next) {
  try {
    const {page,paginationLimit} = req.query
    const data = await pool.query(`SELECT * FROM \`order\``)

    const verify =  new Pagination(data[0].length,paginationLimit,page)
    const [result] = await pool.query(`SELECT * FROM \`order\` LIMIT ${verify.limit} OFFSET ${verify.offset}`)
    if(result.length==0){
      throw new Error(`favorite not found`)
  }
  res.send({data:result,pagination:verify})
  } catch (error) {
    next(error)
  }
}

async function update(req,res,next) {
  try {
    const ID = req.params.id
    const { productID, userID, addressID, deliveryTime, orderStatus, deliveryPrice } = req.body
    if(!addressID || !productID || !userID){
        throw new Error(`adressID or productID or userID  undifined`)
    }
    const [[product]] = await pool.query(`SELECT * FROM product WHERE ID=${ID}`)
    const [[user]] = await pool.query(`select * from user where ID = ${userID}`)
    const [[order]] = await pool.query(`SELECT * FROM \`order\` WHERE ID=${ID}`)
    const [[address]] = await pool.query(`SELECT * FROM address WHERE ID = ${addressID}`);
    console.log(address);
    if(!product){
      throw new Error(`product id not found`)
    }
    if (!user){
      throw new Error(`user id not found`)
    }
    if(!address){
        throw new Error(`address id not found`)
    }
    const params = {
      userID:userID !== undefined ? userID:order.userID,
      productID:productID !== undefined ? productID:order.productID,
      addressID:addressID !== undefined ? addressID:order.addressID,
      deliveryTime:deliveryTime !== undefined ? deliveryTime:order.deliveryTime,
      orderStatus:orderStatus !== undefined ? orderStatus:order.orderStatus,
      deliveryPrice:deliveryPrice !== undefined ? deliveryPrice:order.deliveryPrice
    }
        const update = `UPDATE \`order\` SET ? WHERE ID=${ID}`
        await pool.query(update,params)
        res.send("true")

  } catch (error) {
    next(error)
  }
}

async function remove(req,res,next){
  try {
      const ID = req.params.id 
      const verify = await pool.query(`SELECT * FROM \`order\` WHERE ID=${ID}`)
      if(verify[0].length==0){
          throw new Error(`ID not found`)
      }
      await pool.query(`DELETE FROM \`order\` WHERE ID=${ID}`)
      res.send("true")
  } catch (error) {
      next(error)
  }
 
}

module.exports = {post,getById,findAll,update,remove}  