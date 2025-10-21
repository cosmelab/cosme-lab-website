# Daily Lab Log System - Deployment Guide

A complete system for tracking daily student lab work with UCR SSO authentication.

## Features

✅ **UCR Authentication** - Requires UCR NetID + Duo MFA
✅ **Automatic Time Calculation** - Calculates hours worked
✅ **Project Tracking** - Categorize work by project
✅ **Real-time Summary** - Auto-generated statistics
✅ **CSV Export** - For data analysis
✅ **Python Analysis** - gspread integration for advanced analytics

## Files Created

### Frontend (Deploy to GitHub Pages)
- `daily-lab-log.html` - Main form
- `daily-lab-log.css` - Dracula theme styling
- `daily-lab-log.js` - Client-side logic

### Backend (Google Apps Script)
- `daily-lab-log-apps-script.js` - Server-side code

### Analysis
- `analyze-lab-logs.py` - Python analysis script

### Documentation
- `daily-lab-log-setup.md` - Google Sheet structure
- `DAILY-LAB-LOG-README.md` - This file

## Deployment Steps

### Step 1: Create Google Sheet

1. Go to https://sheets.google.com
2. Create new sheet: "Cosme Lab - Daily Log"
3. Create three tabs:
   - **Submissions** - with headers:
     ```
     timestamp | email | name | date | time_in | time_out | hours_worked | project | accomplishments
     ```
   - **Summary** - with headers:
     ```
     student_name | total_hours | total_sessions | avg_hours_per_session | last_visit
     ```
   - **Export** - empty (used for CSV export)

4. Note the Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### Step 2: Deploy Apps Script

1. In your Google Sheet: **Extensions → Apps Script**
2. Delete default code
3. Copy content from `daily-lab-log-apps-script.js`
4. Paste into Apps Script editor
5. **Save** (Ctrl+S / Cmd+S)
6. Click **Deploy → New deployment**

**Deployment Settings:**
- Type: **Web app**
- Description: "Daily Lab Log v1"
- Execute as: **User accessing the web app** ⚠️ Important!
- Who has access: **Anyone in ucr.edu** ⚠️ Important!

7. Click **Deploy**
8. **Copy the Web App URL** - you'll need this!

### Step 3: Update Frontend Code

1. Open `daily-lab-log.js`
2. Find line 6:
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';
   ```
3. Replace with your actual Web App URL from Step 2

### Step 4: Deploy to GitHub Pages

1. **Add files to git:**
   ```bash
   cd /Users/lucianocosme/Projects/ucr-lab-website
   git add daily-lab-log.html daily-lab-log.css daily-lab-log.js
   git commit -m "Add daily lab log system"
   git push
   ```

2. **URL will be:**
   ```
   https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html
   ```

### Step 5: Add Button to Team Page

Add this to `team.html` in the "Lab Resources" section:

```html
<a href="daily-lab-log.html" class="team-page-button">
    <span class="mosquito-emoji">🦟</span> Daily Lab Log
</a>
```

### Step 6: Test the System

1. Visit the deployed URL
2. You'll be prompted to log in with UCR credentials
3. **Duo MFA** will automatically be required
4. After login, your email will be pre-filled
5. Fill out a test entry
6. Check Google Sheet "Submissions" tab - data should appear!

## Using the System

### For Students

1. **Before leaving lab each day**, visit the Daily Lab Log
2. Log in with UCR NetID (one-time, then stays logged in)
3. Fill out:
   - Date (defaults to today)
   - Time In (when you arrived)
   - Time Out (click "Use current time")
   - Project worked on
   - What you accomplished
4. Submit!

### For Faculty (You)

**View Data:**
- Open Google Sheet to see all submissions
- "Summary" tab shows total hours per student

**Update Summary:**
- In Apps Script: Run `updateSummary()` function manually
- Or set up a daily trigger (same as availability poll)

**Export CSV:**
- In Apps Script: Run `exportToCSV()` function
- Data appears in "Export" tab
- Copy/paste to save as .csv file

**Python Analysis:**
1. Update `SPREADSHEET_ID` in `analyze-lab-logs.py`
2. Run: `python3 analyze-lab-logs.py`
3. Get detailed analytics, visualizations, etc.

## Python Analysis Setup

### Install Requirements
```bash
pip install gspread pandas matplotlib
```

### Share Sheet with Service Account
1. Open `luciano.json` credentials file
2. Find the `client_email` field (something like `xyz@project.iam.gserviceaccount.com`)
3. Share your Google Sheet with this email (Editor access)

### Run Analysis
```bash
python3 analyze-lab-logs.py
```

**Available Analyses:**
- Student summary (total hours, sessions, etc.)
- Weekly activity trends
- Project time breakdown
- Busiest days of the week
- Individual student progress
- Visualizations (charts/graphs)

## Updating the Summary Tab Automatically

To auto-update the Summary tab daily:

1. Apps Script → **Triggers** (clock icon)
2. **Add Trigger**
   - Function: `updateSummary`
   - Event source: Time-driven
   - Type: Day timer
   - Time of day: 12am to 1am
3. Save

## Troubleshooting

**"Authentication failed"**
- Make sure deployment setting is "Anyone in ucr.edu"
- Check that you're logged in with @ucr.edu account

**"Data not appearing in sheet"**
- Check Apps Script logs: View → Logs
- Verify sheet tab is named exactly "Submissions"
- Check column headers match exactly

**"UCR login not working"**
- This is automatic if deployed correctly
- UCR IT manages the Duo integration
- Contact UCR IT if Duo isn't triggering

**Python script errors:**
- Make sure Sheet is shared with service account email
- Verify SPREADSHEET_ID is correct
- Check credentials file path

## Security Notes

- ✅ Only @ucr.edu emails can access
- ✅ UCR SSO + Duo MFA required
- ✅ Data stored in your Google Sheet (you control access)
- ✅ No public access possible
- ✅ Students can't see each other's data

## Next Steps

1. Deploy and test with yourself
2. Have 1-2 students test
3. Once working, announce to whole lab
4. Consider weekly email reminders to fill out logs
5. Review summary data monthly

## Questions?

Check:
- Google Apps Script documentation
- gspread Python library docs
- GitHub Issues (if you want to track enhancements)
