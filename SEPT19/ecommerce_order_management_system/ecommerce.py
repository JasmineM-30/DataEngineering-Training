import csv
import json
from collections import defaultdict, Counter

# PART A – Classes

class Product:
    def __init__(self, id, name, category, price, stock):
        self.id = int(id)
        self.name = name
        self.category = category
        self.price = float(price)
        self.stock = int(stock)

    def update_stock(self, qty):
        self.stock -= qty

    def __str__(self):
        return f"{self.name} | Category: {self.category} | ₹{self.price} | Stock: {self.stock}"


class Customer:
    def __init__(self, name):
        self.name = name
        self.orders = []

    def add_order(self, order):
        self.orders.append(order)


class Order:
    def __init__(self, order_id, customer, items):
        self.order_id = order_id
        self.customer = customer
        self.items = items  

    def get_total(self, product_map):
        total = 0
        for item in self.items:
            product = product_map[item["product_id"]]
            total += product.price * item["qty"]
        return total

    def __str__(self):
        return f"Order #{self.order_id} by {self.customer}"


# PART B – CSV Handling

def load_products(filename='products.csv'):
    products = {}
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            p = Product(row['id'], row['name'], row['category'], row['price'], row['stock'])
            products[p.id] = p
    return products


def save_products(products, filename='products.csv'):
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'name', 'category', 'price', 'stock'])
        for p in products.values():
            writer.writerow([p.id, p.name, p.category, p.price, p.stock])


def print_products(products):
    print("\n--- Available Products ---")
    for p in products.values():
        print(p)


def get_most_expensive_product(products):
    return max(products.values(), key=lambda p: p.price)


# PART C – JSON Handling

def load_orders(filename='orders.json'):
    with open(filename, 'r') as f:
        return json.load(f)


def save_orders(orders, filename='orders.json'):
    with open(filename, 'w') as f:
        json.dump(orders, f, indent=4)


def print_order_totals(orders, products):
    print("\n--- Order Totals ---")
    for o in orders:
        order = Order(o['order_id'], o['customer'], o['items'])
        total = order.get_total(products)
        print(f"{o['customer']} - Total: ₹{total:.2f}")


def get_most_ordered_product(orders):
    counter = Counter()
    for o in orders:
        for item in o['items']:
            counter[item['product_id']] += item['qty']
    return counter.most_common(1)[0]  


# PART D – Reports

def generate_sales_report(orders, products):
    total_revenue = 0
    revenue_by_category = defaultdict(float)
    customer_spending = defaultdict(float)

    for o in orders:
        order = Order(o['order_id'], o['customer'], o['items'])
        for item in o['items']:
            product = products[item['product_id']]
            amt = product.price * item['qty']
            total_revenue += amt
            revenue_by_category[product.category] += amt
            customer_spending[o['customer']] += amt

    top_customer = max(customer_spending, key=customer_spending.get)

    return total_revenue, revenue_by_category, top_customer


def generate_inventory_report(products):
    low_stock = [p for p in products.values() if p.stock < 5]
    category_prices = defaultdict(list)

    for p in products.values():
        category_prices[p.category].append(p.price)

    avg_prices = {cat: sum(prices)/len(prices) for cat, prices in category_prices.items()}

    return low_stock, avg_prices


# PART E – Stretch Goal

def menu():
    products = load_products()
    orders = load_orders()

    while True:
        print("\n===== E-Commerce Order Management =====")
        print("1. View Products")
        print("2. Place New Order")
        print("3. View All Orders")
        print("4. Generate Reports")
        print("5. Exit")

        choice = input("Choose an option: ")

        if choice == '1':
            print_products(products)

        elif choice == '2':
            customer_name = input("Customer Name: ")
            items = []
            while True:
                try:
                    pid = int(input("Enter Product ID (0 to stop): "))
                except:
                    print("Invalid input.")
                    continue

                if pid == 0:
                    break

                if pid not in products:
                    print("Invalid product ID.")
                    continue

                try:
                    qty = int(input("Enter quantity: "))
                except:
                    print("Invalid quantity.")
                    continue

                if qty > products[pid].stock:
                    print("Not enough stock!")
                    continue

                items.append({"product_id": pid, "qty": qty})
                products[pid].update_stock(qty)

            if items:
                new_id = max(o['order_id'] for o in orders) + 1 if orders else 101
                new_order = {"order_id": new_id, "customer": customer_name, "items": items}
                orders.append(new_order)
                save_orders(orders)
                save_products(products)
                print("Order placed successfully!")

        elif choice == '3':
            print_order_totals(orders, products)

        elif choice == '4':
            print("\n--- Sales Report ---")
            total, category_revenue, top_customer = generate_sales_report(orders, products)
            print(f"Total Revenue: ₹{total:.2f}")
            print("Revenue by Category:")
            for cat, rev in category_revenue.items():
                print(f"  {cat}: ₹{rev:.2f}")
            print(f"Top Customer: {top_customer}")

            print("\n--- Inventory Report ---")
            low_stock, avg_prices = generate_inventory_report(products)
            print("Low Stock Products:")
            for p in low_stock:
                print(f"  {p.name} (Stock: {p.stock})")

            print("Average Price by Category:")
            for cat, avg in avg_prices.items():
                print(f"  {cat}: ₹{avg:.2f}")

        elif choice == '5':
            print("Exiting system. Goodbye!")
            break

        else:
            print("Invalid choice. Try again.")


if __name__ == '__main__':
    menu()
