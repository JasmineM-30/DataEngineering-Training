USE libraryDB;

db.books.insertMany([
{ title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", year: 1988,
available: true },
{ title: "Clean Code", author: "Robert C. Martin", genre: "Programming", year: 2008,
available: true },
{ title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Programming",
year: 1999, available: false },
{ title: "Sapiens", author: "Yuval Noah Harari", genre: "History", year: 2011,
available: true },
{ title: "Atomic Habits", author: "James Clear", genre: "Self-Help", year: 2018,
available: false }
]);

db.books.find(); //1

db.books.find({}, { title: 1, author: 1, _id: 0 }); //2

db.books.find({ available: true }); //3

db.books.find({ genre: "Programming" }); //4

db.books.find({ year: { $gt: 2010 } }); //5

db.books.updateOne({ title: "Atomic Habits" },{ $set: { available: true } });  //6

db.books.updateOne({ title: "The Alchemist" },{ $set: { year: 1993 } });  //7

db.books.deleteOne({ author: "Andrew Hunt" }); //8

db.books.deleteMany({ genre: "History" }); //9

db.books.aggregate([{ $group: { _id: "$genre", count: { $sum: 1 } } }]); //10

db.books.find().sort({ year: 1 }).limit(1);  //11

db.books.aggregate([{ $group: { _id: null, averageYear: { $avg: "$year" } } }]);  //12
