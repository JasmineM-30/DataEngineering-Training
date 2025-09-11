use hospitalDB
// Patients Collection
db.patients.insertMany([
{ _id: 1, name: "Arjun Mehta", age: 34, gender: "Male", city: "Bangalore" },
{ _id: 2, name: "Neha Kapoor", age: 29, gender: "Female", city: "Delhi" },
{ _id: 3, name: "Ravi Sharma", age: 45, gender: "Male", city: "Hyderabad" },
{ _id: 4, name: "Priya Singh", age: 38, gender: "Female", city: "Chennai" }
]);
// Doctors Collection
db.doctors.insertMany([
{ _id: 101, name: "Dr. Ramesh", specialization: "Cardiology", experience: 15 },
{ _id: 102, name: "Dr. Sneha", specialization: "Dermatology", experience: 8 },
{ _id: 103, name: "Dr. Amit", specialization: "Neurology", experience: 12 },
{ _id: 104, name: "Dr. Pooja", specialization: "Orthopedics", experience: 10 }
]);
// Appointments Collection (patient_id references patients, doctor_id references
doctors)
db.appointments.insertMany([
{ patient_id: 1, doctor_id: 101, date: ISODate("2025-01-05"), status: "Completed",
fee: 2000 },
{ patient_id: 2, doctor_id: 102, date: ISODate("2025-01-06"), status: "Completed",
fee: 1500 },
{ patient_id: 3, doctor_id: 103, date: ISODate("2025-01-07"), status: "Scheduled",
fee: 2500 },
{ patient_id: 4, doctor_id: 104, date: ISODate("2025-01-08"), status: "Completed",
fee: 1800 },
{ patient_id: 1, doctor_id: 104, date: ISODate("2025-01-10"), status: "Completed",
fee: 2200 }
]);

// CRUD Basics

//1
db.patients.insertOne({
  _id: 5,
  name: "Kiran Rao",
  age: 41,
  gender: "Female",
  city: "Mumbai"
});

//2
db.doctors.find({ specialization: "Cardiology" });

//3
db.patients.updateOne(
  { name: "Ravi Sharma" },
  { $set: { city: "Pune" } }
);

//4
db.appointments.deleteOne({ status: "Completed" });

// Indexing

//5
db.patients.createIndex({ city: 1 });

//6
db.doctors.createIndex({ specialization: 1, experience: -1 });

//7
db.patients.getIndexes();
db.doctors.getIndexes();

//8
db.doctors.find({ specialization: "Cardiology" }).sort({ experience: -1 });

//9
db.patients.find({ name: "Neha Kapoor" }).explain("executionStats");

// Aggregation Framework

// 10
db.appointments.aggregate([
  {
    $group: {
      _id: "$doctor_id",
      totalAppointments: { $sum: 1 }
    }
  }
]);

//11
db.appointments.aggregate([
  {
    $group: {
      _id: "$doctor_id",
      totalFees: { $sum: "$fee" }
    }
  }
]);

//12
db.patients.aggregate([
  {
    $group: {
      _id: "$city",
      avgAge: { $avg: "$age" }
    }
  }
]);

//13
db.appointments.aggregate([
  {
    $lookup: {
      from: "patients",
      localField: "patient_id",
      foreignField: "_id",
      as: "patient"
    }
  },
  {
    $lookup: {
      from: "doctors",
      localField: "doctor_id",
      foreignField: "_id",
      as: "doctor"
    }
  },
  {
    $unwind: "$patient"
  },
  {
    $unwind: "$doctor"
  }
]);

//14
db.appointments.aggregate([
  {
    $group: {
      _id: "$doctor_id",
      uniquePatients: { $addToSet: "$patient_id" }
    }
  },
  {
    $project: {
      patientCount: { $size: "$uniquePatients" }
    }
  },
  {
    $match: {
      patientCount: { $gt: 1 }
    }
  }
]);

//15
db.appointments.aggregate([
  {
    $group: {
      _id: "$patient_id",
      totalSpent: { $sum: "$fee" }
    }
  },
  {
    $match: {
      totalSpent: { $gt: 3000 }
    }
  },
  {
    $lookup: {
      from: "patients",
      localField: "_id",
      foreignField: "_id",
      as: "patient"
    }
  },
  {
    $unwind: "$patient"
  },
  {
    $project: {
      _id: 0,
      patientName: "$patient.name",
      totalSpent: 1
    }
  }
]);
