# Daily Lab Log - Deployment Checklist

Quick deployment guide for the Daily Lab Log system.

## Files Ready to Deploy

### ✅ Frontend (GitHub Pages)
These files are ready in the repo root:
- `daily-lab-log.html` - Main form interface
- `daily-lab-log.css` - Dracula theme styling
- `daily-lab-log.js` - Client-side logic

### ✅ Backend (Google Apps Script)
Apps Script code ready to copy:
- `daily-lab-log-apps-script.js` - Complete backend with duplicate prevention

### ✅ Database (Google Sheets)
CSV headers ready in Google Drive:
- `/Users/lucianocosme/My Drive/undergrads/daily_log_submissions.csv`
- `/Users/lucianocosme/My Drive/undergrads/daily_log_summary.csv`
- `/Users/lucianocosme/My Drive/undergrads/daily_log_export.csv`

### ✅ Analysis (Python)
- `analyze-lab-logs.py` - gspread analysis script

### ✅ Documentation
- `DAILY-LAB-LOG-README.md` - Complete usage guide
- `daily-lab-log-setup.md` - Google Sheet structure
- `HOW-TO-CREATE-GOOGLE-FORMS-POLLS.md` - General pattern guide

---

## Deployment Steps

### Step 1: Create Google Sheet

1. Go to https://sheets.google.com
2. **File → Import → Upload**
3. Import `/Users/lucianocosme/My Drive/undergrads/daily_log_submissions.csv`
4. **Import location**: Create new spreadsheet
5. **Rename sheet**: "Cosme Lab - Daily Log"
6. **Rename tab**: "Submissions"

7. Add more tabs:
   - Import `daily_log_summary.csv` → Rename to "Summary"
   - Import `daily_log_export.csv` → Rename to "Export"

8. **Copy Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_LONG_ID/edit
   ```

### Step 2: Deploy Apps Script

1. In Google Sheet: **Extensions → Apps Script**
2. Delete default code
3. Open file: `daily-lab-log-apps-script.js`
4. **Copy ALL contents**
5. **Paste** into Apps Script editor
6. **Find line 5**: Update `SPREADSHEET_ID`:
   ```javascript
   const SPREADSHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
   ```
7. **Save** (Ctrl+S / Cmd+S)
8. **Deploy → New deployment**:
   - Type: **Web app**
   - Description: "Daily Lab Log v1"
   - Execute as: **User accessing the web app**
   - Who has access: **Anyone in ucr.edu**
9. Click **Deploy**
10. **COPY THE WEB APP URL** (you'll need it next!)

### Step 3: Update Frontend with Web App URL

1. Open file: `daily-lab-log.js`
2. **Find line 6**:
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';
   ```
3. **Replace** with your actual Web App URL from Step 2
4. **Save file**

### Step 4: Deploy to GitHub Pages

```bash
cd /Users/lucianocosme/Projects/ucr-lab-website
git add daily-lab-log.html daily-lab-log.css daily-lab-log.js
git add DAILY-LAB-LOG-README.md daily-lab-log-apps-script.js
git add daily-lab-log-setup.md analyze-lab-logs.py
git add DEPLOY-DAILY-LAB-LOG.md
git commit -m "Add daily lab log system"
git push
```

### Step 5: Add Button to Team Page

Edit `team.html`, find the "Lab Resources" section, add:

```html
<a href="daily-lab-log.html" class="team-page-button">
    <span class="mosquito-emoji">🦟</span> Daily Lab Log
</a>
```

Then:
```bash
git add team.html
git commit -m "Add daily lab log button"
git push
```

### Step 6: Test the System

1. Visit: `https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html`
2. Log in with your UCR credentials (Duo will trigger)
3. Fill out a test entry
4. Check Google Sheet "Submissions" tab - data should appear!
5. Check that your email is pre-filled

---

## Post-Deployment

### Set Up Auto-Summary (Optional)

In Apps Script → **Triggers** (clock icon):
- Function: `updateSummary`
- Event source: Time-driven
- Type: Day timer
- Time: 12am to 1am

### Python Analysis Setup

1. Update `SPREADSHEET_ID` in `analyze-lab-logs.py` (line 17)
2. Share Google Sheet with service account:
   - Open: `/Users/lucianocosme/Library/CloudStorage/Dropbox/teaching/luciano/email_results/final/luciano.json`
   - Find `client_email` field
   - Share your Google Sheet with that email (Editor access)
3. Run: `python3 analyze-lab-logs.py`

---

## Quick Reference

**Frontend URL (after deployment):**
```
https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html
```

**Google Sheet Tabs:**
- Submissions: Raw data
- Summary: Auto-calculated stats
- Export: CSV export destination

**Apps Script Functions:**
- `doPost()` - Handles form submissions
- `doGet()` - Returns user email for pre-fill
- `updateSummary()` - Recalculates statistics
- `exportToCSV()` - Exports data to CSV
- `isDuplicateSubmission()` - Prevents duplicates (2 min window)

---

## Troubleshooting

**"Data not appearing":**
- Check Apps Script logs: View → Logs
- Verify SPREADSHEET_ID is correct
- Check sheet tab name is exactly "Submissions"

**"Can't log in":**
- Verify deployment: "Execute as: User accessing"
- Verify access: "Anyone in ucr.edu"

**"Email not pre-filled":**
- Check that you're logged in with @ucr.edu account
- UCR SSO should automatically provide email

---

## Files Checklist

Before deploying, verify these files exist:

- [ ] daily-lab-log.html
- [ ] daily-lab-log.css
- [ ] daily-lab-log.js (with Web App URL updated!)
- [ ] daily-lab-log-apps-script.js (with Sheet ID updated!)
- [ ] CSV files in Google Drive
- [ ] Google Sheet created with 3 tabs
- [ ] Apps Script deployed as web app
- [ ] Frontend files pushed to GitHub

**Status**: Ready to deploy! 🚀
