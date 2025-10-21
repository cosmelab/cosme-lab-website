# Student Dashboard - "My Lab Logs" System

Complete documentation for the personalized student dashboard that shows individual lab log data, stats, and progress.

## Overview

The **My Lab Logs** dashboard provides each student with a personalized view of their lab work:
- Total hours worked
- Number of lab sessions
- Average hours per session
- Last visit date
- Project breakdown (hours per project)
- Complete log history (last 20 entries)

## Features

✅ **UCR SSO Authentication** - Only UCR students can access
✅ **Privacy** - Students see only their own data (filtered by UCR email)
✅ **Real-time Stats** - Automatically calculated from Google Sheets
✅ **Project Analytics** - See how time is distributed across projects
✅ **Mobile-Friendly** - Responsive design with Dracula theme
✅ **Easy Navigation** - Linked from Daily Lab Log success page and Team page

## File Structure

```
ucr-lab-website/
├── my-lab-logs.html          # Dashboard page
├── my-lab-logs.css           # Dracula-themed styling
├── my-lab-logs.js            # Frontend logic (fetch & display)
└── daily-lab-log-apps-script.js  # Backend (includes getMyLogs endpoint)
```

## How It Works

### 1. Authentication Flow

```
Student visits → UCR SSO Login → Duo MFA → Dashboard loads
                                            ↓
                                    Apps Script gets email
                                            ↓
                                    Filter logs by email
                                            ↓
                                    Return only student's data
```

### 2. Data Flow

```
Frontend (my-lab-logs.js)
    ↓
    Fetch: APPS_SCRIPT_URL?action=getMyLogs
    ↓
Apps Script (daily-lab-log-apps-script.js)
    ↓
    getMyLogsResponse() function
    ↓
    Session.getActiveUser().getEmail()
    ↓
    Filter Google Sheet by email
    ↓
    Return JSON: { success: true, email: "...", logs: [...] }
    ↓
Frontend displays:
    - Stats cards
    - Project breakdown
    - Logs table
```

## Backend Implementation

### Apps Script - getMyLogs Endpoint

Added to `daily-lab-log-apps-script.js`:

```javascript
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getMyLogs') {
    return getMyLogsResponse();
  }
  // ... other actions
}

function getMyLogsResponse() {
  const userEmail = Session.getActiveUser().getEmail();

  // Get all data from sheet
  const allData = sheet.getDataRange().getValues();
  const rows = allData.slice(1); // Skip header

  // Filter by user email
  const userLogs = rows
    .filter(row => row[1] === userEmail)
    .map(row => ({
      timestamp: row[0],
      email: row[1],
      name: row[2],
      date: row[3],
      time_in: row[4],
      time_out: row[5],
      hours_worked: parseFloat(row[6]),
      project: row[7],
      accomplishments: row[8]
    }));

  return createJsonResponse({
    success: true,
    email: userEmail,
    logs: userLogs
  });
}
```

## Frontend Implementation

### JavaScript Stats Calculation

```javascript
function calculateStats(logs) {
  let totalHours = 0;
  const projectHours = {};
  let lastVisit = null;

  logs.forEach(log => {
    totalHours += parseFloat(log.hours_worked) || 0;
    projectHours[log.project] = (projectHours[log.project] || 0) + hours;

    const logDate = new Date(log.date);
    if (!lastVisit || logDate > lastVisit) {
      lastVisit = logDate;
    }
  });

  return {
    totalHours,
    totalSessions: logs.length,
    avgHours: totalHours / logs.length,
    lastVisit,
    projectHours
  };
}
```

## Deployment Steps

### Step 1: Update Apps Script

1. Open Google Sheet → Extensions → Apps Script
2. Replace ALL code with `daily-lab-log-apps-script.js`
3. **Important**: The new version includes `getMyLogsResponse()` function
4. Save the script
5. Deploy → New deployment
   - Type: Web app
   - Execute as: **User accessing the web app**
   - Who has access: **Anyone in ucr.edu**
6. Click Deploy
7. Copy the Web App URL

### Step 2: Verify Web App URL

Make sure both files use the same URL:
- `daily-lab-log.js` (line 5)
- `my-lab-logs.js` (line 6)

Both should have:
```javascript
const APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
```

### Step 3: Deploy to GitHub Pages

```bash
cd /Users/lucianocosme/Projects/ucr-lab-website

git add my-lab-logs.html my-lab-logs.css my-lab-logs.js
git add daily-lab-log.html daily-lab-log.css daily-lab-log-apps-script.js
git add team.html
git add STUDENT-DASHBOARD-README.md

git commit -m "Add student dashboard system"
git push
```

### Step 4: Test the System

1. **Test Daily Log Submission:**
   - Visit: `https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html`
   - Log in with UCR credentials (Duo will trigger)
   - Submit a test log entry
   - Click "View My Logs" on success page

2. **Test Dashboard:**
   - Should redirect to UCR login
   - After Duo approval, dashboard loads
   - Verify stats are calculated correctly
   - Check project breakdown shows correct data
   - Verify table shows your logs only

3. **Test Privacy:**
   - Have another student log in
   - They should see ONLY their data, not yours

## URLs

**Production:**
- Dashboard: `https://cosmelab.github.io/cosme-lab-website/my-lab-logs.html`
- Daily Log: `https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html`
- Team Page: `https://cosmelab.github.io/cosme-lab-website/team.html`

**Access Points:**
1. Team Page → Lab Resources → "My Lab Logs" button
2. After submitting daily log → "View My Logs" button
3. Direct URL (requires UCR login)

## Styling - Dracula Theme

All dashboard elements use consistent Dracula colors:
- **Purple** (#bd93f9, darker: #9d6fd9) - Headers, icons, primary actions
- **Magenta** (#ff79c6, darker: #d946aa) - Accents, gradients
- **Cyan** (#8be9fd) - Text, data values
- **Dark backgrounds** (#1a1b26, #24283b) - Cards, containers

### Button Animations

All buttons have rotating icon animations on hover:
- Primary buttons: 360° rotation
- Secondary buttons: 180° rotation
- Smooth 0.3-0.4s transitions

## Data Structure

### Google Sheet Columns

```
A: timestamp           (auto-generated)
B: email              (from UCR SSO)
C: name               (student name)
D: date               (work date)
E: time_in            (arrival time)
F: time_out           (departure time)
G: hours_worked       (calculated)
H: project            (project name)
I: accomplishments    (work description)
```

### API Response Format

```json
{
  "success": true,
  "email": "student@ucr.edu",
  "logs": [
    {
      "timestamp": "2025-10-21T12:00:00Z",
      "email": "student@ucr.edu",
      "name": "Student Name",
      "date": "2025-10-21",
      "time_in": "09:00",
      "time_out": "12:30",
      "hours_worked": 3.5,
      "project": "Mosquito Genomics",
      "accomplishments": "DNA extraction from 24 samples"
    }
  ]
}
```

## Future Enhancements

Possible additions:
- 📊 **Charts**: Line graph showing hours over time
- 📅 **Calendar View**: Heatmap of lab attendance
- 🏆 **Milestones**: Badges for 10h, 50h, 100h worked
- 📈 **Comparisons**: "You worked X% more than last month"
- 📥 **Export**: Download personal logs as CSV
- 📧 **Email Reports**: Weekly summary emails

## Troubleshooting

### "Authentication failed"

**Check:**
- Apps Script deployment: "Execute as: User accessing"
- Access setting: "Anyone in ucr.edu"
- User is logging in with @ucr.edu email

### "No data appearing"

**Check:**
- Apps Script logs: View → Logs
- Web App URL is correct in `my-lab-logs.js`
- Student has submitted at least one log entry
- Email in Session matches email in Sheet

### "Wrong data showing"

**Check:**
- Verify `getMyLogsResponse()` filters by `row[1] === userEmail`
- Check Google Sheet column B contains emails
- Test with `Logger.log(userEmail)` to verify Session email

### "Stats calculation wrong"

**Check:**
- `hours_worked` column (G) contains numeric values
- `parseFloat()` is working correctly
- Date parsing in JavaScript matches Sheet date format

## Security & Privacy

✅ **UCR SSO Required** - All access requires NetID + Duo MFA
✅ **Email-based Filtering** - Backend filters by authenticated user's email
✅ **No Cross-Student Access** - Students cannot see others' data
✅ **FERPA Compliant** - Data stays within UCR Google Workspace
✅ **No Public Access** - "Anyone in ucr.edu" restriction enforced by Google

## Support

For issues:
1. Check Apps Script logs (View → Logs)
2. Check browser console (F12 → Console)
3. Verify Google Sheet structure matches expected columns
4. Contact lab: lcosme@ucr.edu

---

**Created**: October 2025
**Last Updated**: October 21, 2025
**Version**: 1.0
