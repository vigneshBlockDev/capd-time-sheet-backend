const mysql = require("mysql");
module.exports = mysql.createPool({
    connectionLimit: 100,
    host: "den1.mysql4.gear.host",
    user: "webdata4",
    password: "Yy3Ni~8zE8k_",
    database: "webdata4",
    connectTimeout: 20000,
    acquireTimeout: 20000
});
