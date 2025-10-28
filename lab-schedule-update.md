# Lab Schedule Update - Show Most Recent Submissions

## What Changed

**Problem:** Students were tired of resubmitting availability every week when their schedule hadn't changed.

**Solution:** Lab schedule now displays the MOST RECENT submission for each member, not just the current week. Members only need to resubmit when their schedule actually changes!

## Files Modified

1. **lab-schedule-apps-script.gs** - NEW! Updated Google Apps Script backend
2. **lab-schedule.html** - Updated messaging to clarify new behavior
3. **LAB_SCHEDULE_UPDATE.md** - This deployment guide

## How It Works Now

### Before (Old Behavior)
- Script fetched only current week's submissions
- If member didn't submit this week → they don't appear on schedule
- Members had to resubmit every week even if schedule unchanged

### After (New Behavior)
- Script fetches ALL submissions
- Groups by email/name
- Keeps only the MOST RECENT submission for each member
- Shows that on the schedule
- Members only resubmit when schedule changes!

### Example
```
Week 1: Alice submits Mon/Wed 9-12
Week 2: Alice doesn't submit (schedule unchanged)
        → Schedule still shows Alice Mon/Wed 9-12 (from Week 1)
Week 3: Alice updates to Tue/Thu 10-2
        → Schedule now shows Alice Tue/Thu 10-2 (from Week 3)
Week 4: Alice doesn't submit
        → Schedule shows Alice Tue/Thu 10-2 (from Week 3)
```

## Deployment Instructions

### Step 1: Update Google Apps Script

1. **Open your Google Sheet** with availability data
2. **Go to Extensions > Apps Script**
3. **You should see existing code** for the lab schedule endpoint
4. **Select all existing code** and delete it
5. **Copy ALL code** from `lab-schedule-apps-script.gs`
6. **Paste** into the Apps Script editor
7. **Update SHEET_NAME** if your sheet has a different name (line 17):
   ```javascript
   const SHEET_NAME = 'Availability Data'; // Update if different
   ```
8. **Click Save** (disk icon)

### Step 2: Test the Script

1. In Apps Script editor, select function: `testGetData`
2. Click **Run** (play button)
3. Check **Execution log** (bottom panel)
4. You should see:
   ```
   Total members with availability: X
   [JSON data showing each member's most recent submission]
   ```
5. **Verify:** Each member appears only ONCE with their most recent data

### Step 3: Redeploy (If Needed)

**Option A: Use Existing Deployment (Easiest)**
- If you already have a web app deployment, you don't need to redeploy
- Just click **Deploy > Manage deployments**
- Click **Edit** (pencil icon) on your existing deployment
- Click **Deploy** (it will create a new version)
- **Keep the same URL** - no frontend changes needed!

**Option B: New Deployment (If First Time)**
- Click **Deploy > New deployment**
- Select type: **Web app**
- Configure:
  - Description: "Lab Schedule - Most Recent Submissions"
  - Execute as: Me (your account)
  - Who has access: Anyone
- Click **Deploy**
- **Copy the web app URL**
- Update `lab-schedule.js` line 5 with new URL:
  ```javascript
  const APPS_SCRIPT_URL = 'YOUR_NEW_URL_HERE';
  ```

### Step 4: Update Frontend Files

1. **Commit the updated HTML:**
   ```bash
   cd /Users/lucianocosme/Projects/ucr-lab-website
   git status
   git add lab-schedule.html
   git commit -m "Update lab schedule to show most recent submissions for each member"
   git push
   ```

2. **Optional: Update JavaScript** (if you created new deployment in Step 3 Option B)
   ```bash
   git add lab-schedule.js
   git commit -m "Update lab schedule API endpoint"
   git push
   ```

### Step 5: Test Live Site

1. **Open your lab schedule page:** https://cosmelab.ucr.edu/lab-schedule.html
2. **Check:**
   - Do all expected members appear?
   - Does the message say "Showing most recent submission"?
   - Click "Refresh Data" - does it work?
3. **Verify logic:**
   - Member who submitted 2 weeks ago should still appear
   - Their availability should be from their last submission

## What Team Members See

### On Lab Schedule Page
- New header message: "Showing most recent submission for each member. Only resubmit if your schedule changes!"
- Submit button now says: "Submit/Update Your Availability"
- Note below button: "Only resubmit if your schedule changes - we'll keep showing your latest submission!"

### Expected Behavior
- **First time:** Submit availability → appears on schedule
- **Week 2-N:** Don't submit → still appears (showing Week 1 data)
- **When changes:** Submit update → schedule updates with new data
- **Future weeks:** Don't submit → keeps showing most recent data

## Communication to Team

### Email Template

**Subject:** Lab Schedule Update - No Need to Resubmit Every Week!

```
Hi Team,

Good news! We've updated the lab schedule system to be less annoying. 😊

What's new:
✅ You only need to submit your availability when it actually CHANGES
✅ We'll keep showing your most recent submission on the schedule
✅ No more weekly resubmissions if your schedule is the same!

How it works:
- Submit your availability once
- It stays on the schedule until you update it
- When your schedule changes, just resubmit

The system automatically shows everyone's most recent submission, so the schedule is always current without the weekly hassle.

Lab Schedule: https://cosmelab.ucr.edu/lab-schedule.html
Update Availability: https://cosmelab.ucr.edu/polls/lab-availability/availability_poll.html

Questions? Let me know!

Dr. Cosme
```

### Slack/Teams Announcement

```
📅 Lab Schedule Update!

No more weekly resubmissions! 🎉

The schedule now shows your most recent availability automatically.
Only resubmit when your schedule actually changes.

Less form fatigue, same functionality! 💪
```

## Technical Details

### Data Deduplication Logic

The script groups submissions by email (or name if no email):
```javascript
// Pseudocode
for each row in sheet:
  key = email || name
  if this is first submission for key OR newer than existing:
    keep this submission
  else:
    discard (older data)

return only the most recent submission for each unique member
```

### Performance Notes

- **Before:** Query filtered by date → fast but incomplete
- **After:** Query reads all data → slightly slower but complete
- **Impact:** Negligible for <1000 rows
- **Benefit:** Always shows current availability

### Edge Cases Handled

1. **Member submits multiple times same week**
   - Keeps most recent (latest timestamp)

2. **Member hasn't submitted in months**
   - Still appears with last submission
   - Consider adding "Last updated: X weeks ago" in future

3. **Member changes email**
   - Will appear twice (treated as different members)
   - Solution: Use name as fallback, or manual cleanup

4. **No email column**
   - Falls back to using name for deduplication
   - Works fine if names are unique

## Future Enhancements

### Option 1: Show "Last Updated" Per Member
Add timestamp indicator:
```
Alice (updated 2 weeks ago) - Mon/Wed 9-12
Bob (updated today) - Tue/Thu 10-2
```

### Option 2: Reminder System
Send email if submission > 4 weeks old:
```
"Hey Alice, your availability was last updated 4 weeks ago.
Still the same? No action needed!
Changed? Update here: [link]"
```

### Option 3: Expiry System
Auto-remove submissions older than X weeks:
```
If submission > 8 weeks old:
  Don't show on schedule
  Send reminder email
```

### Option 4: Member Dashboard
Let members see:
- Their current submitted availability
- When they last updated
- Option to quickly update

## Troubleshooting

### Issue: No data showing on schedule

**Check:**
- Apps Script deployment successful?
- "Who has access" set to "Anyone"?
- Web app URL correct in lab-schedule.js?
- Run `testGetData()` function - any errors?

**Fix:**
- Check Apps Script execution logs
- Verify sheet name matches script
- Ensure columns named correctly

### Issue: Duplicate members appearing

**Cause:** Member submitted with different emails or name variations

**Fix:**
- Standardize email/name in submissions
- Or: Update script to normalize names (trim, lowercase)

### Issue: Old data showing for member who updated

**Cause:** Script comparing timestamps incorrectly

**Fix:**
- Check timestamp column format in sheet
- Ensure dates are actual Date objects, not strings
- Test with `testGetData()` function

### Issue: Script timeout

**Cause:** Too much data in sheet (>10,000 rows)

**Fix:**
- Archive old data to separate sheet
- Only keep last 100 rows per member
- Optimize script (read only necessary columns)

## Rollback Plan

If issues arise and you need to go back to old behavior:

1. **Revert Apps Script**
   - Restore previous version from version history
   - Or: Filter results by current week before returning

2. **Revert Frontend**
   ```bash
   git revert HEAD
   git push
   ```

3. **Communicate to team**
   - "Temporarily reverted to weekly submissions"
   - "Will fix and redeploy soon"

## Questions?

Contact: Dr. Luciano Cosme (lcosme@ucr.edu)

---

**Deployed:** [Date]
**Status:** Ready for deployment
**Impact:** Positive - reduces form fatigue for team members
