# Phase 1 Deployment - YOUR TO-DO LIST

**System:** Student Registration + File Upload
**Status:** Waiting for JavaScript implementation
**Date:** October 21, 2025

---

## YOUR TASKS (What You Need to Do)

### TASK 1: Create Google Sheet (15 min) ⏳

**Go to:** https://sheets.google.com

1. Click "Blank" spreadsheet
2. Name it: `Cosme Lab - Daily Logs`
3. Create 6 tabs:
   - Rename "Sheet1" → `Students`
   - Add tab → `Submissions`
   - Add tab → `Files`
   - Add tab → `Projects`
   - Add tab → `Summary`
   - Add tab → `Export`

### TASK 2: Import CSV Data (10 min) ⏳

**CSV Location:** `/Users/lucianocosme/My Drive/undergrads/Cosme_Lab_Online_Notebook/1_CSV_Templates/`

**For each tab:**

**Students tab:**
1. File → Import → Upload
2. Choose: `students.csv`
3. Import location: "Replace current sheet"
4. Separator: "Comma"
5. Should show: 9 students (Matthew, Bryan, Dylan, Laksh, Sanjana, Aleja, Paulo, Praneeth, Aryo)

**Submissions tab:**
1. Import: `daily_log_submissions.csv`
2. Should show: Header row only (no data)

**Files tab:**
1. Import: `files.csv`
2. Should show: Header row only (no data)

**Projects tab:**
1. Import: `projects.csv`
2. Should show: 5 projects (Mosquito Genomics, Mealworm Farming, General Lab, Meeting, Other)

**Summary & Export tabs:**
- Leave empty

### TASK 3: Get Sheet ID (2 min) ⏳

1. While viewing your sheet, look at the URL
2. Copy the ID from: `https://docs.google.com/spreadsheets/d/[COPY_THIS_PART]/edit`

**Example:**
- URL: `https://docs.google.com/spreadsheets/d/1a2B3c4D5e6F7g8H9i0J/edit`
- ID: `1a2B3c4D5e6F7g8H9i0J`

**Save this ID** - you'll need it for Step 5

### TASK 4: WAIT FOR ME ⏳

**I need to create these files:**
1. `daily-lab-log.js` (updated)
2. `daily-lab-log-apps-script.js` (new)

**Status:** NOT READY YET

**You cannot continue until I finish these files.**

### TASK 5: Deploy Apps Script (10 min) ⏳

**After I provide the files:**

1. Go to: https://script.google.com
2. Click "New Project"
3. Name it: `Cosme Lab - Daily Log Backend`
4. Delete the default code
5. Copy ALL code from `daily-lab-log-apps-script.js` (I'll provide this)
6. Paste into editor
7. **FIND THIS LINE:** `const SHEET_ID = 'YOUR_SHEET_ID_HERE';`
8. **REPLACE** with your Sheet ID from Task 3
9. Save (Cmd+S)
10. Click "Deploy" → "New deployment"
11. Type: **Web app**
12. Execute as: **User accessing the web app**
13. Who has access: **Anyone at ucr.edu**
14. Click "Deploy"
15. **COPY THE WEB APP URL**
16. Looks like: `https://script.google.com/macros/s/AKfycbx.../exec`

**Save this URL** - you'll need it for Task 6

### TASK 6: Add Apps Script URL to Frontend (2 min) ⏳

1. Open: `/Users/lucianocosme/Projects/ucr-lab-website/daily-lab-log.js`
2. Find line 5 (approximately): `const APPS_SCRIPT_URL = '...';`
3. Replace with the URL from Task 5
4. Save file

### TASK 7: Git Push (1 min) ⏳

**In terminal:**

```bash
cd /Users/lucianocosme/Projects/ucr-lab-website

git add daily-lab-log.js daily-lab-log-apps-script.js
git commit -m "Add Phase 1 backend implementation"
git push
```

Wait 2-5 minutes for GitHub Pages to update.

### TASK 8: Test System (10 min) ⏳

**Test URL:** https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html

1. Visit URL
2. UCR SSO login (NetID + Duo)
3. Fill form:
   - NetID: `lcosme`
   - First Name: Test
   - Last Name: User
   - Select 2 projects
   - Upload 2 small files
4. Submit

**Check these:**
- [ ] Success message appears
- [ ] Check Google Sheet "Students" tab → new row for lcosme
- [ ] Check "Submissions" tab → new log entry
- [ ] Check "Files" tab → 2 file entries
- [ ] Check Google Drive: `/My Drive/undergrads/Cosme_Lab_Online_Notebook/3_Student_Files/lcosme/2025-10/`
- [ ] Files should be there

### TASK 9: Email Students (5 min) ⏳

**Send to all 9 students:**

```
Subject: New Daily Lab Log System

Hi everyone,

Please start using the new lab log system to track your hours:

🔗 Daily Lab Log: https://cosmelab.github.io/cosme-lab-website/daily-lab-log.html

How to use:
1. Fill out BEFORE leaving lab each day
2. Enter your NetID (e.g., "mshan023" not "mshan023@ucr.edu")
3. Select all projects you worked on
4. Upload files if needed (gel images, data, etc.)

Your files will be saved to Google Drive automatically.

Questions? Reply to this email.

Luciano
```

---

## WHAT I NEED TO DO

### My Task 1: Update daily-lab-log.js ⏳

**File:** `/Users/lucianocosme/Projects/ucr-lab-website/daily-lab-log.js`

**Changes needed:**
- NetID input validation (lowercase only)
- Get multiple selected projects from checkboxes
- File upload handling:
  - Show file list
  - Allow removing files
  - Validate 10MB limit per file
- Convert files to base64
- Update form submission data structure

**Time:** 30 minutes

### My Task 2: Create daily-lab-log-apps-script.js ⏳

**File:** `/Users/lucianocosme/Projects/ucr-lab-website/daily-lab-log-apps-script.js`

**Features:**
- Auto-registration system:
  - Check if NetID exists in Students sheet
  - Create new student record if not found
  - Create Google Drive folder structure
  - Share folder with student@ucr.edu
- File upload handling:
  - Decode base64 files
  - Save to Drive in student's folder
  - Create month subfolder (2025-10)
  - Log in Files sheet
- Updated submission logging:
  - Handle multiple projects (pipe-separated)
  - Track file uploads (has_files, file_count)

**Time:** 45 minutes

---

## TIMELINE

**Now:**
- You: Do Tasks 1-3 (create Sheet, import CSVs, get ID) - **27 min**

**Then:**
- Me: Do My Tasks 1-2 (update JavaScript) - **75 min**

**After I'm done:**
- You: Do Tasks 5-9 (deploy, test, email) - **28 min**

**Total time for you:** ~55 minutes
**Total time for me:** ~75 minutes

---

## FILES REFERENCE

### Google Drive Files (Already Created)
- `students.csv` → 9 students
- `daily_log_submissions.csv` → Empty
- `files.csv` → Empty
- `projects.csv` → 5 projects

**Location:** `/Users/lucianocosme/My Drive/undergrads/Cosme_Lab_Online_Notebook/1_CSV_Templates/`

### Website Files (Already Updated)
- `daily-lab-log.html` → Form with NetID, checkboxes, file upload
- `daily-lab-log.css` → Styling for new elements
- `team.html` → Updated with new volunteers

**Location:** `/Users/lucianocosme/Projects/ucr-lab-website/`

### JavaScript Files (Need Updating)
- `daily-lab-log.js` → Frontend logic (NOT READY)
- `daily-lab-log-apps-script.js` → Backend API (NOT READY)

---

## QUESTIONS?

**Q: Can I start deploying now?**
A: No, wait for me to update JavaScript files first.

**Q: What if I create the Sheet now?**
A: Yes! Do Tasks 1-3 now. Then wait for me to finish.

**Q: How long until it's ready?**
A: ~75 minutes for me to update JavaScript, then ~28 min for you to deploy.

**Q: Will the current website break?**
A: No, form won't work yet but website is fine.

---

## READY TO START?

**Do you want me to:**
- [ ] Start updating JavaScript files now?
- [ ] Wait until you create the Google Sheet first?

Let me know and I'll get started!
