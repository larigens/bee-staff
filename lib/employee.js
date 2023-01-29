const { database } = require('../config/connection.js');
const inquirer = require('inquirer');

//========================== View Employees ==========================//
const viewEmployees = `SELECT a.id AS ID, a.first_name AS FirstName, a.last_name AS LastName, roles.title AS JobTitle, department.department_name AS Department, roles.salary AS Salary, CONCAT_WS(' ', b.first_name, b.last_name) AS Manager
FROM employee a
LEFT JOIN employee b ON a.manager_id = b.id
LEFT JOIN roles ON a.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
ORDER BY id;`;

const viewEmployeesByManager = `SELECT a.id AS ID, a.first_name AS FirstName, a.last_name AS LastName, roles.title AS JobTitle, department.department_name AS Department, roles.salary AS Salary, CONCAT_WS(' ', b.first_name, b.last_name) AS Manager
FROM employee a
LEFT JOIN employee b ON a.manager_id = b.id
LEFT JOIN roles ON a.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
ORDER BY Manager;`;

//========================== Get Employees List ==========================//
const getEmployeeList = () => {
    return new Promise((resolve, reject) => {
        database.promise().query('SELECT * FROM employee;')
            .then(([rows]) => {
                let employeeFullNameList = rows.map(emp => emp.first_name + " " + emp.last_name);
                return resolve(employeeFullNameList);
            })
            .catch(error => {
                return reject(error);
            })
    });
};

//========================== Get Managers List ==========================//
const getManagerList = () => {
    return new Promise((resolve, reject) => {
        // Gets first and last name of all the managers and creates a list.
        database.promise().query(`SELECT CONCAT_WS(' ',first_name, last_name) AS Manager FROM employee WHERE manager_id = id;`)
            .then(([rows]) => {
                let managerList = rows.map(managerName => managerName.Manager);
                return resolve(managerList);
            })
            .catch(error => {
                return reject(error);
            })
    });
}

//========================== Get Managers Id ==========================//
const getManagerID = (manager) => {
    return new Promise((resolve, reject) => {
        database.promise().query(`SELECT manager_id FROM employee WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`, [manager])
            .then(([rows]) => {
                let managerID = rows.map(id => parseInt(id.manager_id)); // Collects the value of the id and converts it to an integer.
                return resolve(managerID);
            })
            .catch(error => {
                return reject(error);
            })
    });
}

//========================== Add an Employee ==========================//
const promptEmployee = (rolesList, managerList) => {
    return new Promise((resolve, reject) => {
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
                let results = [employeeFirstName, employeeLastName, employeeRole, isManager, manager]
                return resolve(results);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const addEmployee = `INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
const employeeTable = 'Employee';

//========================== Update Employee's Role ==========================//
const employeeRolePrompt = (employeeFullNameList, rolesList) => {
    return new Promise((resolve, reject) => {
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
                let params = [newRole, fullName]
                return resolve(params);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const updateEmployeeRole = `UPDATE employee SET role_id=(SELECT id FROM roles WHERE title=?) WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`;
const updateRoleRequest = "Employee's role";

const employeeManagerPrompt = (employeeFullNameList, managerList) => {
    return new Promise((resolve, reject) => {
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
                    message: "Please select the employee's new manager: ",
                    name: "updatedManager",
                    choices: managerList
                }])
            .then((answer) => {
                let fullName = answer.findEmployee;
                let newManager = answer.updatedManager;
                let results = [newManager, fullName]
                return resolve(results);
            })
            .catch(error => {
                return reject(error);
            })
    })
}

const updateEmployeeManager = `UPDATE employee SET manager_id=? WHERE CONCAT_WS(' ',first_name, last_name) LIKE ?;`;
const updateManagerRequest = "Employee's Manager";

//========================== Update Employee's Manager Id ==========================//
const updateManagerID = `UPDATE employee SET manager_id=id WHERE manager_id IS NULL;`;
const managerParams = "";
const managerRequest = "Employee's Manager ID";

module.exports = { viewEmployees, viewEmployeesByManager, promptEmployee, getEmployeeList, getManagerList, getManagerID, addEmployee, employeeTable, employeeRolePrompt, updateEmployeeRole, updateRoleRequest, employeeManagerPrompt, updateEmployeeManager, updateManagerRequest, updateManagerID, managerParams, managerRequest }