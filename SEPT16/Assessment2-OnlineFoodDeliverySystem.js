use foodDeliveryDB
// Customers
db.customers.insertMany([
{ _id: 1, name: "Rahul Sharma", email: "rahul@example.com", city: "Bangalore" },
{ _id: 2, name: "Priya Singh", email: "priya@example.com", city: "Delhi" },
{ _id: 3, name: "Aman Kumar", email: "aman@example.com", city: "Hyderabad" }
]);
// Restaurants
db.restaurants.insertMany([
{ _id: 101, name: "Spicy Treats", city: "Bangalore", rating: 4.5 },
{ _id: 102, name: "Delhi Biryani House", city: "Delhi", rating: 4.2 },
{ _id: 103, name: "Hyderabad Grill", city: "Hyderabad", rating: 4.7 }
]);
// Menu Items (each linked to restaurant)
db.menu.insertMany([
{ _id: 201, restaurant_id: 101, name: "Paneer Tikka", price: 250 },
{ _id: 202, restaurant_id: 101, name: "Veg Biryani", price: 180 },
{ _id: 203, restaurant_id: 102, name: "Chicken Biryani", price: 300 },
{ _id: 204, restaurant_id: 103, name: "Mutton Biryani", price: 400 },
{ _id: 205, restaurant_id: 103, name: "Butter Naan", price: 50 }
]);
// Orders (linked to customer + menu items array)
db.orders.insertMany([
{
_id: 301,
customer_id: 1,
items: [ { menu_id: 201, qty: 2 }, { menu_id: 202, qty: 1 } ],
order_date: ISODate("2025-01-05"),
status: "Delivered"
},
{
_id: 302,
customer_id: 2,
items: [ { menu_id: 203, qty: 1 } ],
order_date: ISODate("2025-01-06"),
status: "Delivered"

},
{
_id: 303,
customer_id: 3,
items: [ { menu_id: 204, qty: 1 }, { menu_id: 205, qty: 3 } ],
order_date: ISODate("2025-01-07"),
status: "Pending"
}
]);


// A. CRUD OPERATIONS


// 1. Insert a new customer in Mumbai
db.customers.insertOne({ _id: 4, name: "Sonal Mehta", email: "sonal@example.com", city: "Mumbai" });

// 2. Find all restaurants in Hyderabad
db.restaurants.find({ city: "Hyderabad" });

// 3. Update the rating of "Spicy Treats" to 4.8
db.restaurants.updateOne({ name: "Spicy Treats" }, { $set: { rating: 4.8 } });

// 4. Delete a menu item "Butter Naan"
db.menu.deleteOne({ name: "Butter Naan" });


// B. INDEXING


// 5. Create a unique index on customers.email
db.customers.createIndex({ email: 1 }, { unique: true });

// 6. Compound index on city and rating
db.restaurants.createIndex({ city: 1, rating: -1 });

// 7. Verify indexes
db.customers.getIndexes();
db.restaurants.getIndexes();

// 8. Query using compound index
db.restaurants.find({ city: "Bangalore" }).sort({ rating: -1 });

// 9. Query causing COLLSCAN
db.restaurants.find({ rating: { $gt: 4.5 } });


// C. AGGREGATION FRAMEWORK


// 10. Total orders per customer
db.orders.aggregate([
  { $group: { _id: "$customer_id", totalOrders: { $sum: 1 } } }
]);

// 11. Total revenue per restaurant
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menuDetails"
    }
  },
  { $unwind: "$menuDetails" },
  {
    $group: {
      _id: "$menuDetails.restaurant_id",
      totalRevenue: {
        $sum: { $multiply: ["$items.qty", "$menuDetails.price"] }
      }
    }
  }
]);

// 12. Top 2 most expensive dishes
db.menu.find().sort({ price: -1 }).limit(2);

// 13. Average price of dishes per restaurant
db.menu.aggregate([
  {
    $group: {
      _id: "$restaurant_id",
      avgPrice: { $avg: "$price" }
    }
  }
]);

// 14. Count of pending orders per city
db.orders.aggregate([
  { $match: { status: "Pending" } },
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $group: {
      _id: "$customer.city",
      pendingOrders: { $sum: 1 }
    }
  }
]);

// 15. Highest-rated restaurant per city
db.restaurants.aggregate([
  { $sort: { city: 1, rating: -1 } },
  {
    $group: {
      _id: "$city",
      topRestaurant: { $first: "$name" },
      rating: { $first: "$rating" }
    }
  }
]);


// D. $LOOKUP (JOINS)

// 16. Orders with customer name and city
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      order_id: "$_id",
      customer_name: "$customer.name",
      city: "$customer.city",
      items: 1,
      status: 1,
      order_date: 1
    }
  }
]);

// 17. Orders with restaurant and menu item details
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menuItem"
    }
  },
  { $unwind: "$menuItem" },
  {
    $lookup: {
      from: "restaurants",
      localField: "menuItem.restaurant_id",
      foreignField: "_id",
      as: "restaurant"
    }
  },
  { $unwind: "$restaurant" },
  {
    $project: {
      order_id: "$_id",
      item_name: "$menuItem.name",
      restaurant: "$restaurant.name",
      qty: "$items.qty",
      price: "$menuItem.price"
    }
  }
]);

// 18. Dishes ordered by each customer
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  {
    $group: {
      _id: "$customer.name",
      dishes: {
        $push: { dish: "$menu.name", qty: "$items.qty" }
      }
    }
  }
]);

// 19. Customers who ordered from "Hyderabad Grill"
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  { $match: { "menu.restaurant_id": 103 } },
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customer: "$customer.name",
      email: "$customer.email"
    }
  },
  { $group: { _id: "$customer", email: { $first: "$email" } } }
]);

// 20. Detailed bill for order 301
db.orders.aggregate([
  { $match: { _id: 301 } },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  {
    $project: {
      dish: "$menu.name",
      qty: "$items.qty",
      price: "$menu.price",
      total: { $multiply: ["$items.qty", "$menu.price"] }
    }
  }
]);


// E. ADVANCED ANALYTICS


// 21. Customers who spent more than 500
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  {
    $group: {
      _id: "$customer_id",
      totalSpent: { $sum: { $multiply: ["$items.qty", "$menu.price"] } }
    }
  },
  { $match: { totalSpent: { $gt: 500 } } },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      customer: "$customer.name",
      totalSpent: 1
    }
  }
]);

// 22. Top-spending customer in Bangalore
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  { $match: { "customer.city": "Bangalore" } },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  {
    $group: {
      _id: "$customer.name",
      totalSpent: { $sum: { $multiply: ["$items.qty", "$menu.price"] } }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 1 }
]);

// 23. Restaurants earning more than 500
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menuDetails"
    }
  },
  { $unwind: "$menuDetails" },
  {
    $group: {
      _id: "$menuDetails.restaurant_id",
      totalRevenue: {
        $sum: { $multiply: ["$items.qty", "$menuDetails.price"] }
      }
    }
  },
  { $match: { totalRevenue: { $gt: 500 } } }
]);

// 24. Daily revenue
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menu",
      localField: "items.menu_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
      totalRevenue: { $sum: { $multiply: ["$items.qty", "$menu.price"] } }
    }
  },
  { $sort: { "_id": 1 } }
]);

// 25. Most popular dish
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.menu_id",
      totalQty: { $sum: "$items.qty" }
    }
  },
  {
    $lookup: {
      from: "menu",
      localField: "_id",
      foreignField: "_id",
      as: "menu"
    }
  },
  { $unwind: "$menu" },
  { $sort: { totalQty: -1 } },
  { $limit: 1 },
  {
    $project: {
      dish: "$menu.name",
      totalQty: 1
    }
  }
]);
