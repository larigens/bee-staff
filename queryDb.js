// Dependencies.
const mysql = require('mysql2');
const cTable = require('console.table');

// Creates the connection pool. 
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root1234',
    database: 'corporation_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Query database
const getDepartments = () => {
    pool.query('SELECT * FROM department;', (err, data) => {
        err ? console.log(err) : console.table('\n\n Requested Data', data)
    });
}

const getRoles = () => {
    pool.query('SELECT * FROM roles;', (err, data) => {
        err ? console.log(err) : console.table('\n\n Requested Data', data)
    });
}

const getEmployees = () => {
    pool.query('SELECT * FROM employee;', (err, data) => {
        err ? console.log(err) : console.table('\n\n Requested Data', data)
    });
}

const addDepartment = (department) => {
    pool.query('INSERT into department (department_name) VALUES (?);', department, (err, data) => {
        err ? console.log(err) : console.table('\n Department added successfully 🚀', data)
    });
}

const findDepartment = (roleDepartment) => {
    pool.query('SELECT id FROM department WHERE department_name=?;', roleDepartment, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n\n Requested Data', data) 
            // var departmentId = row['id'];
            // console.log(departmentId);
        }
    });

}

// const addRole = (role, salary) => {
//     pool.query('INSERT into roles (title, salary) VALUES (?);', department, (err, data) => {
//         err ? console.log(err) : console.table('\n Role added successfully 🚀', data)
//     });
// }

module.exports = { getDepartments, getRoles, getEmployees, addDepartment, findDepartment }
