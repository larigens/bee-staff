DROP DATABASE IF EXISTS corporation_db;
-- Creates the "corporation_db" database.
CREATE DATABASE corporation_db;
-- Uses corporation_db database.
USE corporation_db;
-- Creates the table "department" within corporation_db
CREATE TABLE department (
    -- Creates a numeric column called "id" which cannot contain null and it auto increments.
    id INT NOT NULL AUTO_INCREMENT,
    -- Makes a string column called "department_name" which cannot contain null.
    department_name VARCHAR(30) NOT NULL,
    -- It uniquely identifies a record in the relational database table.
    PRIMARY KEY (id)
);
-- Creates the table "roles" within corporation_db
CREATE TABLE roles (
    -- Creates a numeric column called "id" which cannot contain null and it auto increments.
    id INT NOT NULL AUTO_INCREMENT,
    -- Makes a string column called "title" which cannot contain null.
    title VARCHAR(30) NOT NULL,
    -- Makes a numeric column called "salary" which cannot contain null.
    salary DECIMAL NOT NULL,
    -- Makes a numeric column called "department_id" which holds reference to department role belongs to.
    department_id INT,
    -- It uniquely identifies a record in the relational database table.
    PRIMARY KEY (id),
    -- Provides a link between the tables roles and deparment.
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE
    SET NULL
);
-- Creates the table "employee" within corporation_db
CREATE TABLE employee (
    -- Creates a numeric column called "id" which cannot contain null and it auto increments.
    id INT NOT NULL AUTO_INCREMENT,
    -- Makes a string column called "first_name " which cannot contain null.
    first_name VARCHAR(30) NOT NULL,
    -- Makes a string column called "last_name" which cannot contain null.
    last_name VARCHAR(30) NOT NULL,
    -- Makes a numeric column called "role_id" which holds reference to employee role.
    role_id INT,
    -- Makes a numeric column called "manager_id" which holds reference to another employee that is the manager of the current employee.
    manager_id INT,
    -- Provides a link between the tables employee and roles.
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE
    SET NULL
);