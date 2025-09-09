CREATE TABLE customers (
customer_id INT PRIMARY KEY AUTO_INCREMENT,
customer_name VARCHAR(100) NOT NULL,
city VARCHAR(50)
);
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
order_id INT PRIMARY KEY AUTO_INCREMENT,
product VARCHAR(100),
amount DECIMAL(10,2),
order_date DATE,
customer_id INT NULL,
CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES
customers(customer_id)
);
INSERT INTO customers (customer_id, customer_name, city) VALUES
(1, 'Rahul Sharma', 'Bangalore'),
(2, 'Priya Singh', 'Delhi'),
(3, 'Aman Kumar', 'Hyderabad'),
(4, 'Sneha Reddy', 'Chennai'),
(5, 'Arjun Mehta', 'Pune');
INSERT INTO orders (order_id, product, amount, order_date, customer_id) VALUES
(101, 'Laptop', 55000.00, '2025-01-05', 1),
(102, 'Headphones', 3000.00, '2025-01-06', 2),
(103, 'Mobile Phone', 25000.00, '2025-01-06', 3),
(104, 'Keyboard', 1500.00, '2025-01-07', NULL),
(105, 'Monitor', 12000.00, '2025-01-07', 1),
(106, 'Tablet', 20000.00, '2025-01-09', 2);

SELECT o.order_id, o.product, o.amount, o.order_date, c.customer_name -- 1
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
SELECT o.order_id, o.product, o.amount, o.order_date, c.customer_name -- 2
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id;
SELECT c.customer_id, c.customer_name, c.city, o.order_id, o.product -- 3
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
SELECT c.customer_id, c.customer_name, COUNT(o.order_id) AS total_orders -- 4
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
SELECT c.customer_id, c.customer_name, SUM(o.amount) AS total_spent -- 5
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
SELECT c.customer_id, c.customer_name, c.city -- 6
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
SELECT order_id, product, amount, order_date, customer_id -- 7
FROM orders
WHERE amount > 20000;
SELECT AVG(amount) AS average_amount -- 8
FROM orders;
SELECT c.customer_id, c.customer_name, MAX(o.amount) AS max_amount -- 9
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
SELECT c.customer_id, c.customer_name, MAX(o.order_date) AS latest_order -- 10
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
