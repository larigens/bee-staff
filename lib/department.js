const { database } = require('../config/connection.js');
const inquirer = require('inquirer');

//========================== View Departments ==========================//
const viewDepartments = `SELECT department.id AS ID, department.department_name AS Department FROM department`;

const departmentBudgetPrompt = (departmentList) => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Please select the department that you would like to view total utilized budget: ",
                    name: "department",
                    choices: departmentList
                }])
            .then((answer) => {
                let { department } = answer;
                return resolve(department);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const viewBudget = `SELECT department.department_name AS Department, SUM(roles.salary) AS Budget 
FROM employee
LEFT JOIN roles ON role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
WHERE roles.department_id=(SELECT id FROM department WHERE department_name=?)
GROUP BY Department`

//========================== Get Department List ==========================//
const getDepartmentList = () => {
    return new Promise((resolve, reject) => {
        // Gets the name of all departments.
        database.promise().query('SELECT department_name FROM department;')
            .then(([rows]) => {
                // Creates an array with the name of all departments.
                let departmentList = rows.map(dpt => dpt.department_name);
                return resolve(departmentList);
            })
            .catch(error => {
                return reject(error);
            })
    });
}

//========================== Get Department Id ==========================//
const getDepartmentID = (roleDepartment) => {
    return new Promise((resolve, reject) => {
        // Gets the department id based on the department's name.
        database.promise().query('SELECT id FROM department WHERE department_name=?;', [roleDepartment])
            .then(([rows]) => {
                // Converts the object to an array with the departments id.
                let departmentId = rows.map(id => id.id);
                return resolve(departmentId);
            })
            .catch(error => {
                return reject(error);
            })
    });
}

//========================== Add a Department ==========================//
const departmentPrompt = () => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([{
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
            ])
            .then((answer) => {
                // Destructuring Assignment
                let { department } = answer;
                return resolve(department);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const addDepartment = `INSERT into department (department_name) VALUES (?);`;
const departmentTable = "Department";

//========================== Delete Department ==========================//
const deleteDepartmentPrompt = (departmentList) => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Please select the department that you would like to delete: ",
                    name: "department",
                    choices: departmentList
                }])
            .then((answer) => {
                let { department } = answer;
                return resolve(department);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const deleteDepartment = `DELETE FROM department WHERE department_name=?;`;

module.exports = { viewDepartments, viewBudget, departmentBudgetPrompt, getDepartmentList, getDepartmentID, departmentPrompt, addDepartment, departmentTable, deleteDepartmentPrompt, deleteDepartment }