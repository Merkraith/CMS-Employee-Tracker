DROP DATABASE IF EXISTS employee_tracker_DB;

CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;

CREATE TABLE department (
  department_id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE role (
  role_id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (role_id)
);

CREATE TABLE  employee (
    employee_id INT NOT NULL, 
    first_name VARCHAR (30) NOT NULL, 
    last_name  VARCHAR(30) NOT NULL, 
    role_id VARCHAR(30) NOT NULL, 
    PRIMARY KEY (employee_id)
);