const pool = require('../db/db.config.js')
async function post(req,res){
    try {
        const {name,phone,otp,image,region,role} = req.body
        const verify = await pool.query(`SELECT * FROM user WHERE name='${name}'`)
        console.log(verify[0]);
        if(verify[0].length!=0){
            throw new Error(`username already taken`)
        }
        const params = {name,phone,otp,image,region,role}
        const query = 'INSERT INTO user SET ?'
        await pool.query(query,params)
        res.send('true')
    } catch (error) {
        res.send({error:error.message})
    }
    

}

async function get(req,res){
    try {
        const ID = req.params.id
        const [result] = await pool.query(`SELECT * FROM user WHERE ID=${ID}`)
        res.send(result)
    } catch (error) {
        console.log({error:error.message});
    }
}
async function put(req,res){
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
        console.log({error:error.message});
    }
}
async function remove(req,res){
    try {
        const ID = req.params.id 
        const verify = await pool.query(`SELECT * FROM user WHERE ID=${ID}`)
        if(verify[0].length==0){
            throw new Error(`ID not found`)
        }
        await pool.query(`DELETE FROM user WHERE ID=${ID}`)
        res.send("true")

    } catch (error) {
        res.send({error:error.message})
    }
   
}


module.exports = {post,get,put,remove}