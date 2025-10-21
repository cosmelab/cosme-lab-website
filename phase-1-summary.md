# Phase 1 Implementation Summary - Student Registration & File Upload

## What's Been Done

### 1. Google Drive Structure Created ✅

**New CSV Files in** `/Users/lucianocosme/My Drive/undergrads/`:
- `students.csv` - Student registration database
- `files.csv` - File upload tracking
- `projects.csv` - Project list
- `daily_log_submissions.csv` - Updated with new fields
- `google-drive-structure.md` - Organization documentation

**New Fields in daily_log_submissions.csv:**
```csv
timestamp,netid,first_name,last_name,email,date,time_in,time_out,hours_worked,projects,accomplishments,has_files,file_count
```

### 2. Form Updates ✅

**Changed Fields:**
- ❌ Removed: "UCR Email" (readonly)
- ❌ Removed: "Name" (single field)
- ✅ Added: "UCR NetID" (e.g., "lcosme")
- ✅ Added: "First Name" and "Last Name" (side by side)
- ✅ Changed: Project dropdown → Multiple project checkboxes
- ✅ Added: File upload input (multiple files, 10MB limit)

**Projects (Checkboxes):**
- Mosquito Genomics
- Mealworm Farming
- General Lab Maintenance
- Meeting/Training
- Other

**File Types Accepted:**
- Images: .png, .jpg, .jpeg
- Documents: .pdf, .docx, .txt
- Data: .xlsx, .xls, .csv

### 3. CSS Styling ✅

**New Dracula-themed styles for:**
- Checkbox groups (purple accent)
- File upload button (magenta gradient)
- File list display (cyan text, dark cards)
- Remove file buttons (red hover)

## What Needs to Be Done

### 4. JavaScript Updates (NEXT)

**File:** `daily-lab-log.js`

**New functionality needed:**
```javascript
// 1. Handle NetID input (lowercase, validate pattern)
// 2. Get multiple selected projects (checkboxes)
// 3. Handle file selection with validation:
//    - Check file size (10MB max per file)
//    - Display selected files with size
//    - Allow removing files before submit
// 4. Convert files to base64 for Apps Script upload
// 5. Update form submission to include:
//    - netid
//    - first_name, last_name
//    - projects array
//    - files array
```

### 5. Apps Script Backend (AFTER JS)

**File:** `daily-lab-log-apps-script.js`

**New functionality needed:**
```javascript
// 1. Auto-registration system:
//    - Check if netid exists in Students sheet
//    - If not, create new student record
//    - Create Google Drive folder structure

// 2. File handling:
//    - Receive base64 files from frontend
//    - Create student folder if doesn't exist
//    - Create month subfolder if doesn't exist
//    - Save files to Drive
//    - Log files in Files sheet
//    - Share folder with student@ucr.edu

// 3. Update submission logging:
//    - Save to Submissions sheet with new fields
//    - Handle multiple projects (pipe-separated)
//    - Track file uploads (has_files, file_count)
```

### 6. Google Sheet Setup

**Create "Cosme Lab - Daily Logs" spreadsheet with tabs:**
1. Students (import students.csv)
2. Submissions (import daily_log_submissions.csv)
3. Files (import files.csv)
4. Projects (import projects.csv)
5. Summary (import daily_log_summary.csv)
6. Export (import daily_log_export.csv)

### 7. Google Drive Folder

**Create folder structure:**
```
/Users/lucianocosme/My Drive/Cosme Lab - Student Files/
├── lcosme/
│   ├── 2025-10/
│   └── 2025-11/
└── (auto-created as students register)
```

## Testing Plan

### Test 1: Registration
1. Submit form with new NetID (e.g., "testuser")
2. Verify student record created in Students sheet
3. Verify Drive folder created
4. Verify folder shared with testuser@ucr.edu

### Test 2: File Upload
1. Select 2-3 files (gel image, PDF, Excel)
2. Verify file size validation (reject >10MB)
3. Verify file list displays correctly
4. Submit form
5. Verify files saved to student's Drive folder
6. Verify files logged in Files sheet

### Test 3: Multiple Projects
1. Select 2+ project checkboxes
2. Submit form
3. Verify projects saved as "Mosquito Genomics|Mealworm Farming"
4. Verify dashboard can parse and display multiple projects

### Test 4: Existing Student
1. Submit with existing NetID
2. Verify no duplicate student record
3. Verify files go to existing folder
4. Verify month subfolder created if new month

## Data Flow Diagram

```
Student fills form:
  NetID: lcosme
  First: Luciano
  Last: Cosme
  Projects: [Mosquito Genomics, Mealworm]
  Files: [gel1.png, data.xlsx]
    ↓
Frontend JavaScript:
  - Validate NetID format
  - Check file sizes (10MB limit)
  - Convert files to base64
  - Package data as JSON
    ↓
Apps Script Backend:
  - Check Students sheet for "lcosme"
  - If not found:
      → Create row in Students
      → Create /lcosme/ folder
      → Share with lcosme@ucr.edu
  - Create /lcosme/2025-10/ if needed
  - Save files to Drive
  - Log in Files sheet:
      upload_id,netid,log_date,file_name,file_type,file_size_mb,file_url,timestamp
  - Log in Submissions sheet:
      timestamp,lcosme,Luciano,Cosme,lcosme@ucr.edu,2025-10-21,...,"Mosquito Genomics|Mealworm",...,yes,2
    ↓
Student sees:
  - Success message
  - "View My Logs" button → Dashboard
  - Dashboard shows:
      → Total hours updated
      → Projects: Mosquito Genomics (X hours), Mealworm (Y hours)
      → Files: 2 uploaded today
      → Table with today's log entry
```

## File Size Reference

**10MB Limit Examples:**
- ✅ Gel image (PNG): ~2-5MB typical
- ✅ Data spreadsheet (XLSX): ~1-3MB typical
- ✅ PDF report: ~500KB-2MB typical
- ❌ Video file: Often >50MB (not allowed)
- ❌ Large sequencing data: Often >100MB (not allowed)

## Next Steps

1. Update `daily-lab-log.js` with file handling logic
2. Update `daily-lab-log-apps-script.js` with registration & file upload
3. Create Google Sheet from CSV files
4. Create Drive folder structure
5. Test on local server with fake data
6. Deploy to Google Apps Script
7. Push to GitHub Pages
8. Test with real UCR login

## Estimated Completion Time

- JavaScript updates: 30 min
- Apps Script updates: 45 min
- Google Sheet setup: 10 min
- Testing: 20 min
- **Total: ~2 hours**

## Success Criteria

✅ Students can register with NetID
✅ Students can select multiple projects
✅ Students can upload files (10MB limit enforced)
✅ Files saved to student's Google Drive folder
✅ Files accessible to student (view-only)
✅ All data logged correctly in Google Sheets
✅ Dashboard displays files and projects correctly
✅ No duplicate student records created
✅ Month folders auto-created

---

**Status:** Ready for JavaScript implementation
**Last Updated:** October 21, 2025
