DROP DATABASE IF EXISTS corporation_db;
CREATE DATABASE corporation_db;

USE corporation_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_name)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    role_title TEXT,
    role_department VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL,
    PRIMARY KEY (role_title),
    index(salary),
    FOREIGN KEY (role_department) REFERENCES departments(department_name)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name TEXT,
    last_name INT,
    job_title TEXT,
    employee_department VARCHAR(30) NOT NULL,
    employee_salary VARCHAR(30) NOT NULL,
    employee_manager TEXT,
    FOREIGN KEY (employee_department) REFERENCES departments(department_name)
    FOREIGN KEY (employee_salary) REFERENCES roles(salary)
    FOREIGN KEY (job_title) REFERENCES roles(role_title)
    ON DELETE SET NULL
);
