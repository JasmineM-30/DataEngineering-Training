from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as spark_sum, avg, stddev, to_date, month, year, lit

# Initialize Spark session
spark = SparkSession.builder.appName("PersonalExpenseMonitoringSystem").getOrCreate()

# Load expense data
df = spark.read.csv("expense.csv", header=True, inferSchema=True)

# Cast columns to appropriate types
df = df.withColumn("amount", col("amount").cast("float"))
df = df.withColumn("expense_date", to_date(col("expense_date"), "yyyy-MM-dd"))
df = df.withColumn("month", month(col("expense_date")))
df = df.withColumn("year", year(col("expense_date")))

# Calculate monthly total and average expenses
monthly_summary = (
    df.groupBy("year", "month")
    .agg(
        spark_sum("amount").alias("total_amount"),
        avg("amount").alias("average_amount")
    )
    .orderBy("year", "month")
)

# Calculate category-wise monthly totals
category_breakdown = (
    df.groupBy("year", "month", "category")
    .agg(spark_sum("amount").alias("category_total"))
    .orderBy("year", "month", "category")
)

# Calculate total monthly spend per user
user_monthly_spend = (
    df.groupBy("user_id", "year", "month")
    .agg(spark_sum("amount").alias("total_monthly_spend"))
)

# Calculate average and standard deviation of monthly spend per user
user_stats = (
    user_monthly_spend.groupBy("user_id")
    .agg(
        avg("total_monthly_spend").alias("avg_spend"),
        stddev("total_monthly_spend").alias("stddev_spend")
    )
)

# Join user stats with monthly spend data
spend_with_stats = user_monthly_spend.join(user_stats, "user_id")

# Define anomaly condition: monthly spending > avg + 2 * stddev
anomalies = spend_with_stats.filter(
    col("total_monthly_spend") > col("avg_spend") + 2 * col("stddev_spend")
)

# Prepare anomaly flags for join: select relevant columns
anomaly_flags = anomalies.select("user_id", "year", "month").withColumn("is_anomaly", lit(True))

# Join anomaly flag back to original expense data on user_id, year, month
df_with_anomaly = df.join(anomaly_flags, on=["user_id", "year", "month"], how="left")

# Fill null anomaly flags with False (non-anomalous)
df_with_anomaly = df_with_anomaly.fillna({"is_anomaly": False})

# Show outputs
print("Monthly Summary:")
monthly_summary.show()
print("Category-wise Breakdown:")
category_breakdown.show()
print("Users with potential unusual monthly spending spikes:")
anomalies.select(
    "user_id", "year", "month", "total_monthly_spend", "avg_spend", "stddev_spend"
).orderBy("user_id", "year", "month").show(truncate=False)
print("Expense Data with Anomaly Flags:")
df_with_anomaly.select("expense_id", "user_id", "category", "amount", "expense_date", "description", "is_anomaly").show(truncate=False)

spark.stop()
