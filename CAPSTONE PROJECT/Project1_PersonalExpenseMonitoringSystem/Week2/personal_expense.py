import pandas as pd
import numpy as np


def main():
    # Load expense data from CSV file
    df = pd.read_csv('expense.csv')

    # Clean and standardize 'amount' column: remove $ signs if any, convert to float
    df['amount'] = df['amount'].replace(r'[\$,]', '', regex=True).astype(float)

    # Convert 'expense_date' column to datetime
    df['expense_date'] = pd.to_datetime(df['expense_date'])

    # Extract month period for grouping
    df['month'] = df['expense_date'].dt.to_period('M')

    # Calculate monthly totals and averages
    monthly_totals = df.groupby('month')['amount'].sum()
    monthly_averages = df.groupby('month')['amount'].mean()

    # Create category-wise breakdown by month
    category_breakdown = df.groupby(['month', 'category'])['amount'].sum().unstack(fill_value=0)

    # Cleaned dataset and results
    print("Cleaned Dataset:")
    print(df)

    print("Monthly Totals:")
    print(monthly_totals)

    print("\nMonthly Averages:")
    print(monthly_averages)

    print("\nCategory-wise Breakdown:")
    print(category_breakdown)


if __name__ == "__main__":
    main()
