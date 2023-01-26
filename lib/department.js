// Dependencies.
const { database } = require('../config/connection.js');
const cTable = require('console.table');
const { addNewRole } = require('./roles.js');
const { returnToMenu } = require('./prompt');

// View
const getDepartments = () => {
    database.query('SELECT * FROM department;', (err, data) => {
        err ? console.error(err) : console.table('\n\n Requested Data', data);
    });
}

// Add
const addDepartment = (department) => {
    database.query('INSERT into department (department_name) VALUES (?);', [department], (err, data) => {
        err ? console.error(err) : console.table('\n Department added successfully 🍯\n', data);
        returnToMenu();
    });
}

// Find ID
const findDepartmentId = (role, salary, roleDepartment) => {
    database.query('SELECT id FROM department WHERE department_name=?;', [roleDepartment], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            var departmentId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
            addNewRole(role, salary, departmentId)
        }
    });
}

module.exports = { getDepartments, addDepartment, findDepartmentId };