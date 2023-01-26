// Packages needed.
const inquirer = require('inquirer');
const { database } = require('../config/connection.js');
const { getDepartments, addDepartment, findDepartmentId } = require('./department.js');
const { getRoles, findRoleId, getRoleId } = require('./roles.js');
const { getEmployees } = require('./employee.js');

// Array of prompts to get user's input.
const mainMenu = [
    {
        type: "list",
        message: "Please select one of the following options: ",
        name: "start",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
    },
    {
        type: "input",
        message: "Please enter the department's name: ",
        name: "department",
        when(answers) {
            return answers.start === "Add a department";
        },
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

// Function call to initialize app.
const init = () => {
    inquirer
        .prompt(mainMenu)
        .then((answers) => {
            let viewDepartments = answers.start === "View all departments";
            let viewRoles = answers.start === "View all roles";
            let viewEmployees = answers.start === "View all employees";
            let addARole = answers.start === "Add a role";
            let addNewEmployee = answers.start === "Add an employee";
            let updateEmployee = answers.start === "Update an employee role";

            // Object destructuring assignment
            const { department } = answers

            if (viewDepartments) {
                getDepartments();
                returnToMenu(); //Maybe add setTimeOut?
            }
            else if (viewRoles) {
                getRoles();
                returnToMenu();
            }
            else if (viewEmployees) {
                getEmployees();
                returnToMenu();
            }
            else if (department !== undefined) {
                addDepartment(department);
            }
            else if (addARole) {
                database.query('SELECT * FROM department;', (err, departmentResults) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        var departmentList = departmentResults.map(dpt => dpt.department_name);
                        addRole(departmentList);
                    }
                });
            }
            else if (addNewEmployee) {
                const findRoles = () => {
                    database.query('SELECT * FROM roles;', (err, rolesResults) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            var rolesList = rolesResults.map(rol => rol.title);
                            addEmployee(rolesList)
                        }
                    });
                    findRoles();
                }
            }
            else if (updateEmployee) {
                const findEmployee = () => {
                    database.query('SELECT * FROM employee;', (err, employeeResults) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            var employeeFullName = employeeResults.map(emp => emp.first_name + " " + id.last_name);
                            update(employeeFullName)
                        }
                    });
                }
                findEmployee();
            }
        })
        .catch(err => {
            console.log(err);
        })
}

const addRole = (departmentList) => {
    inquirer
        .prompt(
            [
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
                        if (!answers) {
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
            ]
        )
        .then((answer) => {
            var { role, salary, roleDepartment } = answer;
            if (roleDepartment !== "") {
                findDepartmentId(role, salary, roleDepartment);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

const addEmployee = (rolesList) => {
    inquirer
        .prompt(
            [
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
                    type: "input",
                    message: "Please enter the employee's manager (FirstName LastName): ",
                    name: "manager",
                    validate: answers => {
                        if (!answers.trim()) {
                            return "Please enter the employee's manager!";
                        }
                        else {
                            return true;
                        }
                    }
                }
            ]
        )
        .then((answer) => {
            var { employeeId, employeeFirstName, employeeLastName, employeeRole, manager } = answer;
            getRoleId(employeeId, employeeFirstName, employeeLastName, employeeRole, manager);
        })
        .catch(err => {
            console.log(err);
        })
}

const update = (employeeFullName) => {
    inquirer
        .prompt(
            [
                {
                    type: "list",
                    message: "Select the employee that you would like to update",
                    name: "findEmployee",
                    choices: employeeFullName
                },
                {
                    type: "input",
                    message: "Please enter the employee's new role: ",
                    name: "updatedRole",
                    validate: answers => {
                        if (!answers.trim()) {
                            return "Please enter the employee's new role!";
                        }
                        else {
                            return true;
                        }
                    }
                }
            ]
        )
        .then((answer) => {
            let fullName = answer.findEmployee;
            let newRole = answer.updatedRole;
            if (fullName !== "") {
                findRoleId(fullName, newRole);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

// Try setTimeOut - function not working
const returnToMenu = () => {
    inquirer
        .prompt({
            type: "confirm",
            message: "Would you like to return to the main menu?",
            name: "return"
        })
        .then((answer) => {
            if (answer.return) {
                init();
            }
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = { init, returnToMenu }
