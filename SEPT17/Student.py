class Student:
    def __init__(self, name, age):  #constructor
        self.name = name
        self.age = age
    def greet(self):
        return f"Hello, My name is {self.name} and I am {self.age} years old."

#create objects of the class
s1 = Student('jasmine',21)
s2 = Student('Kumar',21)

#call methods
print(s1.greet())
print(s2.greet())
