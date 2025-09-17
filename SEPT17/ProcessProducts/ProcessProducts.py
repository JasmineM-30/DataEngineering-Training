import json

#open and load json file
with open("products.json") as file:
    products = json.load(file)

#print all product name and category
print("Available Products:")
for p in products:
    print(f"- {p['name']} ({p['category']})")

# Calculate total inventory value (price x stock)
print("\nInventory Value:")
for p in products:
    total_value = p["price"] * p["stock"]
    print(f"{p['name']} → ₹{total_value}")
  
# Find out-of-stock products (if any)
out_of_stock = [p["name"] for p in products if p["stock"] == 0]
if out_of_stock:
    print("\nOut of Stock:", ", ".join(out_of_stock))
else:
    print("\nAll products are in stock.")
