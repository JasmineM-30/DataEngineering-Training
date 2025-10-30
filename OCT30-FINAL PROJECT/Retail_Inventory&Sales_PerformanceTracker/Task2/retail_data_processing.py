import pandas as pd
import numpy as np

# Load sales and inventory data from CSV files
sales_df = pd.read_csv('sales.csv')  # Columns: sale_id, product_id, quantity_sold, sale_date, region
inventory_df = pd.read_csv('inventory.csv')  # Columns: inventory_id, product_id, stock_quantity, last_updated

# Data Cleaning and Date Formatting
sales_df['sale_date'] = pd.to_datetime(sales_df['sale_date'], errors='coerce')
inventory_df['last_updated'] = pd.to_datetime(inventory_df['last_updated'], errors='coerce')

# Drop rows with missing critical data
sales_df.dropna(subset=['product_id', 'quantity_sold', 'sale_date'], inplace=True)
inventory_df.dropna(subset=['product_id', 'stock_quantity'], inplace=True)

# Fill missing stock_quantity with 0
inventory_df['stock_quantity'].fillna(0, inplace=True)

# Calculate monthly sales (sum quantity_sold per product per month)
monthly_sales = sales_df.groupby(
    [sales_df['sale_date'].dt.to_period('M'), 'product_id'])['quantity_sold'].sum().reset_index()
monthly_sales.rename(columns={'sale_date': 'month'}, inplace=True)
monthly_sales['month'] = monthly_sales['month'].dt.to_timestamp()

# Calculate inventory turnover = monthly sales / stock quantity
inventory_latest = inventory_df[['product_id', 'stock_quantity']]
merged = pd.merge(monthly_sales, inventory_latest, on='product_id', how='left')

# Calculate turnover with safe divide using numpy where
merged['inventory_turnover'] = np.where(
    merged['stock_quantity'] > 0,
    merged['quantity_sold'] / merged['stock_quantity'],
    0
)

# Generate report: Top-selling products in latest month
latest_month = monthly_sales['month'].max()
top_selling = monthly_sales[monthly_sales['month'] == latest_month].sort_values(
    by='quantity_sold', ascending=False)

print("Top Selling Products (Latest Month):")
print(top_selling.head())

# Report underperforming products: low sales (<5) and low turnover (<0.5)
underperforming = merged[(merged['quantity_sold'] < 5) & (merged['inventory_turnover'] < 0.5)]

print("\nUnderperforming Products:")
print(underperforming[['product_id', 'quantity_sold', 'stock_quantity', 'inventory_turnover']])

#summarizing sales performance
print(merged[['product_id', 'month', 'quantity_sold', 'stock_quantity', 'inventory_turnover']])
print("\nProcessed sales and inventory reports")