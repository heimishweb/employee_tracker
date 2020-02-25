DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

-- table 1 -department
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NULL,
 
  PRIMARY KEY (id)
);

SELECT * FROM department;

-- table 2 - role
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NULL,
  salary decimal not NULL,
  department_id int not NULL,
 
  PRIMARY KEY (id)
);

SELECT * FROM role;

-- table 3 - employee

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,

  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id int not NULL,
  manager_id int not NULL,
 
  PRIMARY KEY (id)
);

SELECT * FROM employee;