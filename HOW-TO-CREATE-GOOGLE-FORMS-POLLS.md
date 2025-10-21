# Complete Guide: Creating Google Forms/Polls with Apps Script

A comprehensive guide for creating interactive forms, polls, and data collection systems using Google Sheets, Apps Script, and GitHub Pages.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Step-by-Step Tutorial](#step-by-step-tutorial)
4. [Preventing Duplicate Submissions](#preventing-duplicate-submissions)
5. [UCR SSO Authentication](#ucr-sso-authentication)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This system allows you to create custom forms/polls that:
- Store data in Google Sheets (easy to analyze)
- Host frontend on GitHub Pages (free, no server needed)
- Use Google Apps Script as backend (serverless, free)
- Support UCR authentication (optional)
- Prevent duplicate submissions
- Auto-archive data on schedules

**Examples built with this system:**
- Lab availability poll (weekly scheduling)
- Daily lab log (time tracking)
- Mentoring preferences survey
- Class attendance/quizzes (future)

---

## Architecture

```
┌─────────────────┐
│  GitHub Pages   │ ← Students fill out form here
│  (Frontend)     │
└────────┬────────┘
         │ POST request
         ▼
┌─────────────────┐
│ Apps Script     │ ← Validates & processes data
│ (Backend)       │
└────────┬────────┘
         │ Writes data
         ▼
┌─────────────────┐
│ Google Sheets   │ ← Data storage & analysis
│ (Database)      │
└─────────────────┘
```

**Why this setup?**
- ✅ Free (no hosting costs)
- ✅ No server management
- ✅ Automatic backups (Google Drive)
- ✅ Real-time collaboration
- ✅ Easy to analyze with Python/R
- ✅ UCR IT approved (uses Google infrastructure)

---

## Step-by-Step Tutorial

### Phase 1: Design Your Data Structure

**Example: Lab Availability Poll**

1. **What questions do you need?**
   - Student email (@ucr.edu)
   - Student name
   - Available time slots (day + time)

2. **How will you store it?**
   - Each time slot = one row
   - Columns: timestamp, email, name, day, time, day_index, time_index, showed_up

3. **Create CSV headers:**
   ```csv
   timestamp,student_email,student_name,day,time,day_index,time_index,showed_up
   ```

### Phase 2: Create Google Sheet

1. Save CSV file to Google Drive:
   ```bash
   /Users/lucianocosme/My Drive/undergrads/your_project_name.csv
   ```

2. Import to Google Sheets:
   - Go to https://sheets.google.com
   - File → Import → Upload
   - Select your CSV
   - Import location: "Create new spreadsheet"
   - Click "Import data"

3. Rename sheet and tabs:
   - Sheet name: "Your Project Name"
   - Tab 1: "Current Week" or "Submissions"
   - Add tabs as needed (Archive, Summary, Export)

4. **Get Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_ID_HERE/edit
   ```

### Phase 3: Create Frontend (HTML/CSS/JS)

**File structure:**
```
your-form.html          ← Form interface
your-form.css           ← Styling
your-form.js            ← Client logic
```

**Key frontend patterns:**

**A. Form validation:**
```javascript
// Validate UCR email
if (!email.endsWith('@ucr.edu')) {
    showError('Please use your @ucr.edu email');
    return;
}
```

**B. Prevent double submission (CRITICAL!):**
```javascript
// Global flag
let isSubmitting = false;

async function submitForm() {
    // Check flag first
    if (isSubmitting) return;

    // Set flag and disable button IMMEDIATELY
    isSubmitting = true;
    submitBtn.disabled = true;

    try {
        // ... submit logic ...
    } catch (error) {
        // Re-enable on error
        isSubmitting = false;
        submitBtn.disabled = false;
    }
}
```

**C. Sending data to Apps Script:**
```javascript
const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',  // Required for Google Apps Script
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
});
```

### Phase 4: Create Backend (Google Apps Script)

1. Open your Google Sheet
2. **Extensions → Apps Script**
3. Create these functions:

**A. Configuration:**
```javascript
const SHEET_ID = 'YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Submissions';
const DUPLICATE_WINDOW_MINUTES = 2; // Prevent duplicates within 2 min
```

**B. Handle POST (submissions):**
```javascript
function doPost(e) {
  try {
    const formData = JSON.parse(e.postData.contents);
    return handleSubmission(formData);
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}
```

**C. Duplicate detection (CRITICAL!):**
```javascript
function isDuplicateSubmission(sheet, studentEmail) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;

  const now = new Date();
  const cutoffTime = new Date(now.getTime() - (DUPLICATE_WINDOW_MINUTES * 60 * 1000));

  // Check last 50 rows for recent submissions
  const recentRows = data.slice(-50);

  for (let i = recentRows.length - 1; i >= 0; i--) {
    const row = recentRows[i];
    const rowTimestamp = new Date(row[0]);
    const rowEmail = row[1];

    if (rowEmail === studentEmail && rowTimestamp > cutoffTime) {
      console.log(`Duplicate detected: ${studentEmail}`);
      return true;
    }

    if (rowTimestamp < cutoffTime) break;
  }

  return false;
}
```

**D. Save to sheet:**
```javascript
function handleSubmission(formData) {
  const sheet = SpreadsheetApp.openById(SHEET_ID)
                              .getSheetByName(SHEET_NAME);

  // Check for duplicates
  if (isDuplicateSubmission(sheet, formData.email)) {
    return createJsonResponse({
      success: true,  // Still show success to user
      message: 'Already submitted recently'
    });
  }

  // Append data
  const row = [
    new Date(),
    formData.email,
    formData.name,
    // ... other fields ...
  ];

  sheet.appendRow(row);

  return createJsonResponse({
    success: true,
    message: 'Submitted successfully'
  });
}
```

**E. Helper function:**
```javascript
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. **Deploy as Web App:**
   - Click "Deploy → New deployment"
   - Type: **Web app**
   - Execute as: **Me** (or "User accessing" for UCR auth)
   - Who has access: **Anyone** (or "Anyone in ucr.edu" for UCR auth)
   - Click "Deploy"
   - **Copy the Web App URL**

5. **Update frontend with URL:**
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
   ```

### Phase 5: Deploy to GitHub Pages

```bash
cd /Users/lucianocosme/Projects/ucr-lab-website
git add your-form.html your-form.css your-form.js
git commit -m "Add your form system"
git push
```

Your form will be live at:
```
https://cosmelab.github.io/cosme-lab-website/your-form.html
```

---

## Preventing Duplicate Submissions

**Why duplicates happen:**
- Double-clicking submit button
- Network hiccups causing retries
- Page refresh after submission
- Browser back button + resubmit

**Two-layer protection (BOTH required!):**

### Layer 1: Frontend Prevention
```javascript
let isSubmitting = false;

async function submitForm() {
    if (isSubmitting) return;  // ← Guard clause

    isSubmitting = true;        // ← Set flag immediately
    submitBtn.disabled = true;  // ← Disable button immediately

    try {
        await sendToBackend();
    } catch (error) {
        isSubmitting = false;    // ← Reset on error
        submitBtn.disabled = false;
    }
}
```

### Layer 2: Backend Detection
```javascript
function isDuplicateSubmission(sheet, email) {
    const recentRows = sheet.getDataRange().getValues().slice(-50);
    const cutoff = new Date(Date.now() - 2*60*1000); // 2 minutes

    for (let row of recentRows.reverse()) {
        if (row[1] === email && new Date(row[0]) > cutoff) {
            return true; // Duplicate found!
        }
    }
    return false;
}
```

**Result:** Even if frontend fails, backend catches duplicates.

---

## UCR SSO Authentication

**To require UCR NetID + Duo MFA:**

1. **Apps Script deployment settings:**
   - Execute as: **User accessing the web app**
   - Who has access: **Anyone in ucr.edu**

2. **How it works:**
   - User visits form → redirected to UCR login
   - Enters NetID + password
   - UCR automatically triggers Duo MFA
   - After approval → form loads
   - Email is pre-filled via `Session.getActiveUser().getEmail()`

3. **Get user email in Apps Script:**
```javascript
function getUserEmail() {
  const email = Session.getActiveUser().getEmail();
  // Returns: "student@ucr.edu"
  return email;
}
```

4. **Frontend gets email:**
```javascript
fetch(APPS_SCRIPT_URL + '?action=getUserEmail')
  .then(res => res.json())
  .then(data => {
    emailInput.value = data.email; // Pre-fill
  });
```

**No Duo configuration needed** - UCR IT handles it automatically!

---

## Common Patterns

### Pattern 1: Weekly Auto-Archive

**Trigger: Every Friday at 8 PM**

```javascript
function archiveWeeklyData() {
  const currentSheet = SpreadsheetApp.openById(SHEET_ID)
                                     .getSheetByName('Current Week');
  const archiveSheet = SpreadsheetApp.openById(SHEET_ID)
                                      .getSheetByName('Archive');

  // Copy all data to archive
  const data = currentSheet.getDataRange().getValues().slice(1); // Skip headers
  data.forEach(row => {
    archiveSheet.appendRow([new Date(), ...row]); // Add archive date
  });

  // Clear current week
  currentSheet.deleteRows(2, currentSheet.getLastRow() - 1);

  // Send notification
  MailApp.sendEmail({
    to: 'your@email.com',
    subject: 'Weekly Archive Complete',
    body: `Archived ${data.length} rows`
  });
}
```

**Set up trigger:**
- Apps Script → Triggers (clock icon)
- Function: `archiveWeeklyData`
- Event source: Time-driven
- Type: Week timer
- Day: Friday
- Time: 8pm to 9pm

### Pattern 2: CSV Export

```javascript
function exportToCSV() {
  const sheet = SpreadsheetApp.openById(SHEET_ID)
                               .getSheetByName('Submissions');
  const data = sheet.getDataRange().getValues();

  const csv = data.map(row => {
    return row.map(cell => {
      // Handle commas and quotes
      if (String(cell).includes(',') || String(cell).includes('"')) {
        return '"' + String(cell).replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',');
  }).join('\n');

  // Write to Export tab
  const exportSheet = SpreadsheetApp.openById(SHEET_ID)
                                     .getSheetByName('Export');
  exportSheet.clear();
  exportSheet.getRange(1, 1).setValue(csv);
}
```

### Pattern 3: Summary Statistics

```javascript
function updateSummary() {
  const dataSheet = SpreadsheetApp.openById(SHEET_ID)
                                   .getSheetByName('Submissions');
  const summarySheet = SpreadsheetApp.openById(SHEET_ID)
                                      .getSheetByName('Summary');

  const data = dataSheet.getDataRange().getValues().slice(1);

  // Group by student
  const stats = {};
  data.forEach(row => {
    const email = row[1];
    if (!stats[email]) {
      stats[email] = { name: row[2], count: 0, total: 0 };
    }
    stats[email].count++;
    stats[email].total += parseFloat(row[6]) || 0;
  });

  // Write summary
  summarySheet.clear();
  summarySheet.appendRow(['Name', 'Submissions', 'Total Hours', 'Average']);

  Object.values(stats).forEach(s => {
    summarySheet.appendRow([
      s.name,
      s.count,
      s.total.toFixed(2),
      (s.total / s.count).toFixed(2)
    ]);
  });
}
```

---

## Troubleshooting

### Issue: "No data appearing in sheet"

**Check:**
1. Apps Script logs: View → Logs
2. Sheet tab name matches exactly (case-sensitive!)
3. Column headers match your code
4. Deployment settings correct

### Issue: "Duplicates still appearing"

**Check:**
1. Frontend `isSubmitting` flag present?
2. Button disabled immediately?
3. Backend `isDuplicateSubmission()` being called?
4. Check Apps Script logs for "Duplicate detected"

### Issue: "UCR login not working"

**Check:**
1. Deployment: "Execute as: User accessing"
2. Deployment: "Who has access: Anyone in ucr.edu"
3. Try in incognito mode
4. Contact UCR IT if Duo not triggering

### Issue: "Form submitted but says error"

**Remember:** With `mode: 'no-cors'`, fetch won't return response.
```javascript
// You won't get actual response with no-cors
// So assume success and show message
messageDiv.textContent = 'Submitted!';
```

---

## Quick Reference

### Deployment Checklist

- [ ] CSV headers created
- [ ] Google Sheet created with correct tabs
- [ ] Apps Script code added
- [ ] `SHEET_ID` updated in Apps Script
- [ ] Apps Script deployed as web app
- [ ] Web App URL copied
- [ ] Frontend URL updated
- [ ] Duplicate prevention added (frontend + backend)
- [ ] Pushed to GitHub
- [ ] Tested submission
- [ ] Checked Google Sheet for data
- [ ] Set up triggers (if needed)

### File Naming Convention

```
project-name.html       ← Main form
project-name.css        ← Styles
project-name.js         ← Logic
project-name.csv        ← Headers (for Google Sheet)
project-name-setup.md   ← Setup guide
```

### Apps Script Template

See `/Users/lucianocosme/Projects/ucr-lab-website/polls/lab-availability/` for complete working example.

---

## Next Steps

1. **Use this guide** for all future forms/polls
2. **Save common patterns** to reuse
3. **Document project-specific** details in separate READMEs
4. **Test thoroughly** before deploying to students

## Examples in This Repo

- **Lab Availability Poll**: `polls/lab-availability/`
- **Mentoring Survey**: `polls/mentoring-preferences/`
- **Daily Lab Log**: `daily-lab-log.*` (with UCR auth)

---

**Questions?** Reference this guide or check existing examples.
