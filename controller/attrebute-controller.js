const pool = require("../db/db.config.js");
const Pagination = require("../utils/pagination.js");

async function post(req, res, next) {
  try {
    const { name } = req.body;
    const query = `INSERT INTO attribute SET ? `;
    const params = { name };
    await pool.query(query, params);
    res.send("true");
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const ID = req.params.id;
    const [[reselt]] = await pool.query(
      `SELECT * FROM attribute WHERE ID = ${ID}`
    );
    res.send(reselt);
  } catch (error) {
    next(error);
  }
}

async function findAll(req, res, next) {
  try {
    const { page, paginationLimit, catID } = req.query;
    const verify = new Pagination(data.length, paginationLimit, page);
    let data;
    if (catID) {
      const query = `SELECT * FROM category_attribute ca\
         LEFT JOIN attribute a ON ca.attribute_ID = a.ID\
         WHERE ca.category_ID = ? LIMIT ${verify.limit} OFFSET ${verify.offset}`;
      const [result] = await pool.query(query, catID);
      data = result;
    } else {
      data = await pool.query(`SELECT * FROM attribute`);
    }
    res.send({ data, pagination: verify });
  } catch (error) {
    next(error);
  }
}

async function findAllgetbyCatID(req, res, next) {
  try {
    const { page, paginationLimit, ID } = req.query;
    const data = await pool.query(
      `SELECT * FROM attributeValue WHERE ID = ${ID}`
    );
    const verify = new Pagination(data.length, paginationLimit, page);
    const [result] = await pool.query(
      `SELECT * FROM attributeValue WHERE attributeID=${ID}\ 
       LIMIT ${verify.limit} OFFSET ${verify.offset}`
    );
    if (result.length == 0) {
      throw new Error(`attributeID not found`);
    }
    res.send({ data: result, pagination: verify });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const ID = req.params.id;
    const attributeID = await pool.query(
      `select * from attribute where ID = '${ID}'`
    );
    const { name } = req.body;
    const params = {
      name: name !== undefined ? name : attributeID[0][0].name,
    };
    const update = `UPDATE attribute SET ? where ID = ${ID}`;
    await pool.query(update, params);
    res.send("true");
  } catch (error) {
    next(error);
  }
}
async function getSearch(req, res, next) {
  try {
    const { search } = req.query;
    console.log(search);
    if (!search) {
      throw new Error("Search term is required");
    }

    const query = `SELECT * FROM attribute WHERE name LIKE '%${search}%'`;
    console.log(search);
    const [data] = await pool.query(query);
    res.send({ result: data });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const ID = req.params.id;
    const verify = await pool.query(`SELECT * FROM attribute WHERE ID=${ID}`);
    if (verify[0].length == 0) {
      throw new Error(`ID not found`);
    }
    await pool.query(`DELETE FROM attribute WHERE ID=${ID}`);
    res.send("true");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  post,
  getById,
  findAll,
  update,
  remove,
  findAllgetbyCatID,
  getSearch,
};
