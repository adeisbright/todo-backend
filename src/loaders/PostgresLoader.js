const Pool = require("pg").Pool;
module.exports = new Pool({
    user: process.env.REMOTE_PG_USER,
    host: process.env.REMOTE_PG_HOST,
    database: String(process.env.REMOTE_PG_DB).replace("\n", ""),
    password: process.env.REMOTE_PG_PWD,
    port: process.env.REMOTE_PG_PORT,
});
