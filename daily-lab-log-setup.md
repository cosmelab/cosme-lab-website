# Daily Lab Log - Google Sheet Setup Instructions

## Create New Google Sheet

1. Go to Google Sheets: https://sheets.google.com
2. Create a new sheet named: **"Cosme Lab - Daily Log"**
3. Note the Sheet URL - you'll need it later

## Tab Structure

Create these tabs (sheets) in order:

### Tab 1: "Submissions"
This stores all daily log entries from students.

**Column Headers (Row 1):**
- A: `timestamp`
- B: `email`
- C: `name`
- D: `date`
- E: `time_in`
- F: `time_out`
- G: `hours_worked`
- H: `project`
- I: `accomplishments`

### Tab 2: "Summary"
Auto-calculates student statistics (formulas will be added after submissions start coming in).

**Column Headers (Row 1):**
- A: `student_name`
- B: `total_hours`
- C: `total_sessions`
- D: `avg_hours_per_session`
- E: `last_visit`

### Tab 3: "Export"
Used for CSV export (auto-populated by script).

## Field Descriptions

- **timestamp**: Auto-generated when form is submitted
- **email**: Student's @ucr.edu email (auto-captured via UCR authentication)
- **name**: Student's full name
- **date**: Date of lab work (defaults to today)
- **time_in**: When student arrived at lab (format: HH:MM AM/PM)
- **time_out**: When student left lab (format: HH:MM AM/PM)
- **hours_worked**: Auto-calculated from time_in and time_out
- **project**: Dropdown selection (Mosquito Genomics, Mealworm Farming, General Lab, Other)
- **accomplishments**: Text description of what was accomplished

## Next Steps

After creating the sheet:
1. Copy the Sheet ID from the URL (the long string after /d/)
2. Go to Extensions → Apps Script
3. We'll add the backend code there
