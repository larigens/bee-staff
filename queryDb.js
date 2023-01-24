// Dependencies.
const mysql = require('mysql2');
const cTable = require('console.table');
const index = require('./index')

// Creates the connection pool to be able to query the db.
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
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n\n Requested Data', data)
            index.returnToMenu();
        }
    });
}

const getRoles = () => {
    pool.query('SELECT * FROM roles;', (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n\n Requested Data', data)
            index.returnToMenu();
        }
    });
}

const getEmployees = () => {
    pool.query('SELECT * FROM employee;', (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n\n Requested Data', data)
            index.returnToMenu();
        }
    });
}

const addDepartment = (department) => {
    pool.query('INSERT into department (department_name) VALUES (?);', department, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n Department added successfully 🚀\n', data);
            index.returnToMenu();
        }
    });
}

const findDepartment = (role, salary, roleDepartment) => {
    pool.query('SELECT id FROM department WHERE department_name=?;', roleDepartment, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            if (roleDepartment !== "") {
                var departmentId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                addRole(role, salary, departmentId)
                console.log('\n\n Requested Data', departmentId)
            }
            else {
                console.log('\n Inexistent department, please add a department first!')
                index.returnToMenu();
            }
        }
    });
}

const addRole = (role, salary, departmentId) => {
    pool.query('INSERT into roles (title, salary, department_id) VALUES (?, ?, ?);', [role, salary, departmentId], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n Role added successfully 🚀\n', data);
            index.returnToMenu();
        }
    });
}

const findRole = (employeeId, employeeFirstName, employeeLastName, employeeRole, manager) => {
    pool.query('SELECT id FROM roles WHERE title=?;', employeeRole, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            if (data !== "") {
                var roleId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                findManager(employeeId, employeeFirstName, employeeLastName, roleId, manager)
                console.log('\n\n Requested Data', roleId)
            }
            else {
                console.log('\n Inexistent role , please add a role first!')
                index.returnToMenu();
            }
        }
    });
}

const findManager = (employeeId, employeeFirstName, employeeLastName, roleId, manager) => {
    pool.query('SELECT id FROM employee WHERE manager_id;', (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            if (manager !== "") {
                manager = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                checkManager(employeeId, employeeFirstName, employeeLastName, roleId, manager)
                console.log('\n\n Requested Data', manager)
            }
            else {
                manager = 0;
                checkManager(employeeId, employeeFirstName, employeeLastName, roleId, manager)
            }
        }
    });
}

const checkManager = (employeeId, employeeFirstName, employeeLastName, roleId, manager) => {
    if (employeeFirstName + "" + employeeLastName === manager) {
        manager === employeeId;
        addManager(employeeId, employeeFirstName, employeeLastName, roleId, manager)
    }
    else {
        addEmployee(employeeId, employeeFirstName, employeeLastName, roleId, manager)
    }
}

// If it is the manager - update function to add manager id to all the employess data
const addManager = (employeeId, employeeFirstName, employeeLastName, roleId, manager) => {
    pool.query('INSERT into employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?);', [employeeId, employeeFirstName, employeeLastName, roleId, manager], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n Employee added successfully 🚀\n', data);
            index.returnToMenu();
        }
    });
}

const addEmployee = (employeeId, employeeFirstName, employeeLastName, roleId, manager) => {
    pool.query('INSERT into employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?);', [employeeId, employeeFirstName, employeeLastName, roleId, manager], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n Employee added successfully 🚀\n', data);
            index.returnToMenu();
        }
    });
}

const findNewRole = (getFirstName, getLastName, updateRole) => {
    pool.query('SELECT id FROM roles WHERE title=?;', updateRole, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            if (data !== "") {
                var roleId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                updateEmployeeRole(getFirstName, getLastName, roleId);
                console.log('\n\n Requested Data', roleId)
            }
            else {
                console.log('\n Inexistent role , please add a role first!')
                index.returnToMenu();
            }
        }
    });
}

const updateEmployeeRole = (getFirstName, getLastName, roleId) => {
    pool.query('UPDATE employee SET role_id=? WHERE first_name=?, last_name=?;', [roleId, getFirstName, getLastName], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.table('\n Role updated successfully 🚀\n', data);
            index.returnToMenu();
        }
    });
}

module.exports = { getDepartments, getRoles, getEmployees, addDepartment, findDepartment, findRole, findNewRole }
