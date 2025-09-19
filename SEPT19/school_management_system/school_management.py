import json
import csv
from collections import defaultdict, Counter


# PART A – Classes & Inheritance


class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age


class Student(Person):
    def __init__(self, id, name, age, grade, marks):
        super().__init__(name, age)
        self.id = id
        self.grade = grade
        self.marks = marks

    def get_average(self):
        return sum(self.marks.values()) / len(self.marks)

    def __str__(self):
        return f"{self.name}, Grade: {self.grade}, Average: {self.get_average():.2f}"


class Teacher(Person):
    def __init__(self, id, name, age, subject, salary):
        super().__init__(name, age)
        self.id = id
        self.subject = subject
        self.salary = salary

    def get_details(self):
        return f"{self.name} teaches {self.subject}, Salary: ₹{self.salary}"

    def __str__(self):
        return self.get_details()

# PART B – JSON Handling


def load_students(filename='students.json'):
    with open(filename, 'r') as f:
        data = json.load(f)
    return [Student(**student) for student in data]


def save_students(students, filename='students.json'):
    data = []
    for s in students:
        data.append({
            "id": s.id,
            "name": s.name,
            "age": s.age,
            "grade": s.grade,
            "marks": s.marks
        })
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)


def print_student_details(students):
    for s in students:
        print(f"Name: {s.name}, Age: {s.age}, Grade: {s.grade}, Average Marks: {s.get_average():.2f}")


def get_topper(students):
    return max(students, key=lambda s: s.get_average())


# PART C – CSV Handling


def load_teachers(filename='teachers.csv'):
    teachers = []
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            teachers.append(Teacher(
                id=int(row['id']),
                name=row['name'],
                age=35,
                subject=row['subject'],
                salary=int(row['salary'])
            ))
    return teachers


def save_teachers(teachers, filename='teachers.csv'):
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'name', 'subject', 'salary'])
        for t in teachers:
            writer.writerow([t.id, t.name, t.subject, t.salary])


def print_teacher_details(teachers):
    for t in teachers:
        print(t.get_details())


def average_salary(teachers):
    return sum(t.salary for t in teachers) / len(teachers)


def highest_paid_teacher(teachers):
    return max(teachers, key=lambda t: t.salary)

# ----------------------------------------
# PART D – Reports
# ----------------------------------------

def student_class_teacher_report(students, teachers):
    report = []
    subject_teacher = {t.subject: t.name for t in teachers}
    for s in students:
        highest_subject = max(s.marks, key=s.marks.get)
        teacher_name = subject_teacher.get(highest_subject, "N/A")
        report.append((s.name, highest_subject, teacher_name))
    return report


def generate_summary(students, teachers):
    
    grade_count = Counter(s.grade for s in students)

    
    subject_totals = defaultdict(int)
    subject_counts = defaultdict(int)
    for s in students:
        for subject, mark in s.marks.items():
            subject_totals[subject] += mark
            subject_counts[subject] += 1

    subject_averages = {subject: subject_totals[subject] / subject_counts[subject]
                        for subject in subject_totals}

    total_salary = sum(t.salary for t in teachers)

    return grade_count, subject_averages, total_salary


# PART E – Menu-Driven Console App


def main_menu():
    students = load_students()
    teachers = load_teachers()

    while True:
        print("\n===== School Management System =====")
        print("1. View All Students")
        print("2. View All Teachers")
        print("3. Add New Student")
        print("4. Add New Teacher")
        print("5. Generate Reports")
        print("6. Exit")

        choice = input("Enter your choice: ")

        if choice == '1':
            print("\n-- Students --")
            print_student_details(students)

        elif choice == '2':
            print("\n-- Teachers --")
            print_teacher_details(teachers)

        elif choice == '3':
            print("\n-- Add New Student --")
            name = input("Enter student name: ")
            age = int(input("Enter age: "))
            grade = input("Enter grade: ")
            marks = {}
            for subject in ['Math', 'Science', 'English']:
                marks[subject] = int(input(f"Enter marks for {subject}: "))
            student_id = max(s.id for s in students) + 1 if students else 1
            students.append(Student(student_id, name, age, grade, marks))
            save_students(students)
            print("Student added successfully.")

        elif choice == '4':
            print("\n-- Add New Teacher --")
            name = input("Enter teacher name: ")
            subject = input("Enter subject: ")
            salary = int(input("Enter salary: "))
            teacher_id = max(t.id for t in teachers) + 1 if teachers else 1
            teachers.append(Teacher(teacher_id, name, 35, subject, salary))
            save_teachers(teachers)
            print("Teacher added successfully.")

        elif choice == '5':
            print("\n--- Reports ---")
            print("\nStudent-Class Teacher Report:")
            report = student_class_teacher_report(students, teachers)
            for name, subject, teacher in report:
                print(f"{name} - Top Subject: {subject}, Class Teacher: {teacher}")

            print("\nSummary:")
            grades, averages, salary = generate_summary(students, teachers)
            print("Students per Grade:", dict(grades))
            print("Average Marks per Subject:")
            for sub, avg in averages.items():
                print(f"  {sub}: {avg:.2f}")
            print(f"Total Salary Spent: ₹{salary}")

        elif choice == '6':
            print("Exiting system. Goodbye!")
            break

        else:
            print("Invalid choice, try again.")


# Run the Application


if __name__ == "__main__":
    main_menu()
