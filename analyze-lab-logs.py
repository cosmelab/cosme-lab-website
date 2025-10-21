#!/usr/bin/env python3
"""
Daily Lab Log Analysis Script
Uses gspread to analyze student lab attendance and productivity

Requirements:
    pip install gspread pandas matplotlib

Setup:
    1. Use the same Google API credentials as email sending
    2. Share your Google Sheet with the service account email
    3. Update SPREADSHEET_ID below
"""

import gspread
from google.oauth2.service_account import Credentials
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

# === CONFIGURATION ===
CREDENTIALS_FILE = "/Users/lucianocosme/Library/CloudStorage/Dropbox/teaching/luciano/email_results/final/luciano.json"
SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"  # Get from Google Sheet URL
SHEET_NAME = "Submissions"

# === AUTHENTICATION ===
def get_google_sheets_client():
    """Authenticate and return gspread client"""
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]

    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    client = gspread.authorize(creds)
    return client

# === DATA LOADING ===
def load_lab_data():
    """Load lab log data from Google Sheets into pandas DataFrame"""
    client = get_google_sheets_client()
    sheet = client.open_by_key(SPREADSHEET_ID).worksheet(SHEET_NAME)

    # Get all records
    data = sheet.get_all_records()

    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Convert date column to datetime
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])

    # Convert hours_worked to float
    if 'hours_worked' in df.columns:
        df['hours_worked'] = pd.to_numeric(df['hours_worked'], errors='coerce')

    return df

# === ANALYSIS FUNCTIONS ===

def student_summary(df):
    """Generate summary statistics for each student"""
    summary = df.groupby('name').agg({
        'hours_worked': ['sum', 'count', 'mean'],
        'date': ['min', 'max']
    }).round(2)

    summary.columns = ['Total Hours', 'Total Sessions', 'Avg Hours/Session', 'First Visit', 'Last Visit']
    summary = summary.sort_values('Total Hours', ascending=False)

    print("\n=== STUDENT SUMMARY ===")
    print(summary)
    print()

    return summary

def weekly_analysis(df, weeks=4):
    """Analyze lab activity over the past N weeks"""
    # Get date range
    end_date = datetime.now()
    start_date = end_date - timedelta(weeks=weeks)

    # Filter data
    recent = df[df['date'] >= start_date]

    # Group by week and student
    recent['week'] = recent['date'].dt.to_period('W')

    weekly = recent.groupby(['week', 'name'])['hours_worked'].sum().unstack(fill_value=0)

    print(f"\n=== LAST {weeks} WEEKS ACTIVITY ===")
    print(weekly)
    print()

    return weekly

def project_breakdown(df):
    """Analyze time spent on each project"""
    project_hours = df.groupby('project')['hours_worked'].sum().sort_values(ascending=False)

    print("\n=== PROJECT TIME BREAKDOWN ===")
    for project, hours in project_hours.items():
        print(f"{project}: {hours:.2f} hours ({hours/project_hours.sum()*100:.1f}%)")
    print()

    return project_hours

def busiest_days(df):
    """Find busiest days of the week"""
    df['day_of_week'] = df['date'].dt.day_name()

    day_stats = df.groupby('day_of_week')['hours_worked'].agg(['sum', 'count']).round(2)
    day_stats.columns = ['Total Hours', 'Total Sessions']

    # Sort by weekday order
    weekday_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    day_stats = day_stats.reindex([d for d in weekday_order if d in day_stats.index])

    print("\n=== BUSIEST DAYS ===")
    print(day_stats)
    print()

    return day_stats

def student_progress(df, student_name):
    """Track individual student's progress over time"""
    student_data = df[df['name'] == student_name].sort_values('date')

    if student_data.empty:
        print(f"No data found for {student_name}")
        return None

    print(f"\n=== {student_name.upper()} PROGRESS ===")
    print(f"Total hours: {student_data['hours_worked'].sum():.2f}")
    print(f"Total sessions: {len(student_data)}")
    print(f"Average session: {student_data['hours_worked'].mean():.2f} hours")
    print(f"\nRecent sessions:")
    print(student_data[['date', 'hours_worked', 'project', 'accomplishments']].tail(10))
    print()

    return student_data

def export_summary_csv(df, filename='lab_summary.csv'):
    """Export summary to CSV"""
    summary = student_summary(df)
    summary.to_csv(filename)
    print(f"Summary exported to {filename}")

# === VISUALIZATION ===

def plot_student_hours(df):
    """Create bar chart of total hours per student"""
    student_hours = df.groupby('name')['hours_worked'].sum().sort_values(ascending=False)

    plt.figure(figsize=(10, 6))
    student_hours.plot(kind='bar', color='#bd93f9')
    plt.title('Total Lab Hours by Student', fontsize=16, fontweight='bold')
    plt.xlabel('Student', fontsize=12)
    plt.ylabel('Total Hours', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('student_hours.png', dpi=300, bbox_inches='tight')
    print("Chart saved: student_hours.png")
    plt.show()

def plot_weekly_trend(df, weeks=8):
    """Plot weekly lab activity trend"""
    # Get date range
    end_date = datetime.now()
    start_date = end_date - timedelta(weeks=weeks)

    # Filter and group
    recent = df[df['date'] >= start_date]
    recent['week'] = recent['date'].dt.to_period('W').astype(str)

    weekly_hours = recent.groupby('week')['hours_worked'].sum()

    plt.figure(figsize=(12, 6))
    weekly_hours.plot(kind='line', marker='o', linewidth=2, markersize=8, color='#8be9fd')
    plt.title(f'Weekly Lab Activity (Last {weeks} Weeks)', fontsize=16, fontweight='bold')
    plt.xlabel('Week', fontsize=12)
    plt.ylabel('Total Hours', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.grid(alpha=0.3)
    plt.tight_layout()
    plt.savefig('weekly_trend.png', dpi=300, bbox_inches='tight')
    print("Chart saved: weekly_trend.png")
    plt.show()

# === MAIN ===

def main():
    """Run all analyses"""
    print("Loading lab data from Google Sheets...")
    df = load_lab_data()

    print(f"Loaded {len(df)} log entries from {df['name'].nunique()} students")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")

    # Run analyses
    student_summary(df)
    weekly_analysis(df, weeks=4)
    project_breakdown(df)
    busiest_days(df)

    # Example: Track specific student
    # student_progress(df, "Matthew Shan")

    # Export
    # export_summary_csv(df)

    # Visualizations
    # plot_student_hours(df)
    # plot_weekly_trend(df)

if __name__ == "__main__":
    main()
