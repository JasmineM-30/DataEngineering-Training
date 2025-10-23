from pyspark.sql.functions import col, sum as spark_sum, avg, month, year, when, to_date, trim

# === Step 1: Load users and expenses data from DBFS ===
users_path = "dbfs:/FileStore/tables/users_cleaned.csv" 
expenses_path = "dbfs:/FileStore/tables/expense.csv"

users_df = spark.read.option("header", True).csv(users_path, inferSchema=True)
expenses_df = spark.read.option("header", True).csv(expenses_path, inferSchema=True)

# === Step 2: Clean and transform expense data ===
expenses_df_clean = expenses_df \
    .withColumn("expense_date", to_date(col("expense_date"))) \
    .withColumn("amount", col("amount").cast("double")) \
    .withColumn("category", trim(col("category"))) \
    .withColumn("year", year(col("expense_date"))) \
    .withColumn("month", month(col("expense_date"))) \
    .withColumn("is_large_expense", when(col("amount") > 500, 1).otherwise(0))

# === Step 3: Join users and expenses on user_id ===
joined_df = expenses_df_clean.join(users_df, "user_id", "inner")

# === Step 4: Aggregate user-level monthly KPIs ===
user_metrics = joined_df.groupBy("user_id", "username", "year", "month").agg(
    spark_sum("amount").alias("monthly_spend"),
    avg("amount").alias("avg_expense"),
    spark_sum("is_large_expense").alias("large_expense_count")
)

# === Step 5: Join with budget data, calculate savings and alert flag ===
user_metrics = user_metrics.join(users_df.select("user_id", "monthly_budget"), "user_id", "left")

user_metrics = user_metrics.withColumn(
    "monthly_savings",
    when(col("monthly_budget").isNotNull(), col("monthly_budget") - col("monthly_spend")).otherwise(None)
).withColumn(
    "spend_alert", 
    when(col("monthly_savings") < 0, 1).otherwise(0)
)

# === Step 6: Aggregate summary metrics for dashboard ===
summary_metrics = user_metrics.groupBy("year", "month").agg(
    avg("monthly_spend").alias("avg_monthly_spend"),
    avg("monthly_savings").alias("avg_monthly_savings"),
    spark_sum("spend_alert").alias("users_over_budget")
)

# === Step 7: Display outputs for validation ===
display(user_metrics.orderBy("user_id", "year", "month"))
display(summary_metrics.orderBy("year", "month"))

# === Step 8: Save outputs in Delta format and CSV for dashboards ===
delta_output_path = "dbfs:/FileStore/tables/user_monthly_metrics_delta"
csv_output_path = "dbfs:/FileStore/tables/user_monthly_metrics_csv"

# Save as Delta table
user_metrics.write.format("delta").mode("overwrite").save(delta_output_path)
# Save as CSV files
user_metrics.write.option("header", True).mode("overwrite").csv(csv_output_path)

# === Step 9: Register Delta  ===
spark.sql(f"""
CREATE TABLE IF NOT EXISTS department_metrics
USING DELTA
""")

print(f"Saved user metrics to Delta at {delta_output_path}")
print(f"Saved user metrics to CSV files at {csv_output_path}")
