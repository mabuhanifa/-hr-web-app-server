const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "15204008",
  host: "localhost",
  port: 5432,
  database: "employee",
});

module.exports = pool;
