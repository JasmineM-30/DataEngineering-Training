-- Use or create database
CREATE DATABASE IF NOT EXISTS retail_db;
USE retail_db;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity_sold INT NOT NULL,
    sale_date DATE NOT NULL,
    region VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    stock_quantity INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert products data
INSERT INTO products (product_name, category, price, supplier_id) VALUES
('Laptop Model A', 'Electronics', 750.00, 1001),
('Wireless Mouse', 'Accessories', 25.00, 1002),
('Office Chair', 'Furniture', 150.00, 1003),
('Laptop Model B', 'Electronics', 850.00, 1001),
('Gaming Keyboard', 'Accessories', 45.00, 1002),
('Desk Lamp', 'Furniture', 30.00, 1003),
('Smartphone X', 'Electronics', 650.00, 1004),
('Bluetooth Speaker', 'Electronics', 90.00, 1002),
('Office Desk', 'Furniture', 300.00, 1003);

-- Insert sales data
INSERT INTO sales (product_id, quantity_sold, sale_date, region) VALUES
(1, 5, '2025-10-20', 'North'),
(2, 10, '2025-10-21', 'South'),
(1, 2, '2025-10-22', 'East'),
(1, 7, '2025-10-23', 'West'),
(4, 3, '2025-10-20', 'North'),
(3, 8, '2025-10-21', 'South'),
(2, 15, '2025-10-22', 'East'),
(5, 10, '2025-10-23', 'West'),
(6, 2, '2025-10-24', 'North'),
(1, 4, '2025-10-25', 'South'),
(4, 5, '2025-10-26', 'East');

-- Insert inventory data
INSERT INTO inventory (product_id, stock_quantity) VALUES
(1, 20),
(2, 50),
(3, 15),
(4, 12),
(5, 40),
(6, 10);

-- Select all products
SELECT * FROM products;

-- Select sales for product 1
SELECT * FROM sales WHERE product_id = 1;

-- Select inventory
SELECT * FROM inventory;

-- Update example: change price
UPDATE products SET price = 700 WHERE product_id = 1;

-- Delete example: delete sales record
DELETE FROM sales WHERE sale_id = 2;

-- Stored procedure for low stock items
DELIMITER //
CREATE PROCEDURE GetLowStockItems(IN threshold INT)
BEGIN
  SELECT p.product_id, p.product_name, i.stock_quantity
  FROM products p
  JOIN inventory i ON p.product_id = i.product_id
  WHERE i.stock_quantity < threshold;
END //
DELIMITER ;

-- Call stored procedure example
CALL GetLowStockItems(20);
