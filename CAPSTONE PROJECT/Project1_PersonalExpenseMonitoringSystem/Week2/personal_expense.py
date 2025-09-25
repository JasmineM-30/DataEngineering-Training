import pandas as pd
import numpy as np

def main():
    # Load expense data
    df = pd.read_csv('expense.csv')

    # Clean 'amount' column: remove $ and convert to float
    df['amount'] = df['amount'].replace(r'[\$,]', '', regex=True).astype(float)
    
    # Convert 'expense_date' to datetime
    df['expense_date'] = pd.to_datetime(df['expense_date'])
    
    # Extract month period for grouping
    df['month'] = df['expense_date'].dt.to_period('M')
    
    # Calculate monthly totals and averages
    monthly_totals = df.groupby('month')['amount'].sum()
    monthly_averages = df.groupby('month')['amount'].mean()
    
    # Category-wise breakdown
    category_breakdown = df.groupby(['month', 'category'])['amount'].sum().unstack(fill_value=0)
    
    # Print outputs with formatting
    print("\nCleaned Dataset Sample:")
    print(df.head())
    
    print("\nMonthly Totals:")
    print(monthly_totals.apply(lambda x: f"${x:,.2f}"))
    
    print("\nMonthly Averages:")
    print(monthly_averages.apply(lambda x: f"${x:,.2f}"))
    
    print("\nCategory-wise Breakdown:")
    formatted = category_breakdown.copy()
    for col in formatted.columns:
        formatted[col] = formatted[col].apply(lambda x: f"${x:,.2f}")
    print(formatted)

if __name__ == "__main__":
    main()
