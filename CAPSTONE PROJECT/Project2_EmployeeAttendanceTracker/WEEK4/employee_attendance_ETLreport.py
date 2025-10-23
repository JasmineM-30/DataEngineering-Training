# Databricks notebook source
from pyspark.sql.functions import col, to_timestamp, trim, when, hour, avg, sum

# === Step 1: Load employee attendance CSV ===
attendance_path = "dbfs:/FileStore/tables/attendance_clean.csv"

attendance_df = spark.read.option("header", True).option("inferSchema", True).csv(attendance_path)

# === Step 2: Clean and transform attendance data ===
attendance_df_clean = attendance_df \
    .withColumn("clockin", to_timestamp(col("clockin"))) \
    .withColumn("clockout", to_timestamp(col("clockout"))) \
    .withColumn("status", trim(col("status"))) \
    .withColumn("is_late", when(hour("clockin") > 9, 1)
                .when((hour("clockin") == 9) & (col("clockin").substr(15, 2).cast("int") > 30), 1)
                .otherwise(0)) \
    .withColumn("is_absent", when(col("status").rlike("(?i)absent"), 1).otherwise(0)) \
    .withColumn("workhours", (col("clockout").cast("long") - col("clockin").cast("long")) / 3600) \
    .withColumn("taskscompleted", col("taskscompleted").cast("int"))

# === Step 3: Aggregate department-level monthly KPIs ===
# Assuming your attendance CSV includes a date column or use the date part of clockin
attendance_df_clean = attendance_df_clean.withColumn("date", to_timestamp(col("clockin")).cast("date"))

dept_monthly_metrics = attendance_df_clean.groupBy("department", "date").agg(
    avg("workhours").alias("avg_workhours"),
    avg("taskscompleted").alias("avg_taskscompleted"),
    sum("is_late").alias("total_late_logins"),
    sum("is_absent").alias("total_absences"),
    avg("is_late").alias("late_login_ratio"),
    avg("is_absent").alias("absence_ratio")
)

# === Step 4: Display aggregated KPIs ===
display(dept_monthly_metrics.orderBy("department", "date"))

# === Step 5: Save outputs as Delta and CSV for dashboard use ===
delta_output_path = "dbfs:/FileStore/tables/department_monthly_metrics_delta"
csv_output_path = "dbfs:/FileStore/tables/department_monthly_metrics_csv"

dept_monthly_metrics.write.format("delta").mode("overwrite").save(delta_output_path)
dept_monthly_metrics.write.option("header", True).mode("overwrite").csv(csv_output_path)

# === Step 6: Register Delta table ===
spark.sql(f"""
CREATE TABLE IF NOT EXISTS department_monthly_metrics
USING DELTA
""")

print(f"Saved department monthly metrics to Delta at {delta_output_path}")
print(f"Saved department monthly metrics CSVs at {csv_output_path}")
