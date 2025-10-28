/**
 * Lab Schedule - Google Apps Script Backend
 * Fetches the most recent availability submission for each member
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet with availability data
 * 2. Go to Extensions > Apps Script
 * 3. Replace existing code with this
 * 4. Update SHEET_NAME if needed
 * 5. Deploy as Web App:
 *    - Execute as: Me (your account)
 *    - Who has access: Anyone
 * 6. Copy the web app URL
 * 7. Update lab-schedule.js with the new URL (line 5)
 *
 * KEY CHANGE: Now fetches the MOST RECENT submission for each member,
 * not just current week. Members only need to resubmit when schedule changes!
 */

// CONFIGURATION
const SHEET_NAME = 'Availability Data'; // Update this to match your sheet name

/**
 * Handle GET requests from lab-schedule.html
 * Returns the most recent availability for each unique member
 */
function doGet(e) {
  try {
    // Get all availability data
    const data = getAllAvailabilityData();

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
        message: 'Showing most recent submission for each member'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doGet: ' + error);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString(),
        data: []
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get the most recent availability submission for each unique member
 * This allows members to skip weekly resubmission if their schedule hasn't changed
 */
function getAllAvailabilityData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('Sheet "' + SHEET_NAME + '" not found');
  }

  // Get all data
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return []; // No data (just headers or empty)
  }

  const headers = data[0];
  const rows = data.slice(1);

  // Find column indices
  const timestampCol = headers.indexOf('Timestamp');
  const nameCol = headers.indexOf('First Name') !== -1 ? headers.indexOf('First Name') : headers.indexOf('Name');
  const emailCol = headers.indexOf('Email');

  if (timestampCol === -1 || nameCol === -1) {
    throw new Error('Required columns not found. Need: Timestamp, First Name (or Name), Email');
  }

  // Time slot columns (assuming they start after email)
  // Format: "Monday 8:00 AM", "Monday 9:00 AM", etc.
  const timeSlotColumns = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    // Check if this is a time slot column (contains day and time)
    if (header.includes('Monday') || header.includes('Tuesday') ||
        header.includes('Wednesday') || header.includes('Thursday') ||
        header.includes('Friday')) {
      timeSlotColumns.push({
        index: i,
        name: header
      });
    }
  }

  if (timeSlotColumns.length === 0) {
    throw new Error('No time slot columns found');
  }

  // Group submissions by email (to find most recent per member)
  const submissionsByEmail = {};

  rows.forEach(row => {
    const timestamp = row[timestampCol];
    const name = row[nameCol];
    const email = emailCol !== -1 ? row[emailCol] : null;

    // Skip empty rows
    if (!name || name === '') return;

    // Use email as key if available, otherwise use name
    const key = email || name;

    // Parse timestamp
    let submissionDate;
    if (timestamp instanceof Date) {
      submissionDate = timestamp;
    } else {
      submissionDate = new Date(timestamp);
    }

    // If this is the first submission for this email, or if it's more recent
    if (!submissionsByEmail[key] || submissionDate > submissionsByEmail[key].timestamp) {
      submissionsByEmail[key] = {
        timestamp: submissionDate,
        name: name,
        email: email,
        row: row
      };
    }
  });

  // Process the most recent submission for each member
  const result = [];

  Object.keys(submissionsByEmail).forEach(key => {
    const submission = submissionsByEmail[key];
    const row = submission.row;

    // Extract selections for this member
    const selections = [];

    timeSlotColumns.forEach(col => {
      const value = row[col.index];

      // Check if this slot is selected (marked with 'x', 'X', or any truthy value)
      if (value && value.toString().trim().toLowerCase() === 'x') {
        // Parse day and time from column name
        // Format: "Monday 8:00 AM" or "Mon 8:00 AM"
        const parts = col.name.split(' ');
        let day = parts[0];
        const time = parts.slice(1).join(' ');

        // Normalize day names
        const dayMap = {
          'Mon': 'Monday',
          'Tue': 'Tuesday',
          'Wed': 'Wednesday',
          'Thu': 'Thursday',
          'Fri': 'Friday',
          'Monday': 'Monday',
          'Tuesday': 'Tuesday',
          'Wednesday': 'Wednesday',
          'Thursday': 'Thursday',
          'Friday': 'Friday'
        };

        day = dayMap[day] || day;

        selections.push({
          day: day,
          time: time
        });
      }
    });

    // Only include members who have at least one selection
    if (selections.length > 0) {
      result.push({
        name: submission.name,
        email: submission.email,
        timestamp: submission.timestamp.toISOString(),
        selections: selections
      });
    }
  });

  return result;
}

/**
 * Helper function to get current week range (for testing/debugging)
 */
function getCurrentWeekRange() {
  const today = new Date();
  const monday = getMonday(today);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    monday: monday.toISOString(),
    friday: friday.toISOString()
  };
}

/**
 * Get Monday of a given week
 */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Test function - run this to see what data will be returned
 */
function testGetData() {
  const data = getAllAvailabilityData();
  Logger.log('Total members with availability: ' + data.length);
  Logger.log(JSON.stringify(data, null, 2));
}

/**
 * Get summary statistics (for admin monitoring)
 */
function getStats() {
  const data = getAllAvailabilityData();

  const stats = {
    totalMembers: data.length,
    totalSelections: data.reduce((sum, member) => sum + member.selections.length, 0),
    members: data.map(m => ({
      name: m.name,
      selectionCount: m.selections.length,
      lastSubmitted: m.timestamp
    }))
  };

  Logger.log(JSON.stringify(stats, null, 2));
  return stats;
}

/**
 * IMPORTANT NOTES:
 *
 * 1. Data Structure:
 *    - Now shows the MOST RECENT submission for each unique member (by email)
 *    - Members don't need to resubmit every week if schedule unchanged
 *    - Schedule displays: "Showing most recent submission for each member"
 *
 * 2. Sheet Structure Expected:
 *    Columns needed:
 *    - Timestamp (auto-generated)
 *    - First Name or Name
 *    - Email (optional but recommended for deduplication)
 *    - Time slot columns like: "Monday 8:00 AM", "Tuesday 9:00 AM", etc.
 *    - Cells marked with "x" or "X" indicate availability
 *
 * 3. How It Works:
 *    - Fetches ALL rows from sheet
 *    - Groups by email (or name if no email)
 *    - For each member, keeps only the MOST RECENT submission
 *    - Returns that data to the frontend
 *
 * 4. Benefits:
 *    - Members only resubmit when schedule actually changes
 *    - Reduces form fatigue
 *    - Always shows current availability (most recent data)
 *    - Still allows weekly updates for those who need to change
 *
 * 5. Migration Notes:
 *    - No changes needed to existing sheet structure
 *    - Works with existing poll submissions
 *    - Simply redeploy this script and update frontend URL
 *
 * 6. Future Enhancements:
 *    - Add "last updated" indicator for each member on frontend
 *    - Show how many weeks ago each member submitted
 *    - Send reminder emails if submission > 4 weeks old
 */
