// Connect to retail_db database
Use retail_db;

// Insert sample feedback documents
db.feedbacks.insertMany([
  {
    feedback_id: "fb001",
    product_id: 1,
    type: "customer",
    comments: "The laptop battery life is great but heating issue reported.",
    rating: 4,
    feedback_date: ISODate("2025-10-25")
  },
  {
    feedback_id: "fb002",
    product_id: 2,
    type: "supplier",
    comments: "Wireless mouse delivery delay this month.",
    rating: null,
    feedback_date: ISODate("2025-10-24")
  },
  {
    feedback_id: "fb003",
    product_id: 4,
    type: "customer",
    comments: "Smartphone X has excellent camera quality.",
    rating: 5,
    feedback_date: ISODate("2025-10-26")
  },
  {
    feedback_id: "fb004",
    product_id: 5,
    type: "supplier",
    comments: "Bluetooth speaker shipment delayed due to customs.",
    rating: null,
    feedback_date: ISODate("2025-10-27")
  },
  {
    feedback_id: "fb005",
    product_id: 3,
    type: "customer",
    comments: "Desk Lamp brightness level is satisfactory but feels fragile.",
    rating: 3,
    feedback_date: ISODate("2025-10-25")
  },
  {
    feedback_id: "fb006",
    product_id: 6,
    type: "customer",
    comments: "Office Desk is sturdy and easy to assemble.",
    rating: 4,
    feedback_date: ISODate("2025-10-28")
  }
]);

// Create index for quick search on product_id
db.feedbacks.createIndex({ product_id: 1 });

// Query example: find feedback for product_id = 1
db.feedbacks.find({ product_id: 1 }).pretty();
