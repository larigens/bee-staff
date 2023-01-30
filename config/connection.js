const mysql = require("mysql2");

// Creates the connection to database.
const database = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root1234",
    database: "corporation_db",
  },
  console.log(`Connected to the database 🍯`)
);

module.exports = { database };
