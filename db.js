const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:Rasha%402003@localhost:5432/employee_management";

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;