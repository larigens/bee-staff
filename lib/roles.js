const { database } = require('../config/connection.js');
const inquirer = require('inquirer');

//========================== View Roles ==========================//
const viewRoles = `SELECT roles.id AS ID, roles.title AS JobTitle, roles.salary AS Salary, department.department_name AS Department
FROM roles
LEFT JOIN department ON roles.department_id = department.id
ORDER BY roles.id;`;

const viewRolesByDepartment = `SELECT roles.id AS ID, roles.title AS JobTitle, roles.salary AS Salary, department.department_name AS Department
FROM roles
LEFT JOIN department ON roles.department_id = department.id
ORDER BY Department;`;

//========================== Get Roles List ==========================//
const getRolesList = () => {
    return new Promise((resolve, reject) => {
        // Gets all the info of all roles.
        database.promise().query('SELECT * FROM roles;')
            .then(([rows]) => {
                // Creates an array with the title of all roles.
                let rolesList = rows.map(rol => rol.title);
                return resolve(rolesList);
            })
            .catch(error => {
                return reject(error);
            })
    });
};

//========================== Get Roles Id ==========================//
const getRolesID = (employeeRole) => {
    return new Promise((resolve, reject) => {
        // Gets the role id based on the title.
        database.promise().query('SELECT id FROM roles WHERE title=?;', [employeeRole])
            .then(([rows]) => {
                // Converts the object to an array with the roles id.
                let roleId = rows.map(id => parseInt(id.id));
                return resolve(roleId);
            })
            .catch(error => {
                return reject(error);
            })
    });
};

//========================== Add a Role ==========================//
const rolesPrompt = (departmentList) => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Please enter the role: ",
                    name: "role",
                    validate: answers => {
                        if (!answers.trim()) {
                            return "Please enter the role!";
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    type: "number",
                    message: "Please enter the role's salary: ",
                    name: "salary",
                    validate: answers => {
                        if (answers === NaN) {
                            return "Please enter the role's salary!";
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    type: "list",
                    message: "Please select the role's department: ",
                    name: "roleDepartment",
                    choices: departmentList
                }])
            .then((answer) => {
                // Destructuring Assignment
                let { role, salary, roleDepartment } = answer;
                let results = [role, salary, roleDepartment]
                return resolve(results);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const addRole = `INSERT into roles (title, salary, department_id) VALUES (?, ?, ?);`;
const rolesTable = "Role";

//========================== Delete Role ==========================//
const deleteRolePrompt = (rolesList) => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Please select the role that you would like to delete: ",
                    name: "role",
                    choices: rolesList
                }])
            .then((answer) => {
                let { role } = answer;
                return resolve(role);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const deleteRole = `DELETE FROM roles WHERE title=?;`;

module.exports = { viewRoles, viewRolesByDepartment, getRolesList, getRolesID, rolesPrompt, addRole, rolesTable, deleteRolePrompt, deleteRole }