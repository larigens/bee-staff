const inquirer = require("inquirer");
const { database } = require("../config/connection.js");
const cTable = require("console.table");
// Imports employee functions and variables.
const {
  viewEmployees,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  promptEmployee,
  getEmployeeList,
  getManagerList,
  getManagerID,
  addEmployee,
  employeeTable,
  employeeRolePrompt,
  updateEmployeeRole,
  updateRoleRequest,
  employeeManagerPrompt,
  updateEmployeeManager,
  updateManagerRequest,
  updateManagerID,
  deleteEmployeePrompt,
  deleteEmployee,
} = require("./employee.js");
// Imports roles function sand variables.
const {
  viewRoles,
  viewRolesByDepartment,
  getRolesList,
  getRolesID,
  rolesPrompt,
  addRole,
  rolesTable,
  deleteRolePrompt,
  deleteRole,
} = require("./roles.js");
// Imports department functions and variables.
const {
  viewDepartments,
  viewBudget,
  departmentBudgetPrompt,
  getDepartmentList,
  getDepartmentID,
  departmentPrompt,
  addDepartment,
  departmentTable,
  deleteDepartmentPrompt,
  deleteDepartment,
} = require("./department.js");

//========================== Main Menu ==========================//
const mainMenu = [
  {
    type: "list",
    message: "Please select one of the following options: ",
    name: "menu",
    choices: [
      "View all departments",
      "View the total utilized budget of a department",
      "View all roles",
      "View roles by department",
      "View all employees",
      "View employees by manager",
      "View employees by department",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Update an employee manager",
      "Delete a department",
      "Delete a role",
      "Delete an employee",
      "Exit",
    ],
  },
];

//========================== Initialize App ==========================//
const init = () => {
  inquirer.prompt(mainMenu).then((answers) => {
    //========================== View ==========================//
    if (answers.menu === "View all departments") {
      view(viewDepartments);
    } else if (
      answers.menu === "View the total utilized budget of a department"
    ) {
      getBudget();
    } else if (answers.menu === "View all roles") {
      view(viewRoles);
    } else if (answers.menu === "View roles by department") {
      view(viewRolesByDepartment);
    } else if (answers.menu === "View all employees") {
      view(viewEmployees);
    } else if (answers.menu === "View employees by manager") {
      view(viewEmployeesByManager);
    } else if (answers.menu === "View employees by department") {
      view(viewEmployeesByDepartment);
    }
    //========================== Add ==========================//
    else if (answers.menu === "Add a department") {
      addADepartment();
    } else if (answers.menu === "Add a role") {
      addARole();
    } else if (answers.menu === "Add an employee") {
      addAnEmployee();
    }
    //========================== Update ==========================//
    else if (answers.menu === "Update an employee role") {
      updateARole();
    } else if (answers.menu === "Update an employee manager") {
      updateAManager();
    }
    //========================== Delete ==========================//
    else if (answers.menu === "Delete a department") {
      deleteADepartment();
    } else if (answers.menu === "Delete a role") {
      deleteARole();
    } else if (answers.menu === "Delete an employee") {
      deleteAnEmployee();
    } else if (answers.menu === "Exit") {
      database.end();
    }
  });
};

//========================== Query Database ==========================//
//========================== View ==========================//
const view = (sql) => {
  database.query(sql, (err, data) => {
    err ? console.error(err) : console.table("\n Requested Data 🐝🍯", data);
    console.log(
      "---------------------------------------------------------🐝🍯---------------------------------------------------------\n"
    );
    setTimeout(init, 1000); // Displays the table for 1 second and then invokes the function that displays the main menu again.
  });
};

//========================== Get ==========================//
async function getBudget() {
  try {
    const departmentList = await getDepartmentList(); // First gets the department list.
    let params = await departmentBudgetPrompt(departmentList); // Then display it as options for the user.
    get(viewBudget, params); // Gets the combined salaries of all employees in the chosen department.
  } catch (error) {
    console.log(error);
  }
}

const get = (sql, params) => {
  database.query(sql, params, (err, data) => {
    err
      ? console.error(err)
      : console.table(`\n Total Utilized Budget 🐝🍯`, data);
    console.log(
      "---------------------------------------------------------🐝🍯---------------------------------------------------------\n"
    );
    setTimeout(init, 1000); // Displays the table for 1 second and then invokes the function that displays the main menu again.
  });
};

//========================== Add ==========================//
async function addADepartment() {
  try {
    let params = await departmentPrompt(); // Gets user inputs for addition.
    add(addDepartment, params, departmentTable); // Inserts a new department in the database.
  } catch (error) {
    console.log(error);
  }
}

async function addARole() {
  try {
    const departmentList = await getDepartmentList(); // First gets the department list.
    let results = await rolesPrompt(departmentList); // Then display it as options for the user.
    const departmentId = await getDepartmentID(results[2]); // Then gets the ID of the chosen department based on the department name.
    let params = [results[0], results[1], departmentId]; // Creates an array with the role title, salary, and department ID.
    add(addRole, params, rolesTable); // Inserts a new role in the database.
  } catch (error) {
    console.log(error);
  }
}

async function addAnEmployee() {
  try {
    const rolesList = await getRolesList(); // First gets the roles list and
    const managerList = await getManagerList(); // the managers list.
    let results = await promptEmployee(rolesList, managerList); // Then display them as options for the user.
    const roleId = await getRolesID(results[2]); // Then gets the ID of the employee's role based on the job title.
    // If employee is the manager, the manager_id is set to null.
    if (results[3]) {
      let managerID = null;
      let params = [results[0], results[1], roleId, managerID]; // Creates an array with the employee's first name, last name, role ID and manager ID.
      add(addEmployee, params, employeeTable); // Inserts a new employee in the database.
      // Function to update the manager id based on the id that was generated for the employee.
      updateID(updateManagerID);
    }
    // If employee is not the manager, find the manager id.
    else {
      let managerID = await getManagerID(results[4]); // Gets the ID of the employee's manager based on the manager name.
      let params = [results[0], results[1], roleId, managerID];
      add(addEmployee, params, employeeTable); // Inserts a new employee in the database.
    }
  } catch (error) {
    console.log(error);
  }
}

// Insert function.
const add = (sql, params, table) => {
  database.query(sql, params, (err, data) => {
    err
      ? console.error(err)
      : console.log(`\n ${table} added successfully 🐝\n`);
    console.log("----------🐝🍯----------\n");
    setTimeout(init, 1000);
  });
};

//========================== Update ==========================//
async function updateARole() {
  try {
    const employeeFullNameList = await getEmployeeList(); // First gets the employee list and
    const rolesList = await getRolesList(); // the roles list
    let params = await employeeRolePrompt(employeeFullNameList, rolesList); // Then display them as options for the user and gets the array with the employee's new role and full name.
    update(updateEmployeeRole, params, updateRoleRequest); // Updates the employee's role in the database.
  } catch (error) {
    console.log(error);
  }
}

async function updateAManager() {
  try {
    const employeeFullNameList = await getEmployeeList(); // First gets the employee list and
    const managerList = await getManagerList(); // the manager list
    let results = await employeeManagerPrompt(
      employeeFullNameList,
      managerList
    ); // Then display them as options for the user and gets the array with the employee's new manager and full name.
    let managerID = await getManagerID(results[0]); // Gets the ID of the employee's manager based on the manager name.
    let params = [managerID, results[1]];
    update(updateEmployeeManager, params, updateManagerRequest); // Updates the employee's manager in the database.
  } catch (error) {
    console.log(error);
  }
}

// Update function.
const update = (sql, params, request) => {
  database.query(sql, params, (err, data) => {
    err
      ? console.error(err)
      : console.log(`\n ${request} updated successfully 🐝\n`);
    console.log("----------🐝🍯----------\n");
    setTimeout(init, 1000);
  });
};

// Updates the manager ID to be the same as the employee ID - rule for the manager only.
const updateID = (sql) => {
  database.query(sql, (err, data) => {
    err
      ? console.error(err)
      : console.log(" as Manager\n\n----------🐝🍯----------\n");
  });
};

//========================== Delete ==========================//
async function deleteADepartment() {
  try {
    const departmentList = await getDepartmentList(); // First gets the department list and
    let params = await deleteDepartmentPrompt(departmentList); // Then display it as options for the user and
    remove(deleteDepartment, params, departmentTable); // Remove the chosen department from the database.
  } catch (error) {
    console.log(error);
  }
}

async function deleteARole() {
  try {
    const rolesList = await getRolesList();
    let params = await deleteRolePrompt(rolesList);
    remove(deleteRole, params, rolesTable);
  } catch (error) {
    console.log(error);
  }
}

async function deleteAnEmployee() {
  try {
    const employeeFullNameList = await getEmployeeList();
    let params = await deleteEmployeePrompt(employeeFullNameList);
    remove(deleteEmployee, params, employeeTable);
  } catch (error) {
    console.log(error);
  }
}

// Delete function.
const remove = (sql, params, request) => {
  database.query(sql, params, (err, data) => {
    err
      ? console.error(err)
      : console.log(`\n ${request} deleted successfully 🐝\n`);
    console.log("----------🐝🍯----------\n");
    setTimeout(init, 1000);
  });
};

module.exports = { init };
