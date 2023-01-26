// Dependencies.
const { database } = require('../config/connection.js');
const cTable = require('console.table');
const { updateEmployeeRole, findManagerId } = require('./employee');
const { returnToMenu } = require('./prompt');

// View
const getRoles = () => {
    database.query('SELECT * FROM roles;', (err, data) => {
        err ? console.error(err) : console.table('\n\n Requested Data', data);
    });
}

// Add
const addNewRole = (role, salary, departmentId) => {
    database.query('INSERT into roles (title, salary, department_id) VALUES (?, ?, ?);', [role, salary, departmentId], (err, data) => {
        err ? console.error(err) : console.table('\n Role added successfully 🐝\n', data);
        returnToMenu();
    });
}

// Find ID
const findRoleId = (fullName, newRole) => {
    database.query('SELECT id FROM roles WHERE title=?;', [newRole], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            if (data !== "") {
                var roleId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                updateEmployeeRole(fullName, roleId);
            }
        }
    });
}

// Find ID
const getRoleId = (employeeId, employeeFirstName, employeeLastName, employeeRole, manager) => {
    database.query('SELECT id FROM roles WHERE title=?;', [employeeRole], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            var roleId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
            findManagerId(employeeId, employeeFirstName, employeeLastName, roleId, manager);
        }
    });
}

module.exports = { getRoles, addNewRole, findRoleId, getRoleId };