# Phase 1 Strategy - Daily Lab Log System

**Date:** October 21, 2025
**Status:** Implementation Ready
**Team Size:** 11 members (2 staff + 9 undergrads)

---

## CORE CHANGES FROM ORIGINAL PLAN

### 1. Terminology Update
- ❌ "Student Information" → ✅ "Team Member Information"
- ❌ students.csv → ✅ team.csv (with role field)
- **Why:** System used by everyone (PI, staff, undergrads)

### 2. Team Roster
**11 Total Members:**
- **Staff (2):** Luciano Cosme (PI), Andre Torres (Project Scientist)
- **Paid Undergrads (6):** Matthew, Bryan, Dylan, Laksh, Sanjana, Aleja
- **Volunteers (3):** Praneeth, Paulo, Aryo

**NetID Whitelist:**
```javascript
const ALLOWED_NETIDS = [
  'lcosme', 'andrelut', // Staff
  'mshan023', 'bnguy358', 'dylan.moc', 'latha001',
  'srao040', 'aande092', // Paid undergrads
  'pkand011', 'ppadi009', 'achak034' // Volunteers
];
```

---

## FILE UPLOAD STRATEGY

### Allowed Formats & Limits
```
✅ Images: .png, .jpg, .jpeg (max 10MB each)
✅ Data: .csv, .xlsx, .xls, .txt (max 10MB each)
✅ Documents: .pdf (max 10MB only)
❌ NO: Large PDFs, videos, raw microscopy files
```

### Why 10MB Limit?
- **Email compatibility:** Gmail/Outlook 20-25MB limit, corporate 5-10MB
- **Fast interface:** Quick loading for file previews
- **Storage management:** UCR faculty baseline 100GB
- **Research backed:** 74% faster document transmission

### Weekly Compression Script (Run Locally)

**Runs:** Every Sunday midnight
**Process:**
1. Scan: `/3_Student_Files/` for files from past week
2. Convert: PNG/JPG → WebP (26-50% size reduction)
3. Compress: PDFs >2MB (42% reduction possible)
4. Archive: Original files → `/5_Archives/YYYY-MM-DD/`
5. Update: Files sheet with new file paths

**WebP Benefits (Research-backed):**
- 26% smaller than PNG (lossless)
- 30-50% smaller for photos
- Maintains quality for gel images, microscopy
- Universal browser support (2025)

**Storage Projection:**
- Current: 100GB limit
- With compression: ~150GB effective capacity
- Future: Request 500GB-1TB from UCR ITS

### Upload Button Warning
```html
<div class="upload-warning">
  ⚠️ Images automatically compressed weekly to WebP format
  💾 Max 10MB per file | Originals archived
  📁 Allowed: PNG, JPG, CSV, XLSX, TXT, PDF
</div>
```

---

## OPTIONAL HOURS FEATURE

### Use Case
- Member uploads gel image (no hours worked that day)
- Member registers arrival (will log hours at end of day)
- Member uploads data file from home

### Implementation
```javascript
// Make time fields optional
timeInInput.required = false;
timeOutInput.required = false;

// Default to 0 if blank
const hours = timeIn && timeOut ? calculateHours(timeIn, timeOut) : 0;
```

### Database
```csv
timestamp,netid,date,time_in,time_out,hours_worked,projects,files
2025-10-21 14:30,lcosme,2025-10-21,,,0,,"gel_image.png"
```

---

## MULTIPLE ENTRIES PER DAY

### Strategy: Allow Separate Logs

**Scenario:** Student comes 9am-12pm, then returns 2pm-5pm

**Solution:**
```
Entry 1: 9am-12pm (3h) - Mosquito Genomics
Entry 2: 2pm-5pm (3h) - Mealworm Farming
Total: 2 rows in database
Dashboard auto-sums: 6 hours for that day
```

**Why:**
- ✅ Simplest to implement
- ✅ Most accurate (different projects per session)
- ✅ Clear audit trail
- ✅ No complex time-range UI

---

## ACCESS CONTROL - TWO TIERS

### PUBLIC ACCESS (No login)
**Lab Schedule Page:**
- Shows: "Lab occupied 9am-5pm Monday"
- Shows: Generic activity ("Research in progress")
- ❌ NO names, NO files, NO specific projects

**Team Page:**
- Shows: Names, positions, photos
- ❌ NO hours, NO logs, NO personal data

### PRIVATE ACCESS (NetID Whitelist)
**Applies to ALL 4 tools:**
1. ✅ Daily Lab Log
2. ✅ My Lab Logs (personal dashboard)
3. ✅ Availability Poll
4. ✅ Lab Schedule (detailed view)

**What logged-in members see:**
- Full daily logs with file attachments
- File previews in tooltips (hover to see thumbnail)
- Click to view/download files
- Who's working on what project
- Detailed hours breakdown

**Implementation:**
```javascript
// Apps Script checks on every request
function checkAccess(userEmail) {
  const netid = userEmail.split('@')[0];
  if (!ALLOWED_NETIDS.includes(netid)) {
    throw new Error('Access denied. Contact lcosme@ucr.edu to request access.');
  }
  return netid;
}
```

---

## UPDATED DATABASE STRUCTURE

### team.csv (formerly students.csv)
```csv
netid,first_name,last_name,email,registration_date,drive_folder_id,role
lcosme,Luciano,Cosme,lcosme@ucr.edu,,,PI
andrelut,Andre,Torres,andrelut@ucr.edu,,,Project Scientist
mshan023,Matthew,Shan,mshan023@ucr.edu,,,Undergraduate Researcher
```

**New field:** `role` (PI, Project Scientist, Undergraduate Researcher, Undergraduate Volunteer)

### daily_log_submissions.csv (no changes)
```csv
timestamp,netid,first_name,last_name,email,date,time_in,time_out,hours_worked,projects,accomplishments,has_files,file_count
```

**Note:** time_in, time_out, hours_worked can now be empty/0

### files.csv (no changes)
```csv
upload_id,netid,log_date,file_name,file_type,file_size_mb,file_url,upload_timestamp
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1A: Core Updates (Do Now)
- [x] Rename students.csv → team.csv
- [x] Add Luciano + Andre to team.csv
- [x] Add role field
- [ ] Update HTML: "Student Information" → "Team Member Information"
- [ ] Make time fields optional in HTML
- [ ] Add upload warning near file input
- [ ] Update JavaScript: handle optional hours
- [ ] Update JavaScript: file validation (10MB, formats)
- [ ] Update JavaScript: NetID whitelist
- [ ] Create Apps Script: registration system
- [ ] Create Apps Script: file upload handler
- [ ] Create Apps Script: access control
- [ ] Deploy to Google Apps Script
- [ ] Deploy to GitHub Pages
- [ ] Test with multiple team members

### Phase 1B: Weekly Compression (After Phase 1A works)
- [ ] Create Python script: image→WebP conversion
- [ ] Create Python script: PDF compression
- [ ] Test compression locally
- [ ] Set up cron job (Sunday midnight)
- [ ] Document compression process
- [ ] Add compression log to /6_Documentation/

### Phase 1C: Public/Private Views (After Phase 1B)
- [ ] Create public lab schedule view
- [ ] Create private lab schedule view
- [ ] Add access control to availability poll
- [ ] Add access control to lab schedule
- [ ] Test both access levels

---

## TOOLS THAT NEED UPDATES

### 1. Daily Lab Log (daily-lab-log.html/js)
**Changes:**
- "Student Information" → "Team Member Information"
- Make time_in, time_out optional
- Add upload warning text
- Validate: 10MB limit, allowed formats
- Add NetID whitelist check

### 2. My Lab Logs Dashboard (my-lab-logs.html/js)
**Changes:**
- Add NetID whitelist check
- Show file thumbnails in tooltips
- Handle entries with 0 hours
- Update "Student" → "Team Member" labels

### 3. Availability Poll (availability_poll.html/js)
**Changes:**
- Add NetID whitelist check
- No other changes needed

### 4. Lab Schedule (lab-schedule.html/js)
**Changes:**
- Create two versions: public + private
- Add NetID whitelist for private view
- Auto-populate from daily logs
- Show files in tooltips (private only)

### 5. Apps Script Backend (daily-lab-log-apps-script.js)
**Changes:**
- Update: Students sheet → Team sheet
- Add: Access control function
- Add: Optional hours handling
- Add: File upload with validation
- Add: Auto-registration system

---

## GOOGLE DRIVE STRUCTURE (Updated)

```
/Users/lucianocosme/My Drive/undergrads/Cosme_Lab_Online_Notebook/
├── 1_CSV_Templates/
│   ├── team.csv ✅ (11 members with roles)
│   ├── daily_log_submissions.csv
│   ├── files.csv
│   └── projects.csv
├── 2_Google_Sheets/
│   └── (Create: "Cosme Lab - Daily Logs" with Team tab)
├── 3_Student_Files/ → 3_Team_Files/
│   ├── lcosme/
│   │   └── 2025-10/
│   ├── andrelut/
│   │   └── 2025-10/
│   ├── mshan023/
│   └── ... (auto-created per member)
├── 4_Reports/
├── 5_Archives/
│   └── 2025-10-27/ (weekly compression originals)
└── 6_Documentation/
    ├── compression-log.txt (weekly script output)
    └── phase-1-strategy.md
```

---

## STORAGE MANAGEMENT PLAN

### Current Status
- UCR Faculty: 100GB Google Drive baseline
- With compression: ~150GB effective

### Request More Storage
**Contact:** UCR ITS (https://its.ucr.edu/storage)
**Justify:**
- Multi-class platform (teaching need)
- Lab data management (research need)
- Canvas alternative (institutional benefit)
**Request:** 500GB-1TB

### Projected Usage (1 year)
```
Daily logs: ~10MB/week → 520MB/year
Files (with compression):
  - 5 team members × 2 files/week × 2MB avg = 20MB/week
  - 20MB/week × 52 weeks = 1.04GB/year
  - With compression: 0.65GB/year
Archives: 0.39GB/year
Total: ~1.5GB/year (well under 100GB limit)
```

**Conclusion:** Storage not a concern for several years

---

## FUTURE ENHANCEMENTS (Phase 2+)

### Phase 2: Calendar Integration
- Auto-populate calendar from daily logs
- Show who's in lab when
- Public vs private calendar views
- Manual event override

### Phase 3: Course Platform Template
- Replicate system for each course
- Student assignment submission
- Quiz/exam system
- Auto-grading integration
- Canvas replacement

### Phase 4: Advanced Features
- Email notifications (weekly summaries)
- Export to CSV/Excel
- Data visualization (charts, graphs)
- Mobile app (PWA)

---

## TESTING PLAN

### Test 1: Basic Submission (All scenarios)
1. Submit with hours + files
2. Submit with hours only (no files)
3. Submit with files only (no hours)
4. Submit twice in one day (separate sessions)

### Test 2: File Validation
1. Upload 15MB file (should reject)
2. Upload .docx file (should reject)
3. Upload 5 × 2MB images (should accept all)
4. Upload corrupted file (should handle gracefully)

### Test 3: Access Control
1. Test with allowed NetID (should work)
2. Test with non-allowed @ucr.edu (should block)
3. Test with non-UCR email (should block)
4. Test all 4 tools with same NetID

### Test 4: Compression Script
1. Upload 10MB PNG → compress → verify ~5MB WebP
2. Upload 8MB PDF → compress → verify <6MB
3. Check archives folder has originals
4. Verify files sheet updated with new paths

---

## SUCCESS CRITERIA

✅ All 11 team members in team.csv
✅ Hours optional (can submit files without hours)
✅ Multiple daily entries allowed
✅ 10MB file limit enforced
✅ Only allowed formats accepted
✅ NetID whitelist on all 4 tools
✅ Public views show generic data only
✅ Private views show files + details
✅ Compression script reduces storage by 30%+
✅ System works for PI, staff, and undergrads

---

**Next Step:** Update HTML/JavaScript files and deploy

**Estimated Time:**
- HTML/JS updates: 1 hour
- Apps Script: 1 hour
- Testing: 30 min
- **Total: 2.5 hours**
