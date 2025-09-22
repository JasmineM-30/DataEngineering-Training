CREATE DATABASE employee_tracker;
USE employee_tracker;

-- Tables

CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  department VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  hire_date DATE,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  clock_in DATETIME NULL,
  clock_out DATETIME NULL,
  status ENUM('Present', 'Absent', 'On Leave', 'Remote') DEFAULT 'Present',
  shift VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_att_emp FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  UNIQUE KEY uq_att_emp_date (employee_id, attendance_date)
);


CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  task_description TEXT,
  task_date DATE,
  time_spent_hours DECIMAL(6, 2) DEFAULT 0.00,
  tasks_completed INT DEFAULT 0,
  task_feedback_id VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_emp FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Sample data inserts with duplicate key update
INSERT INTO employees (first_name, last_name, department, email, hire_date) VALUES
('John', 'Doe', 'IT', 'john.doe@example.com', '2025-01-15'),
('Alice', 'Smith', 'HR', 'alice.smith@example.com', '2024-11-12'),
('Bob', 'Johnson', 'Finance', 'bob.johnson@example.com', '2023-06-08'),
('Carol', 'Williams', 'IT', 'carol.williams@example.com', '2022-03-23'),
('David', 'Taylor', 'Marketing', 'david.taylor@example.com', '2025-01-02')
ON DUPLICATE KEY UPDATE email=VALUES(email);

INSERT INTO attendance (employee_id, attendance_date, clock_in, clock_out, status) VALUES
(1, '2025-09-10', '2025-09-10 09:00:00', '2025-09-10 17:30:00', 'Present'),
(2, '2025-09-10', '2025-09-10 08:45:00', '2025-09-10 17:15:00', 'Present'),
(3, '2025-09-10', '2025-09-10 09:15:00', '2025-09-10 17:15:00', 'Present'),
(4, '2025-09-10', '2025-09-10 09:00:00', '2025-09-10 18:00:00', 'Present'),
(5, '2025-09-10', '2025-09-10 08:55:00', '2025-09-10 17:05:00', 'Present')
ON DUPLICATE KEY UPDATE clock_in=VALUES(clock_in);

INSERT INTO tasks (employee_id, task_description, task_date, time_spent_hours, tasks_completed) VALUES
(1, 'Prepare quarterly financial report', '2025-09-10', 6.5, 5),
(2, 'Conduct employee performance reviews', '2025-09-10', 5.0, 4),
(3, 'Setup new server infrastructure', '2025-09-10', 7.0, 2),
(4, 'Design marketing campaign plan', '2025-09-10', 4.5, 3),
(5, 'Update company website content', '2025-09-10', 3.5, 2);

-- Clock-in operation (Create/Update attendance)
INSERT INTO attendance (employee_id, attendance_date, clock_in, status)
VALUES (1, CURDATE(), NOW(), 'Present')
ON DUPLICATE KEY UPDATE clock_in = COALESCE(clock_in, NOW()), status = 'Present';

-- Clock-out operation (Update clock_out if not set)
UPDATE attendance
SET clock_out = NOW()
WHERE employee_id = 1 AND attendance_date = CURDATE() AND clock_out IS NULL;

-- Stored procedure to calculate total work hours by employee ID (all attendance)
DELIMITER //

CREATE PROCEDURE CalculateTotalHoursByEmployee (
  IN emp_id INT,
  OUT total_hours FLOAT
)
BEGIN
  SELECT IFNULL(
    SUM(TIMESTAMPDIFF(SECOND, clock_in, IFNULL(clock_out, NOW()))) / 3600,0)
  INTO total_hours
  FROM attendance
  WHERE employee_id = emp_id
    AND clock_in IS NOT NULL;
END //

DELIMITER ;


-- CALL CalculateTotalHoursByEmployee(employee_id, @total);
CALL CalculateTotalHoursByEmployee(1, @total_hours);
SELECT @total_hours;
