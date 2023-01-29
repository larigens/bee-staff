const { database } = require('../config/connection.js');

//========================== View Departments ==========================//
const viewDepartments = 'SELECT * FROM department';

//========================== Get Department List ==========================//
const queryDeparment = () => {
    return new Promise((resolve, reject) => {
        database.query('SELECT department_name FROM department;', (error, departmentResults) => {
            if (error) {
                return reject(error);
            }
            let departmentList = departmentResults.map(dpt => dpt.department_name);
            return resolve(departmentList);
        });
    });
}

//========================== Get Department Id ==========================//
const queryDeparmentID = (roleDepartment) => {
    return new Promise((resolve, reject) => {
        database.query('SELECT id FROM department WHERE department_name=?;', [roleDepartment], (error, departmentIdResults) => {
            if (error) {
                return reject(error);
            }
            let departmentId = departmentIdResults.map(id => parseInt(id.id)); // Collects the value of the id and converts it to an integer.
            return resolve(departmentId);
        });
    });
}

//========================== Add a Department ==========================//
const departmentQuestion = [{
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
}];

const addDepartment = `INSERT into department (department_name) VALUES (?);`;
const departmentTable = "Department";

module.exports = { viewDepartments, queryDeparment, queryDeparmentID, departmentQuestion, addDepartment, departmentTable }