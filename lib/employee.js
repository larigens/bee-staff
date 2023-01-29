const { database } = require('../config/connection.js');

//========================== View Employees ==========================//
const viewEmployees = `SELECT a.id AS ID, a.first_name AS FirstName, a.last_name AS LastName, roles.title AS JobTitle, department.department_name AS Department, roles.salary AS Salary, CONCAT_WS(' ', b.first_name, b.last_name) AS Manager
FROM employee a
LEFT JOIN employee b ON a.manager_id = b.id
LEFT JOIN roles ON a.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
ORDER BY id;`;

//========================== Get Employees List ==========================//
const queryEmployee = () => {
    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM employee;', (error, employeeResults) => {
            if (error) {
                return reject(error);
            }
            let employeeFullNameList = employeeResults.map(emp => emp.first_name + " " + emp.last_name);
            return resolve(employeeFullNameList);
        });
    });
};

//========================== Get Managers List ==========================//
const queryManagers = () => {
    return new Promise((resolve, reject) => {
        // Gets first and last name of all the managers and creates a list.
        database.query(`SELECT CONCAT_WS(' ',first_name, last_name) AS Manager FROM employee WHERE manager_id = id;`, (error, managerResults) => {
            if (error) {
                return reject(error);
            }
            let managerList = managerResults.map(managerName => managerName.Manager);
            return resolve(managerList);
        });
    });
}

//========================== Get Managers Id ==========================//
const queryManagerID = (manager) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT manager_id FROM employee WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`, [manager], (error, managerIdResults) => {
            if (error) {
                return reject(error);
            }
            let managerID = managerIdResults.map(id => parseInt(id.manager_id)); // Collects the value of the id and converts it to an integer.
            return resolve(managerID);
        });
    });
}

//========================== Add an Employee ==========================//
const addEmployee = `INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
const employeeTable = 'Employee';

module.exports = { viewEmployees, queryEmployee, queryManagers, queryManagerID, addEmployee, employeeTable }