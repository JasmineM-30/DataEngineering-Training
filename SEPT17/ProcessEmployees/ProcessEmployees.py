import csv

# Read CSV file
with open("employees.csv", "r") as file:
    reader = csv.DictReader (file)
    employees = list(reader)
  
# Print all employees
print ("Employees:")
for e in employees:
    print(f"{e['id']} - {e['name']} ({e['department']}) - ₹{e['salary']}")
  
# Calculate total and average salary
salaries = [int(e["salary"]) for e in employees]
total_salary = sum (salaries)
average_salary = total_salary / len(salaries)
print(f"\nTotal Salary: ₹{total_salary}")
print(f"Average Salary: ₹{average_salary:.2f}")
