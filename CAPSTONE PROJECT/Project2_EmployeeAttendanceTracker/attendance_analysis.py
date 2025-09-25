import pandas as pd
import numpy as np

def main():
    # Read attendance CSV file
    df = pd.read_csv("attendance.csv")

    # Convert clockin and clockout to datetime, coerce errors to NaT
    df['clockin'] = pd.to_datetime(df['clockin'], errors='coerce')
    df['clockout'] = pd.to_datetime(df['clockout'], errors='coerce')

    # Drop rows missing employeeid (should not be missing)
    df = df.dropna(subset=['employeeid'])

    # Calculate work hours where both clockin and clockout are present
    df['workhours'] = np.where(
        df['clockin'].notna() & df['clockout'].notna(),
        (df['clockout'] - df['clockin']).dt.total_seconds() / 3600,
        0
    )

    # Assume 1 hour break for those with work hours > 1, else 0
    df['breakhours'] = np.where(df['workhours'] > 1, 1, 0)

    # Calculate productive hours
    df['productive_hours'] = df['workhours'] - df['breakhours']

    # Fill missing taskscompleted with 0
    df['taskscompleted'] = df['taskscompleted'].fillna(0)

    # Calculate productivity score safely (avoid divide by zero)
    df['productivity_score'] = np.where(
        df['productive_hours'] > 0,
        df['taskscompleted'] / df['productive_hours'],
        0
    )

    # Show cleaned attendance and task records
    cleaned = df[df['clockin'].notna() & df['clockout'].notna() & df['employeeid'].notna()].copy()
    print("Cleaned Attendance and Task Dataset:\n", cleaned)

    # Aggregate average work hours and productivity by employee
    summary = df.groupby('employeeid')[['workhours', 'productivity_score']].mean().reset_index()

    # Identify frequent absentees (missing clockin or clockout)
    absentees = df[df[['clockin', 'clockout']].isnull().any(axis=1)]['employeeid'].unique()

    # Get top 5 and bottom 5 performers by productivity score
    top_performers = summary.sort_values('productivity_score', ascending=False).head(5)
    bottom_performers = summary[~summary['employeeid'].isin(absentees)].sort_values('productivity_score').head(5)


    # Print reports
    print("\nAverage Work Hours and Productivity Score per Employee:\n", summary)
    print("\nFrequent Absentees (missing clock-in or clock-out):", absentees)
    print("\nTop Performers:\n", top_performers)
    print("\nBottom Performers:\n", bottom_performers)

if __name__ == "__main__":
    main()
