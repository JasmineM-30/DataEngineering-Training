use movieDB
// Users Collection
db.users.insertMany([
{ _id: 1, name: "Rahul Sharma", email: "rahul@example.com", city: "Bangalore", plan:
"Premium" },
{ _id: 2, name: "Priya Singh", email: "priya@example.com", city: "Delhi", plan:
"Basic" },
{ _id: 3, name: "Aman Kumar", email: "aman@example.com", city: "Hyderabad", plan:
"Standard" }
]);
// Movies Collection
db.movies.insertMany([
{ _id: 101, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8 },
{ _id: 102, title: "3 Idiots", genre: "Comedy", year: 2009, rating: 8.4 },
{ _id: 103, title: "Bahubali", genre: "Action", year: 2015, rating: 8.1 },
{ _id: 104, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0 },
{ _id: 105, title: "Dangal", genre: "Drama", year: 2016, rating: 8.5 }
]);
// Subscriptions Collection
db.subscriptions.insertMany([
{ user_id: 1, start_date: ISODate("2025-01-01"), end_date: ISODate("2025-12-31"),
amount: 999 },
{ user_id: 2, start_date: ISODate("2025-02-01"), end_date: ISODate("2025-07-31"),
amount: 499 },
{ user_id: 3, start_date: ISODate("2025-01-15"), end_date: ISODate("2025-10-15"),
amount: 799 }
]);
// Watch History Collection
db.watchHistory.insertMany([
{ user_id: 1, movie_id: 101, watch_date: ISODate("2025-02-10") },
{ user_id: 1, movie_id: 102, watch_date: ISODate("2025-02-12") },
{ user_id: 2, movie_id: 103, watch_date: ISODate("2025-02-11") },
{ user_id: 3, movie_id: 104, watch_date: ISODate("2025-02-13") },
{ user_id: 3, movie_id: 105, watch_date: ISODate("2025-02-14") }
]);


// A. CRUD Operations


// 1. Insert a new user in Mumbai with a "Standard" plan
db.users.insertOne({
  name: "Sneha Patel",
  email: "sneha@example.com",
  city: "Mumbai",
  plan: "Standard"
});

// 2. Update "Bahubali" rating to 8.3
db.movies.updateOne(
  { title: "Bahubali" },
  { $set: { rating: 8.3 } }
);

// 3. Delete the movie "3 Idiots"
db.movies.deleteOne({ title: "3 Idiots" });

// 4. Find all users with "Premium" plan
db.users.find({ plan: "Premium" });


// B. Indexing

// 5. Create a unique index on users.email
db.users.createIndex({ email: 1 }, { unique: true });

// 6. Create a compound index on movies.genre and rating
db.movies.createIndex({ genre: 1, rating: -1 });

// 7. Verify indexes
db.users.getIndexes();
db.movies.getIndexes();

// 8. Query that benefits from compound index
db.movies.find({ genre: "Action" }).sort({ rating: -1 });

// 9. Force COLLSCAN
db.movies.find({ rating: { $gt: 8 } }).hint({ $natural: 1 });


// C. Aggregation Framework


// 10. Count how many movies exist in each genre
db.movies.aggregate([
  { $group: { _id: "$genre", totalMovies: { $sum: 1 } } }
]);

// 11. Top 2 highest-rated movies
db.movies.find().sort({ rating: -1 }).limit(2);

// 12. Average subscription amount per plan type
db.users.aggregate([
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "user_id",
      as: "sub"
    }
  },
  { $unwind: "$sub" },
  {
    $group: {
      _id: "$plan",
      avgAmount: { $avg: "$sub.amount" }
    }
  }
]);

// 13. Total watch count per movie
db.watchHistory.aggregate([
  { $group: { _id: "$movie_id", watchCount: { $sum: 1 } } }
]);

// 14. City with max Premium users
db.users.aggregate([
  { $match: { plan: "Premium" } },
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 15. Most popular genre by watch count
db.watchHistory.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $group: {
      _id: "$movie.genre",
      watchCount: { $sum: 1 }
    }
  },
  { $sort: { watchCount: -1 } },
  { $limit: 1 }
]);


// D. $lookup (Joins)


// 16. All watch history with user name and movie title
db.watchHistory.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      user: "$user.name",
      movie: "$movie.title",
      date: "$watch_date"
    }
  }
]);

// 17. Movies watched by "Rahul Sharma"
db.watchHistory.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $match: { "user.name": "Rahul Sharma" } },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      movie: "$movie.title",
      watched_on: "$watch_date"
    }
  }
]);

// 18. Each user with their subscription details
db.users.aggregate([
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "user_id",
      as: "subscription"
    }
  }
]);

// 19. Users who watched movies released after 2010
db.watchHistory.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  { $match: { "movie.year": { $gt: 2010 } } },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      _id: 0,
      user: "$user.name",
      movie: "$movie.title"
    }
  }
]);

// 20. For each movie, list all users who watched it
db.watchHistory.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $group: {
      _id: "$movie.title",
      users: { $addToSet: "$user.name" }
    }
  }
]);

// E. Advanced Analytics


// 21. Users who watched more than 2 movies
db.watchHistory.aggregate([
  { $group: { _id: "$user_id", count: { $sum: 1 } } },
  { $match: { count: { $gt: 2 } } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $project: { _id: 0, name: "$user.name", watchCount: "$count" } }
]);

// 22. Total revenue from subscriptions
db.subscriptions.aggregate([
  { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
]);

// 23. Users whose subscription will expire in next 30 days
db.subscriptions.aggregate([
  {
    $match: {
      end_date: {
        $gte: new Date(),
        $lte: new Date(new Date().setDate(new Date().getDate() + 30))
      }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      userName: "$user.name",
      end_date: 1
    }
  }
])
.forEach(doc => print("User: " + doc.userName + ", Subscription ends: " + doc.end_date.toISOString().slice(0, 10)));


// 24. Most-watched movie overall
db.watchHistory.aggregate([
  { $group: { _id: "$movie_id", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 },
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $project: {
      _id: 0,
      title: "$movie.title",
      watchCount: "$count"
    }
  }
]);

// 25. Least-watched genre
db.watchHistory.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $group: {
      _id: "$movie.genre",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: 1 } },
  { $limit: 1 }
]);
