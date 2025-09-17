class Calculator:
    def __init__(self, num1, num2):
        self.num1 = num1
        self.num2 = num2
    def add(self):
        return f"Addition:{self.num1 + self.num2}"
    def sub(self):
        return f"Subtraction:{self.num1 - self.num2}"
    def mul(self):
        return f"Multiplication:{self.num1 * self.num2}"
    def div(self):
        return f"Division:{self.num1 / self.num2}"

#create object
c1 = Calculator(100, 22)

#call methods
print(c1.add())
print(c1.sub())
print(c1.mul())
print(c1.div())
