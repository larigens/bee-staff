-- View all departments
SELECT *
FROM department

-- View all roles
SELECT *
FROM roles

-- View all employees
SELECT *
FROM employee

SELECT *
FROM role
JOIN department ON roles.department_id = department.id;

SELECT *
FROM employee
JOIN role ON employee.role_id = roles.title;

