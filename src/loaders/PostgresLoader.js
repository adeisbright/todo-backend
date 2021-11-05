const Pool = require("pg").Pool;
module.exports = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: String(process.env.PG_DB).replace("\n", ""),
    password: process.env.PG_PWD,
    port: process.env.PG_PORT,
});
