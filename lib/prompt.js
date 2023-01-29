const inquirer = require('inquirer');
const { database } = require('../config/connection.js');
const cTable = require('console.table');
const { viewEmployees, getEmployeeList, getManagerList, getManagerID, addEmployee, employeeTable, employeeRolePrompt, updateEmployeeRole, employeeRequest } = require('./employee.js');
const { viewRoles, getRolesList, getRolesID, rolesPrompt, addRole, rolesTable } = require('./roles.js');
const { viewDepartments, departmentPrompt, getDepartmentID, addDepartment, departmentTable, getDepartmentList } = require('./department.js');

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

//========================== Add Prompts ==========================//
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
            insertEmployee(employeeFirstName, employeeLastName, employeeRole, isManager, manager);
        })
        .catch(err => {
            console.error(err);
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

//========================== Add ==========================//
// async function insertRole(role, salary, roleDepartment) {
//     try {
//         const departmentId = await getDepartmentID(roleDepartment);
//         let params = [role, salary, departmentId];
//         add(addRole, params, rolesTable);
//     } catch (error) {
//         console.log(error)
//     }
// }

async function insertEmployee(employeeFirstName, employeeLastName, employeeRole, isManager, manager) {
    try {
        const roleId = await getRolesID(employeeRole);
        // If employee is the manager, the manager_id will be equal to employee.id.
        if (isManager) {
            let managerID = null;
            let params = [employeeFirstName, employeeLastName, roleId, managerID];
            add(addEmployee, params, employeeTable);
        }
        // If employee is not the manager, find manager's id.
        else {
            let managerID = await getManagerID(manager);
            let params = [employeeFirstName, employeeLastName, roleId, managerID];
            add(addEmployee, params, employeeTable);
        }
    } catch (error) {
        console.log(error)
    }
}

//========================== Add ==========================//
async function addADepartment() {
    try {
        let params = await departmentPrompt();
        add(addDepartment, params, departmentTable)
    } catch (error) {
        console.log(error)
    }
}

async function addARole() {
    try {
        const departmentList = await getDepartmentList();
        let results = await rolesPrompt(departmentList);
        const departmentId = await getDepartmentID(results[2]);
        let params = [results[0], results[1], departmentId];
        add(addRole, params, rolesTable);
    } catch (error) {
        console.log(error)
    }
}

async function addAnEmployee() {
    try {
        const rolesList = await getRolesList();
        const managerList = await getManagerList();
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
        const employeeFullNameList = await getEmployeeList();
        const rolesList = await getRolesList();
        let params = await employeeRolePrompt(employeeFullNameList, rolesList);
        update(updateEmployeeRole, params, employeeRequest);
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
