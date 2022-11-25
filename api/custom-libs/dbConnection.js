let mysql = require('mysql');
port = process.env.PORT || 4205;
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'yopipi_db',charset : 'utf8mb4',
    insecureAuth: true
});
connection.connect();
//console.debug(mysql)
module.exports = connection;
