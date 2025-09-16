use employee_tracker;
db.task_feedback.insertMany([
  {
    _id: "fb_1",
    employee_id: 1,
    task_id: 101,
    department: "IT",
    feedback: "Completed server maintenance and upgraded security protocols successfully.",
    notes: "No downtime experienced; all systems operational.",
    created_at: new Date()
  },
  {
    _id: "fb_2",
    employee_id: 2,
    task_id: 102,
    department: "HR",
    feedback: "Conducted employee satisfaction surveys and organized training plans.",
    notes: "Positive overall feedback; recommended leadership workshop.",
    created_at: new Date()
  },
  {
    _id: "fb_3",
    employee_id: 3,
    task_id: 103,
    department: "Finance",
    feedback: "Analyzed quarterly budget reports and identified cost-saving opportunities.",
    notes: "Prepared detailed summary for executive review.",
    created_at: new Date()
  },
  {
    _id: "fb_4",
    employee_id: 4,
    task_id: 104,
    department: "IT",
    feedback: "Developed new internal tools for project tracking.",
    notes: "User feedback indicates time savings and increased productivity.",
    created_at: new Date()
  },
  {
    _id: "fb_5",
    employee_id: 5,
    task_id: 105,
    department: "Marketing",
    feedback: "Successfully launched new campaign increasing brand awareness by 20%.",
    notes: "Coordinated well with sales and creative teams.",
    created_at: new Date()
  }
]);


// Create indexes for faster lookup


db.task_feedback.createIndex({ employee_id: 1 });
db.task_feedback.createIndex({ department: 1 });
db.task_feedback.createIndex({ task_id: 1 });

// Find queries using the indexes

db.task_feedback.find().pretty();
db.task_feedback.find({ employee_id: 1 });
db.task_feedback.find({ department: "IT" });
db.task_feedback.find({ task_id: 102 }).pretty();
