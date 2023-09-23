const pool = require('../db/db.config.js')
const Pagination = require('../utils/pagination.js')

async function post(req, res, next) {
    try {
      const { name,attributeID } = req.body;
      if(!attributeID){
        throw new Error(`attributeID not found`)
      }
      const [[verify]] = await pool.query(`SELECT * FROM attribute WHERE ID=${attributeID}`)
      if(!verify){
        throw new Error(`attributeID${attributeID} not defined`)
      }
      const query = `INSERT INTO attributeValue SET ? `
      const params = {name,attributeID}
      await pool.query(query,params)
      res.send("true");
    } catch (error) {
      next(error);
    }
  }
  
  async function getById(req,res,next) {
    try {
      const ID = req.params.id
      const [[reselt]]  = await pool.query(`SELECT * FROM attributeValue WHERE ID = ${ID}`)
      res.send(reselt)
    } catch (error) {
      next(error)
    }
  }
  
  async function findAll(req,res,next) {
    try {
      const {page,paginationLimit} = req.query
      const data = await pool.query(`SELECT * FROM attributeValue`)
      const verify =  new Pagination(data[0].length,paginationLimit,page)
      const [result] = await pool.query(`SELECT * FROM attributeValue LIMIT ${verify.limit} OFFSET ${verify.offset}`)
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
      const [[attributeID_ ]]= await pool.query(`select * from attributeValue where ID = '${ID}'`)
      const {name,attributeID} = req.body
      if(!attributeID){
        throw new Error(`attributeID not found`)
      }
      const [[attribute]] = await pool.query(`SELECT * FROM attribute WHERE ID=${attributeID} `)
      if(!attribute){
        throw new Error(`attribude id not found`)
      }  
      const params = {
        name: name !== undefined ? name : attributeID_.name,
        attributeID: attributeID !== undefined ? attributeID : attributeID_.attributeID

      }
      const update = (`UPDATE attributeValue SET ? where ID = ${ID}`)
          await pool.query(update,params)
          res.send("true")
  
    } catch (error) {
      next(error)
    }
  }
  
  async function remove(req,res,next){
    try {
        const ID = req.params.id 
        const verify = await pool.query(`SELECT * FROM attributeValue WHERE ID=${ID}`)
        if(verify[0].length==0){
            throw new Error(`ID not found`)
        }
        await pool.query(`DELETE FROM attributeValue WHERE ID=${ID}`)
        res.send("true")
    } catch (error) {
        next(error)
    }
   
  }
  
  module.exports = {post,getById,findAll,update,remove}