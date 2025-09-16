use expenseDB;

db.receipts.insertMany([
  {
    receipt_id: 101,
    user_id: 1,
    receipt_date: ISODate("2025-09-10T00:00:00Z"),
    total_amount: 120.75,
    items: [
      { name: "Milk", quantity: 2, price: 3.5 },
      { name: "Bread", quantity: 1, price: 2.0 }
    ],
    notes: "Weekly grocery shopping"
  },
  {
    receipt_id: 102,
    user_id: 2,
    receipt_date: ISODate("2025-09-11T00:00:00Z"),
    total_amount: 85.00,
    items: [
      { name: "Bus ticket", quantity: 1, price: 15.0 },
      { name: "Medicine", quantity: 1, price: 70.0 }
    ],
    notes: "Travel and health expenses"
  },
  {
    receipt_id: 103,
    user_id: 1,
    receipt_date: ISODate("2025-09-12T00:00:00Z"),
    total_amount: 60.00,
    items: [
      { name: "Restaurant Dinner", quantity: 3, price: 20.0 }
    ],
    notes: "Dinner with family"
  },
  {
    receipt_id: 104,
    user_id: 3,
    receipt_date: ISODate("2025-09-10T00:00:00Z"),
    total_amount: 150.00,
    items: [
      { name: "Concert Tickets", quantity: 2, price: 75.0 }
    ],
    notes: "Summer concert"
  },
  {
    receipt_id: 105,
    user_id: 4,
    receipt_date: ISODate("2025-09-13T00:00:00Z"),
    total_amount: 45.00,
    items: [
      { name: "Taxi ride", quantity: 1, price: 25.00 },
      { name: "Coffee", quantity: 2, price: 10.00 }
    ],
    notes: "Travel and snacks"
  },
  {
    receipt_id: 106,
    user_id: 5,
    receipt_date: ISODate("2025-09-12T00:00:00Z"),
    total_amount: 40.00,
    items: [
      { name: "Medication", quantity: 1, price: 40.00 }
    ],
    notes: "Health expense"
  },
  {
    receipt_id: 107,
    user_id: 6,
    receipt_date: ISODate("2025-09-10T00:00:00Z"),
    total_amount: 300.00,
    items: [
      { name: "Course fee", quantity: 1, price: 300.00 }
    ],
    notes: "Education"
  },
  {
    receipt_id: 108,
    user_id: 7,
    receipt_date: ISODate("2025-09-11T00:00:00Z"),
    total_amount: 55.00,
    items: [
      { name: "Dinner", quantity: 1, price: 55.00 }
    ],
    notes: "Dining out"
  },
  {
    receipt_id: 109,
    user_id: 4,
    receipt_date: ISODate("2025-09-14T00:00:00Z"),
    total_amount: 70.00,
    items: [
      { name: "Groceries", quantity: 10, price: 7.00 }
    ],
    notes: "Weekly groceries"
  },
  {
    receipt_id: 110,
    user_id: 5,
    receipt_date: ISODate("2025-09-15T00:00:00Z"),
    total_amount: 80.50,
    items: [
      { name: "Internet bill", quantity: 1, price: 80.50 }
    ],
    notes: "Utilities"
  }
]);

// Create indexes for faster lookup

db.receipts.createIndex({ receipt_id: 1 });
db.receipts.createIndex({ user_id: 1 });
db.receipts.createIndex({ receipt_date: -1 });

// Find queries Using the Indexes

db.receipts.find({ receipt_id: 105 }).pretty();
db.receipts.find({ user_id: 7 }).pretty();
db.receipts.find({ user_id: 4 }).sort({ receipt_date: -1 }).pretty();
db.receipts.find({ receipt_date: { $gte: ISODate("2025-09-12T00:00:00Z") } }).pretty();
