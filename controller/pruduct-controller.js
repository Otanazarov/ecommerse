const pool = require("../db/db.config.js");
const bcrypt = require("bcrypt");
const Pagination = require("../utils/pagination.js");
async function post(req, res, next) {
  try {
    const {
      nameUz,
      nameRu,
      images,
      descShortUz,
      descShortRu,
      descRU,
      descUz,
      cartCount,
      viewCount,
      price,
      isPopular,
      favoriteCount,
      orderCount,
      discount,
    } = req.body;
    const params = {
      nameUz,
      nameRu,
      images,
      descShortUz,
      descShortRu,
      descRU,
      descUz,
      viewCount,
      price,
      isPopular,
      cartCount,
      favoriteCount,
      orderCount,
      discount,
    };
    
    const insertProductQuery = "INSERT INTO product SET ?";
    
    const [result] = await pool.query(insertProductQuery, params);
    console.log(result);
    
    const lastInsertId = result.insertId
    console.log(lastInsertId);

    const insertAttributeQuery = await pool.query(`INSERT INTO product_attributeValue (product_ID) VALUES (${lastInsertId})`)

  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const ID = req.params.id;
    const [result] = await pool.query(`SELECT * FROM product WHERE ID=${ID}`);
    if (result[0] === undefined) {
      throw new Error(`id not found`);
    }
    var viewCound = result[0].viewCount;
    if (result[0]) {
      viewCound += 1;
      const update = await pool.query(
        `UPDATE product SET viewCount=${viewCound} WHERE ID=${ID} `
      );
    }
    console.log(viewCound);

    res.send(result);
  } catch (error) {
    next(error);
  }
}
async function put(req, res, next) {
  try {
    const ID = req.params.id;
    const {
      nameUz,
      nameRu,
      images,
      categoryID,
      descShortUz,
      descShortRu,
      productId,
      descRU,
      descUz,
      cardCount,
      viewCount,
      price,
      isPopular,
      cartCount,
      favoriteCount,
      orderCount,
      discount,
    } = req.body;
    const userID = await pool.query(`select * from product where ID = '${ID}'`);
    const product = {
      nameUz: nameUz !== undefined ? nameUz : userID[0][0].nameUz,
      nameRu: nameRu !== undefined ? nameRu : userID[0][0].nameRu,
      images: images !== undefined ? images : userID[0][0].images,
      categoryID:
        categoryID !== undefined ? categoryID : userID[0][0].categoryID,
      descShortUz:
        descShortUz !== undefined ? descShortUz : userID[0][0].descShortUz,
      descShortRu:
        descShortRu !== undefined ? descShortRu : userID[0][0].descShortRu,
      productId: productId !== undefined ? productId : userID[0][0].productId,
      descRU: descRU !== undefined ? descRU : userID[0][0].descRU,
      descUz: descUz !== undefined ? descUz : [0][0].descUz,
      cardCount: cardCount !== undefined ? cardCount : userID[0][0].cardCount,
      viewCount: viewCount !== undefined ? viewCount : userID[0][0].viewCount,
      price: price !== undefined ? price : userID[0][0].price,
      isPopular: isPopular !== undefined ? isPopular : userID[0][0].isPopular,
      cartCount: cartCount !== undefined ? cartCount : userID[0][0].cartCount,
      favoriteCount:
        favoriteCount !== undefined
          ? favoriteCount
          : userID[0][0].favoriteCount,
      orderCount:
        orderCount !== undefined ? orderCount : userID[0][0].orderCount,
      discount: discount !== undefined ? discount : userID[0][0].discount,
    };
    const update = `UPDATE product SET ? where ID = ${ID}`;
    await pool.query(update, product);
    res.send("true");
  } catch (error) {
    next(error);
  }
}
async function remove(req, res, next) {
  try {
    const ID = req.params.id;
    const verify = await pool.query(`SELECT * FROM product WHERE ID=${ID}`);
    if (verify[0].length == 0) {
      throw new Error(`ID not found`);
    }
    await pool.query(`DELETE FROM product WHERE ID=${ID}`);
    res.send("true");
  } catch (error) {
    next(error);
  }
}

async function findAll(req, res, next) {
  try {
    const { page, paginationLimit, catID, attrValue } = req.query;
    let data;
    let verify;
    if (catID && attrValue) {
      const items = await pool.query(
        `SELECT p.*, av.name
        FROM product p
        JOIN product_attributeValue pav ON p.ID = pav.product_ID
        JOIN attributeValue av ON av.ID = pav.attributeValue_ID
        JOIN category_product cp ON p.ID = cp.product_ID
        JOIN category c ON c.ID = cp.category_ID
        WHERE cp.category_ID = ${catID}
        AND av.ID = ${attrValue}`
      );
      verify = new Pagination(items.length, paginationLimit, page);
      data = await pool.query(
        `SELECT p.*, av.name
        FROM product p
        JOIN product_attributeValue pav ON p.ID = pav.product_ID
        JOIN attributeValue av ON av.ID = pav.attributeValue_ID
        JOIN category_product cp ON p.ID = cp.product_ID
        JOIN category c ON c.ID = cp.category_ID
        WHERE cp.category_ID = ${catID}
        AND av.ID = ${attrValue} LIMIT ${verify.limit} OFFSET ${verify.offset} `
      );
    } else if (catID) {
      const items = await pool.query(
        `SELECT * FROM product JOIN category_product cp ON cp.category_ID =${catID}`
      );
      console.log(catID);
      verify = new Pagination(items.length, paginationLimit, page);
      data = await pool.query(
        `SELECT * FROM product JOIN category_product cp ON cp.category_ID =${catID} AND product.ID = cp.product_ID  LIMIT ${verify.limit} OFFSET ${verify.offset}`
      );
    } else if (attrValue) {
      const items = await pool.query(
        `SELECT p.* FROM product p JOIN attributeValue av JOIN product_attributeValue pav WHERE av.ID = pav.attributeValue_ID AND av.attributeID=${attrValue}`
      );
      verify = new Pagination(items.length, paginationLimit, page);
      data = await pool.query(
        `SELECT p.* FROM product p JOIN attributeValue av JOIN product_attributeValue pav WHERE av.ID = pav.attributeValue_ID AND av.attriubuteID=${attrValue} LIMIT ${verify.limit} OFFSET ${verify.offset} `
      );
    } else {
      const data = await pool.query(`SELECT * FROM product`);
      verify = new Pagination(data[0].length, paginationLimit, page);
      const [result] = await pool.query(
        `SELECT * FROM product LIMIT ${verify.limit} OFFSET ${verify.offset}`
      );
      if (result.length == 0) {
        throw new Error(`PRODUCT NOT FOUND`);
      }
    }
    const [result] = data;

    res.send({ result, pagination: verify });
  } catch (error) {
    next(error);
  }
}

async function getSearch(req, res, next) {
  try {
    const { search } = req.query;
    if (!search) {
      throw new Error("Search term is required");
    }

    const query = `SELECT * FROM product WHERE nameUz LIKE '%${search}%' OR nameRU LIKE '%${search}%'`;
    console.log(search);
    const [data] = await pool.query(query);
    res.send({ result: data });
  } catch (error) {
    next(error);
  }
}

module.exports = { post, get, put, remove, findAll, getSearch };
