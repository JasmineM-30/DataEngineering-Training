use ecommerceDB;
db.customers.insertMany([
  { _id: 1, name: "Rahul Sharma", email: "rahul@example.com", city: "Bangalore" },
  { _id: 2, name: "Priya Singh", email: "priya@example.com", city: "Delhi" },
  { _id: 3, name: "Aman Kumar", email: "aman@example.com", city: "Hyderabad" },
  { _id: 4, name: "Sneha Reddy", email: "sneha@example.com", city: "Chennai" }
]);
db.products.insertMany([
  { _id: 101, name: "Laptop", category: "Electronics", price: 55000 },
  { _id: 102, name: "Mobile Phone", category: "Electronics", price: 25000 },
  { _id: 103, name: "Headphones", category: "Accessories", price: 3000 },
  { _id: 104, name: "Tablet", category: "Electronics", price: 20000 },
  { _id: 105, name: "Chair", category: "Furniture", price: 5000 }
]);
db.orders.insertMany([
  {
    _id: 1001,
    customer_id: 1,
    items: [
      { product_id: 101, quantity: 1 },
      { product_id: 103, quantity: 2 }
    ],
    order_date: ISODate("2025-01-05")
  },
  {
    _id: 1002,
    customer_id: 2,
    items: [
      { product_id: 102, quantity: 1 },
      { product_id: 105, quantity: 4 }
    ],
    order_date: ISODate("2025-01-06")
  },
  {
    _id: 1003,
    customer_id: 3,
    items: [
      { product_id: 104, quantity: 1 }
    ],
    order_date: ISODate("2025-01-09")
  }
]);

db.customers.find();

// Data Modeling

db.products.find({ category: "Electronics"});
db.orders.find({ customer_id : 1});
db.products.updateOne({ _id: 103 }, { $set: {price: 3200}});
db.products.updateOne({ _id: 2 }, { $set: { city: "Gurgaon"}});

// Indexing

db.customers.createIndex({ email: 1}, { unique: true }) ; //simple index
db.products.createIndex({ category: 1, price: -1 }); //compound index
db.products.getIndexes();
db.customers.getIndexes();
db.products.find({ category: "Electronics" }).sort({ price: -1 }).explain("executionStats")
db.products.find({ price: { $gt: 20000 } }).sort({ price: -1 }).explain("executionStats")

// Aggregation Framework

db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.product_id",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" },
  {
    $group: {
      _id: "$customer_id",
      totalSpend: { $sum: { $multiply: ["$items.quantity", "$productDetails.price"] } }
    }
  }
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customerDetails"
    }
  },
  { $unwind: "$customerDetails" },
  {
    $project: {
      _id: 1,
      order_date: 1,
      "customerDetails.name": 1,
      "customerDetails.city": 1
    }
  }
]);
