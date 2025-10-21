# Deployment Checklist - Student Dashboard System

Quick checklist for deploying the student dashboard "My Lab Logs" system.

## Pre-Deployment Checklist

- [ ] All files created and saved locally
- [ ] Python local server tested successfully
- [ ] Daily Lab Log form tested on phone
- [ ] Dashboard design approved

## Files to Deploy

### Frontend Files (GitHub Pages)
- [ ] `my-lab-logs.html`
- [ ] `my-lab-logs.css`
- [ ] `my-lab-logs.js`
- [ ] `daily-lab-log.html` (updated with "View My Logs" button)
- [ ] `daily-lab-log.css` (updated with cyan textarea, Dracula time pickers)
- [ ] `team.html` (updated with "My Lab Logs" button)
- [ ] `STUDENT-DASHBOARD-README.md`
- [ ] `DEPLOYMENT-CHECKLIST.md`

### Backend File (Google Apps Script)
- [ ] `daily-lab-log-apps-script.js` (includes new `getMyLogsResponse()`)

## Step-by-Step Deployment

### 1. Update Google Apps Script Backend

**Location:** Google Sheet → Extensions → Apps Script

**Tasks:**
1. [ ] Open Apps Script editor
2. [ ] Delete ALL existing code
3. [ ] Copy contents of `daily-lab-log-apps-script.js`
4. [ ] Paste into Apps Script editor
5. [ ] **Save** (Ctrl+S / Cmd+S)
6. [ ] Verify no syntax errors (check bottom status bar)

**Deploy Web App:**
1. [ ] Click **Deploy → New deployment**
2. [ ] Type: Select **Web app**
3. [ ] Description: "Daily Lab Log + Dashboard v2"
4. [ ] Execute as: **User accessing the web app** ⚠️ CRITICAL
5. [ ] Who has access: **Anyone in ucr.edu** ⚠️ CRITICAL
6. [ ] Click **Deploy**
7. [ ] Click **Authorize access** (if prompted)
8. [ ] **COPY THE WEB APP URL**
9. [ ] Save URL somewhere safe

**Example URL format:**
```
https://script.google.com/macros/s/AKfycbx.../exec
```

### 2. Verify Web App URL in Files

**Files that need the URL:**
- [ ] `daily-lab-log.js` (line 5) - Should already have it
- [ ] `my-lab-logs.js` (line 6) - Should already have it

**Both should show:**
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

⚠️ If URLs don't match your deployment, update them now!

### 3. Git Commit and Push

**In terminal:**

```bash
cd /Users/lucianocosme/Projects/ucr-lab-website

# Check what's changed
git status

# Add new dashboard files
git add my-lab-logs.html my-lab-logs.css my-lab-logs.js

# Add updated files
git add daily-lab-log.html daily-lab-log.css daily-lab-log-apps-script.js team.html

# Add documentation
git add STUDENT-DASHBOARD-README.md DEPLOYMENT-CHECKLIST.md

# Commit
git commit -m "Add student dashboard system with personal log tracking"

# Push to GitHub
git push
```

**Wait 2-5 minutes for GitHub Pages to rebuild.**

### 4. Test Daily Lab Log

**Test URL:** `https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html`

**Test Steps:**
1. [ ] Visit URL
2. [ ] Should redirect to UCR SSO login
3. [ ] Enter NetID + password
4. [ ] Duo MFA should trigger automatically
5. [ ] After approval, form should load
6. [ ] Email field should be pre-filled with your @ucr.edu email
7. [ ] Fill out form completely
8. [ ] Submit
9. [ ] Success message appears
10. [ ] **"View My Logs" button appears**

**What to check:**
- [ ] White background is gone (dark Dracula theme)
- [ ] Label says "Name" (not "Full Name")
- [ ] Typing in textarea shows cyan text
- [ ] Time picker dropdown has purple highlights (not blue)
- [ ] Button icons rotate on hover

### 5. Test Student Dashboard

**Test URL:** `https://cosmelab.github.io/cosme-lab-website/my-lab-logs.html`

**Test Steps:**
1. [ ] Click "View My Logs" from success page (or visit URL directly)
2. [ ] UCR SSO login (if not already logged in)
3. [ ] Dashboard loads with your email displayed
4. [ ] Stats cards show correct numbers:
   - [ ] Total hours
   - [ ] Total sessions
   - [ ] Average hours
   - [ ] Last visit date
5. [ ] Project breakdown shows your projects
6. [ ] Table shows your recent logs (last 20)
7. [ ] Hover effects work on cards and table rows
8. [ ] "Submit New Log" button works
9. [ ] "Refresh Data" button reloads data

**What to check:**
- [ ] Only YOUR data appears (privacy check)
- [ ] Hours calculations are correct
- [ ] Projects are grouped correctly
- [ ] Table is sorted by date (newest first)
- [ ] Dracula theme colors throughout
- [ ] Button animations work (rotating icons)
- [ ] Mobile responsive (test on phone)

### 6. Test Team Page

**Test URL:** `https://cosmelab.github.io/cosme-lab-website/team.html`

**Test Steps:**
1. [ ] Visit Team page
2. [ ] Scroll to "Lab Resources" section
3. [ ] Verify 4 buttons present:
   - [ ] Weekly Availability
   - [ ] Lab Schedule
   - [ ] Daily Lab Log
   - [ ] **My Lab Logs** (new!)
4. [ ] Click "My Lab Logs" button
5. [ ] Should navigate to dashboard
6. [ ] UCR login if needed

### 7. Privacy & Security Test

**IMPORTANT:** Test with multiple students!

**Student A:**
1. [ ] Student A logs in
2. [ ] Submits 2-3 log entries
3. [ ] Views dashboard
4. [ ] Notes their total hours (e.g., 7.5h)

**Student B:**
1. [ ] Student B logs in (different UCR account)
2. [ ] Submits 1-2 log entries
3. [ ] Views dashboard
4. [ ] **CRITICAL**: Should see ONLY Student B's data
5. [ ] Should NOT see Student A's entries

**Expected:**
- [ ] Student A sees only their data
- [ ] Student B sees only their data
- [ ] No cross-contamination

### 8. Apps Script Logs Check

**If something doesn't work:**

1. [ ] Open Google Sheet
2. [ ] Extensions → Apps Script
3. [ ] View → Logs
4. [ ] Check for errors in logs
5. [ ] Look for "getMyLogsResponse" entries

**Common log entries:**
```
getMyLogsResponse called
User email: student@ucr.edu
Found X logs for user
```

## Post-Deployment

### Documentation Updates

- [ ] Update main README with link to student dashboard
- [ ] Add dashboard to lab onboarding docs
- [ ] Update student handbook with "My Lab Logs" instructions

### Student Onboarding

**Send email to students:**

```
Subject: New Feature - Track Your Lab Hours!

Hi everyone,

We've added a new personalized dashboard where you can track your lab work:

🔗 My Lab Logs: https://cosmelab.github.io/cosme-lab-website/my-lab-logs.html

Features:
- See your total hours worked
- View project breakdown
- Access your complete log history

You can also find it on the Team page → Lab Resources.

Continue submitting your daily logs as usual - your dashboard updates automatically!

Luciano
```

### Monitor First Week

- [ ] Day 1: Check for submission issues
- [ ] Day 3: Verify stats are calculating correctly
- [ ] Day 7: Check that all students can access their data
- [ ] Review Apps Script logs for errors

## Rollback Plan (If Needed)

**If critical bugs found:**

1. [ ] Revert GitHub changes:
   ```bash
   git revert HEAD
   git push
   ```

2. [ ] Restore old Apps Script version:
   - Open Google Sheet → Extensions → Apps Script
   - File → Version history
   - Restore previous version

3. [ ] Notify students via email

## Success Criteria

✅ All students can log in with UCR SSO
✅ Daily log submissions work correctly
✅ Dashboard shows accurate personal stats
✅ Privacy verified (no cross-student data)
✅ Mobile experience is smooth
✅ No errors in Apps Script logs
✅ Button animations work across all pages
✅ Dracula theme consistent everywhere

## Contact for Issues

- **Technical Issues**: Check Apps Script logs, browser console
- **UCR SSO Issues**: Contact UCR IT
- **Questions**: lcosme@ucr.edu

---

**Deployment Date:** ___________
**Deployed By:** ___________
**Students Notified:** ___________
**All Tests Passed:** ☐ Yes ☐ No (explain below)

**Notes:**
```




```
