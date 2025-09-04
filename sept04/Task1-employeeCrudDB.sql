CREATE DATABASE company_db;
USE company_db;
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT,
    department VARCHAR(100),
    salary DECIMAL(10, 2)
);
INSERT INTO employees (first_name, last_name, age, department, salary) VALUES
('Jasmine', 'Priya', 30, 'HR', 55000.00),
('Ruth', 'Jenifer', 45, 'Finance', 85000.00),
('Arun', 'Kumar', 28, 'HR', 60000.00),
('Sathya', 'Sri', 35, 'Marketing', 72000.00),
('Joseph', 'Williams', 40, 'IT', 65000.00);
SELECT * FROM employees;
SELECT first_name, department, salary FROM employees;
SELECT * FROM employees
WHERE department = 'IT';
UPDATE employees
SET department = 'Accounts'
WHERE department = 'Finance'
LIMIT 1;
SELECT * FROM employees WHERE department = 'Accounts';
DELETE FROM employees
WHERE department = 'HR'
LIMIT 1;
SELECT * FROM employees WHERE department = 'HR';



