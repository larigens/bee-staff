// Packages / Dependencies.
const express = require("express");
const { init } = require("./lib/prompt");
const { database } = require("./config/connection.js");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Recognizes the incoming Request Object as a JSON Object.

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Connects the database
database.connect((err) => {
  err
    ? console.error(err)
    : console.log(`\n
    ******🐝***********🐝***********🐝******\n
    *               🐝 🍯                  *\n
    🍯       Welcome to Bee Staff!        🍯\n
    *               🐝 🍯                  *\n
    ******🐝***********🐝***********🐝******\n`);

  // Initialize Inquirer.
  init();
});

// Listens the PORT and starts node.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🐝`);
});
