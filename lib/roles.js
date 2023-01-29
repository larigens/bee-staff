const { database } = require('../config/connection.js');
const inquirer = require('inquirer');

//========================== View Roles ==========================//
const viewRoles = `SELECT roles.id AS ID, roles.title AS JobTitle, roles.salary AS Salary, department.department_name AS Department
FROM roles
LEFT JOIN department ON roles.department_id = department.id
ORDER BY roles.id;`;

//========================== Get Roles List ==========================//
const getRolesList = () => {
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
const getRolesID = (employeeRole) => {
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

module.exports = { viewRoles, getRolesList, rolesPrompt, getRolesID, addRole, rolesTable }