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
                let department = answer.department;
                return resolve(department);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const viewBudget = `SELECT SUM(salary) AS Budget FROM roles WHERE department_id=(SELECT id FROM department WHERE department_name=?);`

//========================== Get Department List ==========================//
const getDepartmentList = () => {
    return new Promise((resolve, reject) => {
        database.promise().query('SELECT department_name FROM department;')
            .then(([rows]) => {
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
        database.promise().query('SELECT id FROM department WHERE department_name=?;', [roleDepartment])
            .then(([rows]) => {
                let departmentId = rows.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
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
                let department = answer.department;
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
                let department = answer.department;
                return resolve(department);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const deleteDepartment = `DELETE FROM department WHERE department_name=?;`;


module.exports = { viewDepartments, viewBudget, departmentBudgetPrompt, getDepartmentList, getDepartmentID, departmentPrompt, addDepartment, departmentTable, deleteDepartmentPrompt, deleteDepartment }