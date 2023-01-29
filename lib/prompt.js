const inquirer = require('inquirer');
const { database } = require('../config/connection.js');
const cTable = require('console.table');
const { viewEmployees, queryEmployee, queryManagers, queryManagerID, addEmployee, employeeTable } = require('./employee.js');
const { viewRoles, queryRoles, queryRolesID, addRole, rolesTable } = require('./roles.js');
const { viewDepartments, queryDeparment, departmentQuestion, addDepartment, departmentTable, queryDeparmentID } = require('./department.js');

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
                view(viewDepartments);
            }
            else if (answers.menu === "View all roles") {
                view(viewRoles);
            }
            else if (answers.menu === "View all employees") {
                view(viewEmployees);
            }
            //========================== Add ==========================//
            else if (answers.menu === "Add a department") {
                addADepartment();
            }
            else if (answers.menu === "Add a role") {
                addARole()
            }
            else if (answers.menu === "Add an employee") {
                addAnEmployee()
            }
            //========================== Update ==========================//
            else if (answers.menu === "Update an employee role") {
                updateAnEmployee()
            }
        })
}

//========================== Resolved Prompts ==========================//

//========================== Add Prompts ==========================//
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
            }])
        .then((answer) => {
            const { role, salary, roleDepartment } = answer;
            getDepartmentId(role, salary, roleDepartment)
        })
        .catch(err => {
            console.error(err);
        })
}

const promptEmployee = (rolesList, managerList) => {
    inquirer
        .prompt([
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
                type: "list",
                message: "Please enter the employee's manager: ",
                name: "manager",
                when(answer) {
                    return answer.isManager === false;
                },
                choices: managerList
            }
        ])
        .then((answer) => {
            let { employeeFirstName, employeeLastName, employeeRole, isManager, manager } = answer;
            getRolesId(employeeFirstName, employeeLastName, employeeRole, isManager, manager);
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
                type: "list",
                message: "Please select the employee's new role: ",
                name: "updatedRole",
                choices: rolesList
            }])
        .then((answer) => {
            let fullName = answer.findEmployee;
            let newRole = answer.updatedRole;
            const sql = `UPDATE employee SET role_id=(SELECT id FROM roles WHERE title=?) WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`;
            let params = [newRole, fullName];
            const request = "Employee's role";
            update(sql, params, request);
        })
        .catch(err => {
            console.log(err);
        })
}

//========================== Query Database ==========================//

//========================== View ==========================//
const view = (sql) => {
    database.query(sql, (err, data) => {
        err ? console.error(err) : console.table('\n Requested Data', data);
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

//========================== Get ==========================//
async function getDepartmentId(role, salary, roleDepartment) {
    try {
        const departmentId = await queryDeparmentID(roleDepartment);
        let params = [role, salary, departmentId];
        add(addRole, params, rolesTable);
    } catch (error) {
        console.log(error)
    }
}

async function getRolesId(employeeFirstName, employeeLastName, employeeRole, isManager, manager) {
    try {
        const roleId = await queryRolesID(employeeRole);
        // If employee is the manager, the manager_id will be equal to employee.id.
        if (isManager) {
            let managerID = null;
            let params = [employeeFirstName, employeeLastName, roleId, managerID];
            add(addEmployee, params, employeeTable);
        }
        // If employee is not the manager, find manager's id.
        else {
            let managerID = await queryManagerID(manager);
            let params = [employeeFirstName, employeeLastName, roleId, managerID];
            add(addEmployee, params, employeeTable);
        }
    } catch (error) {
        console.log(error)
    }
}

//========================== Add ==========================//
const addADepartment = () => {
    inquirer
        .prompt(departmentQuestion)
        .then((answer) => {
            const { department } = answer;
            add(addDepartment, department, departmentTable);
        })
        .catch(err => {
            console.error(err);
        })
}

async function addARole() {
    try {
        const departmentList = await queryDeparment();
        promptRole(departmentList)
    } catch (error) {
        console.log(error)
    }
}

async function addAnEmployee() {
    try {
        const rolesList = await queryRoles();
        const managerList = await queryManagers();
        promptEmployee(rolesList, managerList);
    } catch (error) {
        console.log(error)
    }
}

const add = (sql, params, table) => {
    database.query(sql, params, (err, data) => {
        err ? console.error(err) : console.log(`\n ${table} added successfully 🐝\n`);
        //Function to update the managerid based on the generated employee's id.
        database.query(`SELECT id FROM employee WHERE manager_id IS NULL;`, (err, data) => {
            if (err) {
                console.error(err)
            }
            else {
                const sql = `UPDATE employee SET manager_id=id WHERE manager_id IS NULL;`;
                const request = "Manager's ID";
                updateManagerID(sql, request);
            }
        })
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

//========================== Update ==========================//

async function updateAnEmployee() {
    try {
        const employeeFullNameList = await queryEmployee();
        const rolesList = await queryRoles();
        updateEmployee(employeeFullNameList, rolesList);
    } catch (error) {
        console.log(error)
    }
}

const update = (sql, params, request) => {
    database.query(sql, params, (err, data) => {
        err ? console.error(err) : console.log(`\n ${request} updated successfully 🐝\n`);
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

const updateManagerID = (sql, request) => {
    database.query(sql, (err, data) => {
        err ? console.error(err) : console.log(`\n ${request} updated successfully 🐝\n`);
    })
}

module.exports = { init }
