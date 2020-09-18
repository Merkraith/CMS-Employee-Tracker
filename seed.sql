DROP DATABASE IF EXISTS employees_DB;
CREATE database employees_DB;

USE employees_DB;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30) NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE roles (
  roles_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  department_id INT,
  PRIMARY KEY (roles_id)
);

CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  roles_id INT NULL,
  PRIMARY KEY (employee_id)  
);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;

INSERT INTO department (department_id, department)
VALUES (1, "Engineering"), (2, "Accounting"), (3, "Sales");

INSERT INTO roles (roles_id, title, department_id)
VALUES (1, "Software Engineer", 1), (2, "Full Stack Developer", 1), 
 (3, "Accountant", 2), (4, "Accountant Supervisor", 2),
(5, "Sales Rep", 3), (6, "Sales Supervisor", 3);

INSERT INTO employee (employee_id, first_name, last_name, roles_id)
VALUES (1, "Scarlett", "Johanson", 1), (2, "Paul", "Rudd", 2), (3, "Samuel", "Jackson", 3), (4, "Vin", "Diesel", 1), 
(5, "Chris", "Pratt", 1), (6, "Robert", "Downey Jr", 2), (7, "Bradley", "Cooper", 3), (8, "Jeff", "Goldblum", 2), 
(9, "Chris", "Hemsworth", 1), (10, "Jon", "Favreu", 2), (11, "Chris", "Evans", 3), (12, "Jeff", "Bridges", 3),

