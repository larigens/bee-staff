// Packages needed.
const inquirer = require('inquirer');
const queryDb = require('./queryDb');

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
    },
    {
        type: "input",
        message: "Please enter the role: ",
        name: "role",
        when(answers) {
            return answers.start === "Add a role";
        },
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
        type: "input",
        message: "Please enter the role's salary: ",
        name: "salary",
        when(answers) {
            return answers.start === "Add a role" && answers.role !== "";
        },
        validate: answers => {
            if (!answers.trim()) {
                return "Please enter the role's salary!";
            }
            else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "Please enter the role's department: ",
        name: "roleDepartment",
        when(answers) {
            return answers.start === "Add a role" && answers.salary !== "";
        },
        validate: answers => {
            if (!answers.trim()) {
                return "Please enter the role's department!";
            }
            else {
                return true;
            }
        }
    },
    {
        type: "number",
        message: "Please enter the employee's ID: ",
        name: "employeeId",
        when(answers) {
            return answers.start === "Add an employee";
        },
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
        when(answers) {
            return answers.start === "Add an employee" && answers.employeeId !== "";
        },
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
        when(answers) {
            return answers.start === "Add an employee" && answers.employeeFirstName !== "";
        },
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
        type: "input",
        message: "Please enter the employee's role: ",
        name: "employeeRole",
        when(answers) {
            return answers.start === "Add an employee" && answers.employeeLastName !== "";
        },
        validate: answers => {
            if (!answers.trim()) {
                return "Please enter the employee's role!";
            }
            else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "Please enter the employee's manager (FirstName LastName): ",
        name: "manager",
        when(answers) {
            return answers.start === "Add an employee" && answers.employeeRole !== "";
        },
        validate: answers => {
            if (!answers.trim()) {
                return "Please enter the employee's manager!";
            }
            else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "Please enter the first name of the employee you would like to update their role: ",
        name: "getFirstName",
        when(answers) {
            return answers.start === "Update an employee role";
        },
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
        message: "Please enter the last name of the employee you would like to update their role: ",
        name: "getLastName",
        when(answers) {
            return answers.start === "Update an employee role" && answers.getFirstName !== "";
        },
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
        type: "input",
        message: "Please enter the employee's new role: ",
        name: "updateRole",
        when(answers) {
            return answers.start === "Update an employee role" && answers.getLastName !== "";
        },
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

// Function call to initialize app.
const init = () => {
    inquirer
        .prompt(mainMenu)
        .then((answers) => {
            let viewDepartments = answers.start === "View all departments";
            let viewRoles = answers.start === "View all roles";
            let viewEmployees = answers.start === "View all employees";
            // Object destructuring assignment
            var { department, role, salary, roleDepartment, employeeId, employeeFirstName, employeeLastName, employeeRole, manager, getFirstName, getLastName, updateRole } = answers

            if (viewDepartments) {
                queryDb.getDepartments();
            }
            else if (viewRoles) {
                queryDb.getRoles();
            }
            else if (viewEmployees) {
                queryDb.getEmployees();
            }
            else if (department !== undefined) {
                queryDb.addDepartment(department);
            }
            else if (role !== undefined) {
                queryDb.findDepartment(role, salary, roleDepartment);
            }
            else if (employeeFirstName !== undefined) {
                queryDb.findRole(employeeId, employeeFirstName, employeeLastName, employeeRole, manager);
            }
            else if (updateRole !== undefined) {
                queryDb.findNewRole(getFirstName, getLastName, updateRole);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

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
            else {
                console.log(answer)
            }
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = { init, returnToMenu }
