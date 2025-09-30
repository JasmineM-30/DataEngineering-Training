from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, sum, when, hour, to_timestamp, trim

# Initialize Spark session
spark = SparkSession.builder.appName("EmployeeAttendanceAnalysis").getOrCreate()

# Load attendance CSV (update path as needed)
df = spark.read.csv("attendance_clean.csv", header=True, inferSchema=True)

# Trim whitespace in status for accurate matching
df = df.withColumn("status", trim(col("status")))

# Convert clockin, clockout columns to timestamp type
df = df.withColumn("clockin", to_timestamp(col("clockin"))) \
       .withColumn("clockout", to_timestamp(col("clockout")))

# Calculate late login flag for clockin after 9:30AM
df = df.withColumn(
    "is_late",
    when(hour("clockin") > 9, 1)
     .when((hour("clockin") == 9) & (col("clockin").substr(15, 2).cast("int") > 30), 1)
     .otherwise(0)
)

# Mark absences, considering null, empty, or various case values for 'Absent'
df = df.withColumn(
    "is_absent",
    when(
        (col("status").isNull()) | 
        (col("status") == "") | 
        (col("status").rlike("(?i)absent")),
        1).otherwise(0)
)

# Calculate work hours difference in decimals (null if absent)
df = df.withColumn(
    "workhours",
    (col("clockout").cast("long") - col("clockin").cast("long")) / 3600
)

# Group by department and aggregate metrics
dept_metrics = df.groupBy("department").agg(
    avg("workhours").alias("avg_workhours"),
    avg("taskscompleted").alias("avg_taskscompleted"),
    sum("is_late").alias("total_late_logins"),
    sum("is_absent").alias("total_absences"),
    avg("is_late").alias("late_login_ratio"),
    avg("is_absent").alias("absent_ratio")
)

print("Department-level Attendance and Productivity Summary:")
dept_metrics.show(truncate=False)

print("Departments with High Lateness or Absence:")
dept_metrics.filter((col("late_login_ratio") > 0.1) | (col("absent_ratio") > 0.1)).show(truncate=False)

# Stop Spark session
spark.stop()
