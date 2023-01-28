const inquirer = require('inquirer');
const { database } = require('../config/connection.js');
const cTable = require('console.table');

//========================== Main Menu ==========================//
const mainMenu = [
    {
        type: "list",
        message: "Please select one of the following options: ",
        name: "menu",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
    }
]

//========================== Initialize App ==========================//
const init = () => {
    inquirer
        .prompt(mainMenu)
        .then((answers) => {
            //========================== View ==========================//
            if (answers.menu === "View all departments") {
                const sql = 'SELECT * FROM department';
                view(sql);
            }
            else if (answers.menu === "View all roles") {
                const sql = `SELECT roles.id AS ID, roles.title AS JobTitle, roles.salary AS Salary, department.department_name AS Department
                 FROM roles
                 JOIN department ON roles.department_id = department.id
                 ORDER BY roles.id;`;
                view(sql);
            }
            // Fix this - is not showing the employees without a manager - 
            else if (answers.menu === "View all employees") {
                const sql = `SELECT a.id AS ID, a.first_name AS FirstName, a.last_name AS LastName, roles.title AS JobTitle, roles.salary AS Salary, department.department_name AS Department, CONCAT_WS(' ', b.first_name, b.last_name) AS Manager
                 FROM employee a
                 JOIN employee b ON a.manager_id = b.id
                 JOIN roles ON a.role_id = roles.id
                 JOIN department ON roles.department_id = department.id
                 ORDER BY id;`;
                view(sql);
            }
            //========================== Add ==========================//
            else if (answers.menu === "Add a department") {
                promptDepartment();
            }
            else if (answers.menu === "Add a role") {
                // Get department list from database.
                database.query('SELECT department_name FROM department;', (err, departmentResults) => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        const departmentList = departmentResults.map(dpt => dpt.department_name);
                        promptRole(departmentList);
                    }
                });
            }
            else if (answers.menu === "Add an employee") {
                // Gets roles list from databse.
                database.query('SELECT * FROM roles;', (err, rolesResults) => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        const rolesList = rolesResults.map(rol => rol.title);
                        // Gets first and last name of all the managers and creates a list.
                        database.query(`SELECT CONCAT_WS(' ',first_name, last_name) AS Manager FROM employee WHERE manager_id = id;`, (err, managerResults) => {
                            if (err) {
                                console.error(err)
                            }
                            else {
                                const managerList = managerResults.map(managerName => managerName.Manager);
                                promptEmployee(rolesList, managerList);
                            }
                        });
                    }
                });
            }
            //========================== Update ==========================//
            else if (answers.menu === "Update an employee role") {
                database.query('SELECT * FROM employee;', (err, employeeResults) => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        employeeFullNameList = employeeResults.map(emp => emp.first_name + " " + id.last_name);
                        database.query('SELECT * FROM roles;', (err, rolesResults) => {
                            if (err) {
                                console.error(err)
                            }
                            else {
                                const rolesList = rolesResults.map(rol => rol.title);
                                updateEmployee(employeeFullNameList, rolesList);
                            }
                        });
                    }
                })
                    .catch(err => {
                        console.error(err);
                    })
            }
        })
}

//========================== Resolved Prompts ==========================//

//========================== Add Prompts ==========================//

const promptDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the department's name: ",
                name: "department",
                validate: answers => {
                    if (!answers.trim()) {
                        return "Please enter the department's name!";
                    }
                    else {
                        return true;
                    }
                }
            }
        ]
        )
        .then((answer) => {
            const { department } = answer;
            const sql = `INSERT into department (department_name) VALUES (?);`
            const table = "Department";
            add(sql, department, table);
        })
        .catch(err => {
            console.error(err);
        })
}

const promptRole = (departmentList) => {
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
            }
        ])
        .then((answer) => {
            const { role, salary, roleDepartment } = answer;
            const sql = `INSERT into roles (title, salary, department_id) VALUES (?, ?, ?);`
            const table = "Role";
            database.query('SELECT id FROM department WHERE department_name=?;', [roleDepartment], (err, data) => {
                const departmentId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                let params = [role, salary, departmentId];
                add(sql, params, table);
            })
        })
        .catch(err => {
            console.error(err);
        })
}

const promptEmployee = (rolesList, managerList) => {
    inquirer
        .prompt([
            {
                type: "number",
                message: "Please enter the employee's ID: ",
                name: "employeeId",
                validate: answers => {
                    if (!answers) {
                        return "Please enter the employee's ID!";
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "Please enter the employee's first name: ",
                name: "employeeFirstName",
                validate: answers => {
                    if (!answers.trim()) {
                        return "Please enter the employee's first name!";
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "Please enter the employee's last name: ",
                name: "employeeLastName",
                validate: answers => {
                    if (!answers.trim()) {
                        return "Please enter the employee's last name!";
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                type: "list",
                message: "Please enter the employee's role: ",
                name: "employeeRole",
                choices: rolesList
            },
            {
                type: "confirm",
                message: "Is he/she the manager?",
                name: "isManager",
            },
            {
                type: "confirm",
                message: "Does he/she has a manager?",
                name: "hasManager",
                when(answer) {
                    return answer.isManager === false;
                }
            },
            {
                type: "list",
                message: "Please enter the employee's manager: ",
                name: "manager",
                when(answer) {
                    return answer.isManager === false && answer.hasManager === true;
                },
                choices: managerList
            }
        ])
        .then((answer) => {
            let { employeeId, employeeFirstName, employeeLastName, employeeRole, isManager, hasManager, manager } = answer;
            const sql = `INSERT into employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?);`;
            const table = 'Employee';
            database.query('SELECT id FROM roles WHERE title=?;', [employeeRole], (err, data) => {
                if (err) {
                    console.error(err)
                }
                else {
                    roleId = data.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
                    // If employee is the manager, the manager_id will be equal to employee.id.
                    if (isManager) {
                        let managerID = employeeId;
                        let params = [employeeId, employeeFirstName, employeeLastName, roleId, managerID];
                        add(sql, params, table);
                    }
                    // If employee is not the manager and does not has a manager, set manager_id to null.
                    else if (!isManager && !hasManager) {
                        let managerID = null;
                        let params = [employeeId, employeeFirstName, employeeLastName, roleId, managerID];
                        add(sql, params, table);
                    }
                    // If employee has a manager, find manager's id.
                    else {
                        database.query(`SELECT manager_id FROM employee WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`, [manager], (err, data) => {
                            if (err) {
                                console.error(err)
                            }
                            else {
                                let managerID = data.map(id => parseInt(id.manager_id)); // Collects the value of the id and converts it to an integer.
                                let params = [employeeId, employeeFirstName, employeeLastName, roleId, managerID];
                                add(sql, params, table);
                            }
                        });
                    }
                }
            });
        })
        .catch(err => {
            console.error(err);
        })
}

//========================== Update Prompts ==========================//
const updateEmployee = (employeeFullNameList, rolesList) => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select the employee that you would like to update",
                name: "findEmployee",
                choices: employeeFullNameList
            },
            {
                type: "input",
                message: "Please select the employee's new role: ",
                name: "updatedRole",
                choices: rolesList
            }])
        .then((answer) => {
            let fullName = answer.findEmployee;
            let newRole = answer.updatedRole;
            const sql = `UPDATE employee SET role_id=? WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`;
            let params = [fullName, newRole];
            const request = "Employee's role";
            update(sql, params, request);
        })
        .catch(err => {
            console.log(err);
        })
}

//========================== Query Database ==========================//

// View
const view = (sql) => {
    database.query(sql, (err, data) => {
        err ? console.error(err) : console.table('\n Requested Data', data);
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

// Add
const add = (sql, params, table) => {
    database.query(sql, params, (err, data) => {
        err ? console.error(err) : console.log(`\n ${table} added successfully 🐝\n`);
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

// Update
const update = (sql, params, request) => {
    database.query(sql, params, (err, data) => {
        err ? console.error(err) : console.log(`\n ${request} updated successfully 🐝\n`);
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

module.exports = { init }
