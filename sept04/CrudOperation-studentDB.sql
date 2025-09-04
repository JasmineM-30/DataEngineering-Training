CREATE DATABASE student_db;
USE student_db;
create table students(
id int primary key auto_increment,
age int,
name varchar(100) not null,
course varchar(100)
); 
INSERT INTO students (name, age, course)
VALUES ('Jas', 22, 'AI Engineer'),
('Arun', 23, 'Data Science');
SELECT * FROM students;
SELECT name, course FROM students
WHERE age > 21;
UPDATE students
SET course = 'Machine learing'
WHERE id = 2;
DELETE FROM students
WHERE id = 3;
SELECT * FROM student_db.students;
