const inquirer = require('inquirer');
const { database } = require('../config/connection.js');
const cTable = require('console.table');
const { viewEmployees, promptEmployee, getEmployeeList, getManagerList, getManagerID, addEmployee, employeeTable, employeeRolePrompt, updateEmployeeRole, updateRoleRequest, employeeManagerPrompt, updateEmployeeManager, updateManagerRequest, updateManagerID, managerParams, managerRequest } = require('./employee.js');
const { viewRoles, getRolesList, getRolesID, rolesPrompt, addRole, rolesTable } = require('./roles.js');
const { viewDepartments, getDepartmentList, getDepartmentID, departmentPrompt, addDepartment, departmentTable } = require('./department.js');

//========================== Main Menu ==========================//
const mainMenu = [
    {
        type: "list",
        message: "Please select one of the following options: ",
        name: "menu",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update an employee manager"]
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
                updateARole()
            }
            else if (answers.menu === "Update an employee manager") {
                updateAManager()
            }
        })
}

//========================== Query Database ==========================//

//========================== View ==========================//
const view = (sql) => {
    database.query(sql, (err, data) => {
        err ? console.error(err) : console.table('\n Requested Data 🐝🍯', data);
        console.log("---------------------------------------------------------🐝🍯---------------------------------------------------------\n");
        setTimeout(init, 1000);
    })
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
        let results = await promptEmployee(rolesList, managerList);
        const roleId = await getRolesID(results[2]);
        // If employee is the manager, the manager_id will be equal to employee.id.
        if (results[3]) {
            let managerID = null;
            let params = [results[0], results[1], roleId, managerID];
            add(addEmployee, params, employeeTable);
            //Function to update the managerid based on the generated employee's id.
            update(updateManagerID, managerParams, managerRequest)
        }
        // If employee is not the manager, find manager's id.
        else {
            let managerID = await getManagerID(results[4]);
            let params = [results[0], results[1], roleId, managerID];
            add(addEmployee, params, employeeTable);
        }
    } catch (error) {
        console.log(error)
    }
}

const add = (sql, params, table) => {
    database.query(sql, params, (err, data) => {
        err ? console.error(err) : console.log(`\n ${table} added successfully 🐝\n`);
        console.log("----------🐝🍯----------\n");
        setTimeout(init, 1000);
    })
}

//========================== Update ==========================//
async function updateARole() {
    try {
        const employeeFullNameList = await getEmployeeList();
        const rolesList = await getRolesList();
        let params = await employeeRolePrompt(employeeFullNameList, rolesList);
        update(updateEmployeeRole, params, updateRoleRequest);
    } catch (error) {
        console.log(error)
    }
}

async function updateAManager() {
    try {
        const employeeFullNameList = await getEmployeeList();
        const managerList = await getManagerList();
        let results = await employeeManagerPrompt(employeeFullNameList, managerList);
        let managerID = await getManagerID(results[0]);
        let params = [managerID, results[1]];
        update(updateEmployeeManager, params, updateManagerRequest);
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

module.exports = { init }