const mysql  = require('mysql2')

const pool = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'ecommerce',
    password:'root',
    port:8889
}).promise()


 module.exports=pool


   
