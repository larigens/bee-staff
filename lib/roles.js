const { database } = require('../config/connection.js');

//========================== View Roles ==========================//
const viewRoles = `SELECT roles.id AS ID, roles.title AS JobTitle, roles.salary AS Salary, department.department_name AS Department
FROM roles
LEFT JOIN department ON roles.department_id = department.id
ORDER BY roles.id;`;

//========================== Get Roles List ==========================//
const queryRoles = () => {
    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM roles;', (error, rolesResults) => {
            if (error) {
                return reject(error);
            }
            let rolesList = rolesResults.map(rol => rol.title);
            return resolve(rolesList);
        });
    });
};

//========================== Get Roles Id ==========================//
const queryRolesID = (employeeRole) => {
    return new Promise((resolve, reject) => {
        database.query('SELECT id FROM roles WHERE title=?;', [employeeRole], (error, rolesIdResults) => {
            if (error) {
                return reject(error);
            }
            let roleId = rolesIdResults.map(id => parseInt(id.id));
            return resolve(roleId);
        });
    });
};

//========================== Add a Role ==========================//
const addRole = `INSERT into roles (title, salary, department_id) VALUES (?, ?, ?);`;
const rolesTable = "Role";

module.exports = { viewRoles, queryRoles, queryRolesID, addRole, rolesTable }