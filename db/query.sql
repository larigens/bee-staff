SELECT *
FROM roles
JOIN departments ON roles.role_department = departments.department_name;

SELECT *
FROM employees
JOIN departments ON employees.employee_department = departments.department_name;

SELECT *
FROM employees
JOIN roles ON employees.employee_salary = roles.salary;

SELECT *
FROM employees
JOIN roles ON employees.job_title = roles.role_title;
