// Dependencies.
const { database } = require('../config/connection.js');
const cTable = require('console.table');
const { returnToMenu } = require('./prompt');

// View
const getEmployees = () => {
    database.query('SELECT * FROM employee;', (err, data) => {
        err ? console.error(err) : console.table('\n\n Requested Data', data);
    });
}

// Add
const addEmployee = (employeeId, employeeFirstName, employeeLastName, roleId, managerId) => {
    database.query('INSERT into employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?);', [employeeId, employeeFirstName, employeeLastName, roleId, managerId], (err, data) => {
        err ? console.error(err) : console.table('\n Employee added successfully 🐝\n', data);
        returnToMenu();
    });
}


// Update
const updateEmployeeRole = (fullName, roleId) => {
    database.query(`UPDATE employee SET role_id=? WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`, [roleId, fullName], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n Role updated successfully 🐝\n', data);
            returnToMenu();
        }
    });
}

// Find manager's ID
const findManagerId = (employeeId, employeeFirstName, employeeLastName, roleId, manager) => {
    database.query(`SELECT manager_id FROM employee WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`, [manager], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            var managerId = data.map(id => parseInt(id.manager_id)); // Collects the value of the id and converts it to an integer.
            addEmployee(employeeId, employeeFirstName, employeeLastName, roleId, managerId);
        }
    });
}

module.exports = { getEmployees, updateEmployeeRole, findManagerId };