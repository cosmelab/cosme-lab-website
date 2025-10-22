# Lab Tools Migration Summary

**Date:** October 21, 2025
**Purpose:** Document all lab tools before moving to separate repository
**New Repo:** `cosme-lab-tools` (to be created)

---

## WHAT WE'VE BUILT

### 1. Daily Lab Log System ✅ (HTML/CSS Complete, JS Pending)

**Files:**
- `daily-lab-log.html` - Form for logging daily hours + file uploads
- `daily-lab-log.css` - Dracula-themed styling
- `daily-lab-log.js` - Frontend logic (NEEDS UPDATE for Phase 1)
- `daily-lab-log-apps-script.js` - Backend API (TO BE CREATED)

**Features:**
- ✅ NetID-based login (UCR SSO)
- ✅ First/Last name input
- ✅ Date + Time In/Out (with helpers for "today" and "current time")
- ✅ Project selection (multiple checkboxes)
- ✅ Accomplishments textarea
- ✅ File upload (multiple files, styled input)
- ⏳ Hours optional (can submit without time)
- ⏳ NetID whitelist (access control)
- ⏳ File validation (10MB limit, specific formats)
- ⏳ Auto-registration (creates team member + Drive folder)

**Phase 1 Updates Needed:**
1. Change "Student Information" → "Team Member Information"
2. Make time fields optional
3. Add structured fields (experiment type, samples, equipment)
4. Increase textarea from rows="6" to rows="10"
5. Add character counter (0/2000)
6. Add upload warning near file input
7. Implement NetID whitelist
8. Implement file validation
9. Implement registration system
10. Implement file upload to Drive

### 2. Student Dashboard (My Lab Logs) ✅ COMPLETE

**Files:**
- `my-lab-logs.html` - Personal dashboard
- `my-lab-logs.css` - Dashboard styling
- `my-lab-logs.js` - Frontend logic

**Features:**
- ✅ Shows only logged-in user's data (privacy)
- ✅ Stats cards (total hours, sessions, average, last visit)
- ✅ Project breakdown (hours per project)
- ✅ Recent logs table (last 20 entries)
- ✅ "Submit New Log" and "Refresh Data" buttons
- ✅ Dracula theme with hover effects

**Apps Script Endpoint:**
- ✅ `getMyLogsResponse()` - Filters logs by user email

### 3. Lab Availability Poll ✅ COMPLETE

**Location:** `polls/lab-availability/`
**Files:**
- `availability_poll.html`
- `availability_poll.css`
- `availability_poll.js`
- `availability_poll_apps_script.js`

**Features:**
- ✅ Weekly schedule selection
- ✅ UCR SSO authentication
- ✅ Duplicate prevention (frontend + backend)
- ✅ Results page with visualization
- ✅ Archive system (Fridays at 8 PM)

**Phase 1 Update Needed:**
- ⏳ Add NetID whitelist

### 4. Lab Schedule Viewer ✅ COMPLETE (Basic)

**File:** `lab-schedule.html`

**Phase 1 Updates Needed:**
- ⏳ Create public view (generic "Lab occupied")
- ⏳ Create private view (detailed, who's working on what)
- ⏳ Add NetID whitelist for private view
- ⏳ Auto-populate from daily logs
- ⏳ Show file thumbnails in tooltips (logged-in only)

### 5. Team Page Updates ✅ COMPLETE

**File:** `team.html`

**Changes Made:**
- ✅ Fixed name: "Ajeja" → "Aleja" Anderson
- ✅ Added Paulo Padilla (Undergraduate Volunteer)
- ✅ Added Praneeth Kandukuri (Undergraduate Volunteer)
- ✅ Added Aryo Chakma (Undergraduate Volunteer)
- ✅ All volunteers use 🦟 mosquito emoji only
- ✅ Lab Resources section with 4 buttons:
  - Weekly Availability
  - Lab Schedule
  - Daily Lab Log
  - My Lab Logs

---

## GOOGLE DRIVE STRUCTURE ✅ COMPLETE

**Location:** `/Users/lucianocosme/My Drive/undergrads/Cosme_Lab_Online_Notebook/`

**Directory Structure:**
```
Cosme_Lab_Online_Notebook/
├── 1_CSV_Templates/
│   ├── team.csv ✅ (11 members: Luciano, Andre, 9 undergrads)
│   ├── daily_log_submissions.csv ✅ (headers only)
│   ├── files.csv ✅ (headers only)
│   ├── projects.csv ✅ (5 projects)
│   ├── student-data-to-verify.md (can delete)
│   └── verified-student-roster.md (can delete)
├── 2_Google_Sheets/
│   └── (User will create "Cosme Lab - Daily Logs")
├── 3_Student_Files/ (rename to 3_Team_Files/)
│   └── (Auto-created per member: lcosme/, andrelut/, mshan023/, etc.)
├── 4_Reports/
│   ├── weekly/
│   └── monthly/
├── 5_Archives/
│   └── (Weekly compression originals)
└── 6_Documentation/
    ├── google-drive-structure.md
    ├── student-roster-setup-complete.md
    └── phase-1-strategy.md (move to new repo)
```

---

## DATABASE FILES ✅ COMPLETE

### team.csv (11 members)
```csv
netid,first_name,last_name,email,registration_date,drive_folder_id,role
lcosme,Luciano,Cosme,lcosme@ucr.edu,,,PI
andrelut,Andre,Torres,andrelut@ucr.edu,,,Project Scientist
mshan023,Matthew,Shan,mshan023@ucr.edu,,,Undergraduate Researcher
bnguy358,Bryan,Nguyen,bnguy358@ucr.edu,,,Undergraduate Researcher
dylan.moc,Dylan,Moc,dylan.moc@ucr.edu,,,Undergraduate Researcher
latha001,Laksh,Athappan,latha001@ucr.edu,,,Undergraduate Researcher
srao040,Sanjana,Rao,srao040@ucr.edu,,,Undergraduate Researcher
aande092,Aleja,Anderson,aande092@ucr.edu,,,Undergraduate Researcher
pkand011,Praneeth,Kandukuri,pkand011@ucr.edu,,,Undergraduate Volunteer
ppadi009,Paulo,Padilla,ppadi009@ucr.edu,,,Undergraduate Volunteer
achak034,Aryo,Chakma,achak034@ucr.edu,,,Undergraduate Volunteer
```

### daily_log_submissions.csv (headers)
```csv
timestamp,netid,first_name,last_name,email,date,time_in,time_out,hours_worked,projects,accomplishments,has_files,file_count
```

**Phase 1 Addition:**
```csv
...,accomplishments,experiment_type,samples_count,equipment_used,has_files,file_count
```

### files.csv (headers)
```csv
upload_id,netid,log_date,file_name,file_type,file_size_mb,file_url,upload_timestamp
```

### projects.csv (5 projects)
```csv
project_id,project_name,description,is_active
1,Mosquito Genomics,Population genomics and insecticide resistance,TRUE
2,Mealworm Farming,Vertical farming system development,TRUE
3,General Lab,Lab maintenance and organization,TRUE
4,Meeting/Training,Lab meetings and training sessions,TRUE
5,Other,Other lab activities,TRUE
```

---

## NETID WHITELIST (Access Control)

**11 Members:**
```javascript
const ALLOWED_NETIDS = [
  // Staff
  'lcosme',      // Luciano Cosme (PI)
  'andrelut',    // Andre Torres (Project Scientist)

  // Paid Undergraduate Researchers
  'mshan023',    // Matthew Shan
  'bnguy358',    // Bryan Nguyen
  'dylan.moc',   // Dylan Moc
  'latha001',    // Laksh Athappan
  'srao040',     // Sanjana Rao
  'aande092',    // Aleja Anderson

  // Undergraduate Volunteers
  'pkand011',    // Praneeth Kandukuri
  'ppadi009',    // Paulo Padilla
  'achak034'     // Aryo Chakma
];
```

**Applied to:**
1. Daily Lab Log
2. My Lab Logs (dashboard)
3. Availability Poll
4. Lab Schedule (private view)

---

## FILE UPLOAD STRATEGY

### Allowed Formats & Limits
```
✅ Images: .png, .jpg, .jpeg (max 10MB each)
✅ Data: .csv, .xlsx, .xls, .txt (max 10MB each)
✅ Documents: .pdf (max 10MB only)
❌ NO: Large PDFs, videos, raw files
```

### Weekly Compression (To Be Created)
**Script:** Python (run locally every Sunday)
**Process:**
1. Convert PNG/JPG → WebP (26-50% smaller)
2. Compress PDFs >2MB (42% reduction)
3. Archive originals to `/5_Archives/YYYY-MM-DD/`
4. Update files.csv with new paths

### Upload Warning Text
```
⚠️ Images automatically compressed weekly to WebP format
💾 Max 10MB per file | Originals archived
📁 Allowed: PNG, JPG, CSV, XLSX, TXT, PDF
```

---

## PHASE 1 STRUCTURED FIELDS (Option A)

**Add to daily-lab-log.html:**

### 1. Experiment Type (optional dropdown)
```html
<select id="experiment-type">
  <option value="">Select type (optional)</option>
  <option value="DNA Extraction">DNA Extraction</option>
  <option value="PCR">PCR</option>
  <option value="Gel Electrophoresis">Gel Electrophoresis</option>
  <option value="Sequencing Prep">Sequencing Prep</option>
  <option value="Colony Maintenance">Colony Maintenance</option>
  <option value="Data Analysis">Data Analysis</option>
  <option value="Lab Maintenance">Lab Maintenance</option>
  <option value="Meeting">Meeting</option>
  <option value="Other">Other</option>
</select>
```

### 2. Samples Count (optional number)
```html
<input type="number" id="samples-count" min="0" placeholder="e.g., 24">
<span class="form-hint">Number of samples processed</span>
```

### 3. Equipment Used (optional checkboxes)
```html
<div class="checkbox-group">
  <label class="checkbox-label">
    <input type="checkbox" name="equipment" value="PCR Machine">
    <span>PCR Machine</span>
  </label>
  <label class="checkbox-label">
    <input type="checkbox" name="equipment" value="Microscope">
    <span>Microscope</span>
  </label>
  <label class="checkbox-label">
    <input type="checkbox" name="equipment" value="Centrifuge">
    <span>Centrifuge</span>
  </label>
  <label class="checkbox-label">
    <input type="checkbox" name="equipment" value="Incubator">
    <span>Incubator</span>
  </label>
  <label class="checkbox-label">
    <input type="checkbox" name="equipment" value="Other">
    <span>Other</span>
  </label>
</div>
```

### 4. Detailed Notes (increased size)
```html
<textarea
  id="accomplishments"
  rows="10"
  maxlength="2000"
  required
></textarea>
<div style="display: flex; justify-content: space-between;">
  <span class="form-hint">Be specific! Used for reports and progress tracking.</span>
  <span id="char-count" style="color: var(--purple);">0 / 2000</span>
</div>
```

---

## REPORT GENERATION FUNCTIONS (To Be Created)

**Apps Script Functions:**

```javascript
// 1. Weekly Hours by Person
function getWeeklyHoursReport(startDate, endDate) {
  // Returns: { lcosme: 15h, mshan023: 20h, ... }
}

// 2. Project Breakdown
function getProjectHoursReport(startDate, endDate) {
  // Returns: { "Mosquito Genomics": 45h, "Mealworm": 23h, ... }
}

// 3. Equipment Usage
function getEquipmentUsageReport(startDate, endDate) {
  // Returns: { "PCR Machine": 15 uses, "Microscope": 8 uses, ... }
}

// 4. Experiment Statistics
function getExperimentStatsReport(startDate, endDate) {
  // Returns: { "DNA Extraction": 12 times, samples: 240, ... }
}

// 5. Individual Progress
function getIndividualReport(netid, startDate, endDate) {
  // Returns: hours, projects, experiments, samples processed
}

// 6. Grant Deliverables
function getGrantReport(projectName, startDate, endDate) {
  // Returns: hours, team members, accomplishments, files
}

// 7. Monthly Lab Activity
function getMonthlyActivity(year, month) {
  // Returns: total hours, active members, experiment types
}
```

---

## DEPLOYMENT STEPS (Not Done Yet)

### Step 1: Create Google Sheet
1. Go to: https://sheets.google.com
2. Create: "Cosme Lab - Daily Logs"
3. Create 6 tabs: Team, Submissions, Files, Projects, Summary, Export
4. Import CSVs from Drive

### Step 2: Deploy Apps Script
1. Open Sheet → Extensions → Apps Script
2. Paste code
3. Update SHEET_ID
4. Deploy as Web App (User accessing, Anyone at ucr.edu)
5. Copy Web App URL

### Step 3: Update Frontend
1. Add Web App URL to daily-lab-log.js
2. Update my-lab-logs.js URL
3. Push to GitHub Pages

### Step 4: Test
1. Submit log with hours + files
2. Submit log without hours (files only)
3. Submit multiple entries same day
4. Test with different NetIDs
5. Verify access control

---

## MIGRATION PLAN

### Phase 1: Create New Repo
```bash
# On GitHub
1. Create new repo: cosme-lab-tools
2. Settings → Pages → Enable (main branch, /root)
3. Clone locally

# Move files
cd /Users/lucianocosme/Projects/
git clone https://github.com/cosmelab/cosme-lab-tools.git
cd cosme-lab-tools

# Copy lab tool files from cosme-lab-website
cp ../ucr-lab-website/daily-lab-log.* .
cp ../ucr-lab-website/my-lab-logs.* .
cp -r ../ucr-lab-website/polls/ .
cp ../ucr-lab-website/lab-schedule.* .
cp ../ucr-lab-website/PHASE-1-*.md .
cp ../ucr-lab-website/DEPLOYMENT-CHECKLIST.md .

# Create directory structure
mkdir css js docs scripts
mv *.css css/
mv *.js js/
mv *.md docs/

# Initial commit
git add .
git commit -m "Initial commit: Lab tools migration from main website"
git push
```

### Phase 2: Update Main Website
```bash
cd /Users/lucianocosme/Projects/ucr-lab-website

# Remove lab tools (keep backups first!)
git rm daily-lab-log.*
git rm my-lab-logs.*
git rm -r polls/
git rm lab-schedule.*
git rm PHASE-1-*.md
git rm DEPLOYMENT-CHECKLIST.md

# Update team.html links
# Change: href="daily-lab-log.html"
# To: href="https://cosmelab.github.io/cosme-lab-tools/daily-log"

git commit -m "Remove lab tools, add links to cosme-lab-tools repo"
git push
```

### Phase 3: Continue Development in New Repo
- New chat session in new repo directory
- Implement Phase 1 updates
- Deploy and test
- Document in new repo README

---

## FILES TO MOVE

### HTML
- daily-lab-log.html
- my-lab-logs.html
- lab-schedule.html
- polls/lab-availability/availability_poll.html
- polls/lab-availability/results.html

### CSS
- daily-lab-log.css
- my-lab-logs.css
- lab-schedule.css (if exists)
- polls/lab-availability/availability_poll.css

### JavaScript
- daily-lab-log.js
- my-lab-logs.js
- lab-schedule.js (if exists)
- polls/lab-availability/availability_poll.js

### Apps Script
- daily-lab-log-apps-script.js (to be created)
- polls/lab-availability/availability_poll_apps_script.js

### Documentation
- PHASE-1-STRATEGY.md
- PHASE-1-TODO.md
- DEPLOYMENT-CHECKLIST.md
- LAB-TOOLS-MIGRATION-SUMMARY.md (this file)

### Keep Shared
- css/main.css (navigation, shared styles)
- js/main.js (shared utilities)
- css/components/visitor-widget.css
- js/visitor-counter.js

---

## SHARED DEPENDENCIES

**Both repos will need:**
- Font Awesome (link in HTML)
- Dracula theme CSS variables
- Main navigation (copy to new repo, simplify)

**New repo should have:**
- Minimal navigation (just lab tools, no research/publications)
- Login status indicator
- "Back to Main Site" link

---

## NEXT SESSION STARTING POINT

**When you create new repo, start chat with:**

```
I have a new repo for lab tools: cosme-lab-tools

Here's what we need to do:
1. Implement Phase 1 updates (from PHASE-1-STRATEGY.md)
2. Add structured fields (experiment type, samples, equipment)
3. Update JavaScript with NetID whitelist
4. Create Apps Script backend
5. Deploy and test

The team.csv has 11 members (Luciano, Andre, 9 undergrads).
All strategy is documented in PHASE-1-STRATEGY.md.

Let's start with updating daily-lab-log.html.
```

---

## REMAINING WORK (To Do in New Repo)

### High Priority
1. ⏳ Update daily-lab-log.html (structured fields)
2. ⏳ Update daily-lab-log.css (new field styling)
3. ⏳ Update daily-lab-log.js (validation, NetID, files)
4. ⏳ Create daily-lab-log-apps-script.js (registration, upload)
5. ⏳ Deploy to Google Apps Script
6. ⏳ Deploy to GitHub Pages
7. ⏳ Test with all team members

### Medium Priority
8. ⏳ Add NetID whitelist to availability poll
9. ⏳ Create public/private lab schedule views
10. ⏳ Create weekly compression script (Python)
11. ⏳ Create report generation functions

### Low Priority
12. ⏳ Calendar integration
13. ⏳ Email notifications
14. ⏳ Mobile PWA
15. ⏳ Course platform template

---

## SUCCESS CRITERIA

✅ Team page updated with all 11 members
✅ team.csv created with roles
✅ Google Drive structure organized
✅ File upload strategy documented
✅ Phase 1 strategy finalized
✅ Migration plan created

⏳ New repo created
⏳ Lab tools deployed in new repo
⏳ Main website links to lab tools
⏳ All 11 members can access system
⏳ File uploads working
⏳ Reports generating correctly

---

## CONTACT & ACCESS

**Google Drive:** `/Users/lucianocosme/My Drive/undergrads/Cosme_Lab_Online_Notebook/`
**Main Website:** https://github.com/cosmelab/cosme-lab-website
**New Repo:** https://github.com/cosmelab/cosme-lab-tools (to be created)
**Admin:** lcosme@ucr.edu

---

**Status:** Ready for migration
**Last Updated:** October 21, 2025
