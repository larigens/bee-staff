// Packages / Dependencies.
const express = require('express');
const mysql = require('mysql2');
const index = require('./index');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Recognizes the incoming Request Object as a JSON Object.

// Creates the connection to database.
const database = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root1234',
        database: 'corporation_db'
    },
    console.log(`Connected to the corporation_db database.`)
);

// Initialize Inquirer.
index.init();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Listens the PORT and starts node.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = database;
