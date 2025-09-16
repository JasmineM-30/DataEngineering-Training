CREATE DATABASE Personal_Expense;
USE Personal_Expense;
-- Users table
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  password VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE Categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

-- Expenses table
CREATE TABLE Expenses (
  expense_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  category_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  expense_date DATE,
  description TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Insert sample Users
INSERT INTO Users (username, email, password) VALUES
('alice', 'alice@example.com', 'pass123'),
('bob', 'bob@example.com', 'pass456'),
('carol', 'carol@example.com', 'pass789'),
('dave', 'dave@example.com', 'pass321'),
('emily', 'emily@example.com', 'pass654'),
('frank', 'frank@example.com', 'pass987'),
('grace', 'grace@example.com', 'pass111');

-- Insert sample Categories
INSERT INTO Categories (name, description) VALUES
('Groceries', 'Food and household supplies'),
('Utilities', 'Electricity, water, internet bills'),
('Entertainment', 'Movies, games, events'),
('Transportation', 'Bus, taxi, fuel expenses'),
('Healthcare', 'Medicines, doctor visits'),
('Education', 'Books, courses, tuition'),
('Dining Out', 'Restaurants, cafes'),
('Fitness', 'Gym memberships and equipment');

-- Insert sample Expenses
INSERT INTO Expenses (user_id, category_id, amount, expense_date, description) VALUES
(1, 1, 45.75, '2025-09-01', 'Weekly grocery shopping'),
(1, 2, 60.30, '2025-09-05', 'Electricity bill'),
(2, 1, 23.00, '2025-09-03', 'Bought fruits'),
(3, 3, 120.00, '2025-09-07', 'Concert tickets'),
(2, 2, 40.50, '2025-09-10', 'Water bill'),
(3, 1, 30.00, '2025-09-11', 'Grocery snacks'),
(1, 3, 15.00, '2025-09-12', 'Movie night'),
(4, 4, 25.00, '2025-09-13', 'Taxi fare'),
(5, 5, 40.00, '2025-09-12', 'Doctor appointment'),
(6, 6, 300.00, '2025-09-10', 'Online course fee'),
(7, 7, 55.00, '2025-09-11', 'Dinner at restaurant'),
(4, 1, 70.00, '2025-09-14', 'Groceries weekly'),
(5, 2, 80.50, '2025-09-15', 'Internet bill payment');

-- CRUD operations:

-- Add a user
INSERT INTO Users (username, email, password) VALUES ('henry', 'henry@example.com', 'pass333');

-- Edit a user
UPDATE Users SET email = 'alice_new@example.com', password = 'newpass123' WHERE username = 'alice';

-- Delete a user
DELETE FROM Users WHERE user_id = 7;

-- Add a category
INSERT INTO Categories (name, description) VALUES ('Yoga', 'Yoga classes and equipment');

-- Edit a category
UPDATE Categories SET description = 'Yoga-related expenses and materials' WHERE name = 'Yoga';

-- Delete a category
DELETE FROM Categories WHERE category_id = 9;

-- Add an expense
INSERT INTO Expenses (user_id, category_id, amount, expense_date, description)
VALUES (1, 8, 40.00, '2025-09-16', 'Monthly gym membership');

-- Read expenses for user 1
SELECT * FROM Expenses WHERE user_id = 1 ORDER BY expense_date DESC;

-- Update an expense
UPDATE Expenses SET amount = 45.00, description = 'Updated monthly gym fee' WHERE expense_id = 14;

-- Delete an expense
DELETE FROM Expenses WHERE expense_id = 14;

-- Stored Procedure to calculate monthly total expenses per category for a user
DELIMITER //

CREATE PROCEDURE GetMonthlyTotals(
  IN p_user_id INT,
  IN p_month INT,
  IN p_year INT
)
BEGIN
  SELECT c.name AS category, SUM(e.amount) AS total_amount
  FROM Expenses e
  JOIN Categories c ON e.category_id = c.category_id
  WHERE e.user_id = p_user_id
    AND MONTH(e.expense_date) = p_month
    AND YEAR(e.expense_date) = p_year
  GROUP BY c.name;
END //

DELIMITER ;

-- CALL GetMonthlyTotals(user_id, month, year);
CALL GetMonthlyTotals(1, 9, 2025);
