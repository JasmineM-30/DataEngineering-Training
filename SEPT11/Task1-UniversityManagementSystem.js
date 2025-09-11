use universityDB;

// Students Collection
db.students.insertMany([
{ _id: 1, name: "Rahul Sharma", age: 21, email: "rahul@example.com", city:
"Bangalore" },
{ _id: 2, name: "Priya Singh", age: 22, email: "priya@example.com", city: "Delhi" },
{ _id: 3, name: "Aman Kumar", age: 20, email: "aman@example.com", city: "Hyderabad"
},
{ _id: 4, name: "Sneha Reddy", age: 23, email: "sneha@example.com", city: "Chennai"
}
]);
// Courses Collection
db.courses.insertMany([
{ _id: 101, title: "Database Systems", department: "CS", credits: 4 },
{ _id: 102, title: "Data Structures", department: "CS", credits: 3 },
{ _id: 103, title: "Economics 101", department: "Economics", credits: 2 },
{ _id: 104, title: "Operating Systems", department: "CS", credits: 4 }
]);
// Enrollments Collection (student_id references students, course_id references
courses)
db.enrollments.insertMany([
{ student_id: 1, course_id: 101, grade: "A" },
{ student_id: 1, course_id: 103, grade: "B" },
{ student_id: 2, course_id: 101, grade: "A" },
{ student_id: 3, course_id: 102, grade: "C" },
{ student_id: 4, course_id: 104, grade: "B" }
]);

// CRUD Basics

//1
db.students.insertOne({
  _id: 5,
  name: "Karan Mehta",
  age: 22,
  email: "karan@example.com",
  city: "Mumbai"
});

//2
db.students.find({ city: "Delhi" });

//3
db.students.updateOne(
  { name: "Aman Kumar" },
  { $set: { email: "aman.kumar@university.com" } }
);

//4
db.students.deleteOne({ name: "Sneha Reddy" });


// Indexing

//5
db.students.createIndex({ email: 1 }, { unique: true });

//6
db.courses.createIndex({ department: 1, credits: -1 });

//7
db.students.getIndexes();
db.courses.getIndexes();

//8
db.courses.find({ department: "CS" }).sort({ credits: -1 });

//9
db.courses.find({ title: "Economics 101" });

// Aggregation Framework

//10
db.enrollments.aggregate([
  {
    $group: {
      _id: "$course_id",
      total_students: { $sum: 1 }
    }
  }
]);

//11
db.students.aggregate([
  {
    $group: {
      _id: "$city",
      avg_age: { $avg: "$age" }
    }
  }
]);

//12
db.courses.aggregate([
  { $match: { department: "CS" } },
  { $sort: { credits: -1 } },
  { $limit: 1 }
]);

//13
db.enrollments.aggregate([
  {
    $lookup: {
      from: "students",
      localField: "student_id",
      foreignField: "_id",
      as: "student_info"
    }
  },
  { $unwind: "$student_info" },
  {
    $project: {
      student_name: "$student_info.name",
      course_id: 1,
      grade: 1
    }
  }
]);

//14
db.students.aggregate([
  {
    $lookup: {
      from: "enrollments",
      localField: "_id",
      foreignField: "student_id",
      as: "enrollments"
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "enrollments.course_id",
      foreignField: "_id",
      as: "courses_enrolled"
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      courses_enrolled: 1
    }
  }
]);

//15
db.enrollments.countDocuments({ grade: "A" });

