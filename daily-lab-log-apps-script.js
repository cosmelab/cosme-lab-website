/**
 * Daily Lab Log - Google Apps Script Backend
 *
 * This script handles:
 * - User authentication (UCR email)
 * - Form submissions to Google Sheets
 * - Data validation
 *
 * DEPLOYMENT SETTINGS:
 * - Execute as: User accessing the web app
 * - Who has access: Anyone in ucr.edu
 *
 * This ensures UCR SSO authentication with Duo
 */

// === CONFIGURATION ===
const SHEET_NAME = 'Submissions';
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

// === MAIN HANDLERS ===

/**
 * Handle GET requests
 * Used to fetch user email and other data
 */
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getUserEmail') {
    return getUserEmailResponse();
  }

  // Default: return HTML (if you want to serve the form from Apps Script)
  return ContentService.createTextOutput('Daily Lab Log API');
}

/**
 * Handle POST requests
 * Used to submit daily log entries
 */
function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);

    // Get authenticated user email
    const userEmail = Session.getActiveUser().getEmail();

    // Validate UCR email
    if (!userEmail || !userEmail.endsWith('@ucr.edu')) {
      return createJsonResponse({
        success: false,
        error: 'Authentication failed. Please log in with your UCR email.'
      });
    }

    // Validate required fields
    if (!data.name || !data.date || !data.time_in || !data.time_out || !data.project || !data.accomplishments) {
      return createJsonResponse({
        success: false,
        error: 'Missing required fields.'
      });
    }

    // Save to sheet
    const result = saveToSheet(data, userEmail);

    return createJsonResponse({
      success: true,
      message: 'Daily log submitted successfully!',
      data: result
    });

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createJsonResponse({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}

// === HELPER FUNCTIONS ===

/**
 * Get authenticated user's email
 */
function getUserEmailResponse() {
  const userEmail = Session.getActiveUser().getEmail();

  // Extract name from email (first.last@ucr.edu -> First Last)
  let name = '';
  if (userEmail) {
    const namePart = userEmail.split('@')[0];
    const parts = namePart.split('.');
    name = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }

  return createJsonResponse({
    email: userEmail || '',
    name: name || ''
  });
}

/**
 * Save data to Google Sheet
 */
function saveToSheet(data, userEmail) {
  const sheet = SPREADSHEET.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('Submissions sheet not found. Please create a sheet named "Submissions".');
  }

  // Prepare row data
  const timestamp = new Date();
  const rowData = [
    timestamp,                  // A: timestamp
    userEmail,                  // B: email
    data.name,                  // C: name
    data.date,                  // D: date
    data.time_in,               // E: time_in
    data.time_out,              // F: time_out
    parseFloat(data.hours_worked),  // G: hours_worked
    data.project,               // H: project
    data.accomplishments        // I: accomplishments
  ];

  // Append to sheet
  sheet.appendRow(rowData);

  return {
    timestamp: timestamp.toISOString(),
    email: userEmail,
    hours_worked: data.hours_worked
  };
}

/**
 * Create JSON response
 */
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// === CSV EXPORT FUNCTION ===

/**
 * Export current data to CSV format
 * This can be run manually or on a schedule
 */
function exportToCSV() {
  const sheet = SPREADSHEET.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // Convert to CSV
  const csvContent = data.map(row => {
    return row.map(cell => {
      // Handle cells with commas or quotes
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        return '"' + cell.replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',');
  }).join('\n');

  // Write to Export tab
  const exportSheet = SPREADSHEET.getSheetByName('Export');
  if (!exportSheet) {
    SPREADSHEET.insertSheet('Export');
  }

  const exportSheetFinal = SPREADSHEET.getSheetByName('Export');
  exportSheetFinal.clear();
  exportSheetFinal.getRange(1, 1).setValue(csvContent);

  Logger.log('CSV export complete');
  return csvContent;
}

/**
 * Create summary statistics
 * Run this to update the Summary tab
 */
function updateSummary() {
  const submissionsSheet = SPREADSHEET.getSheetByName(SHEET_NAME);
  const summarySheet = SPREADSHEET.getSheetByName('Summary');

  if (!summarySheet) {
    SPREADSHEET.insertSheet('Summary');
  }

  const summarySheetFinal = SPREADSHEET.getSheetByName('Summary');

  // Get all submissions (skip header row)
  const data = submissionsSheet.getDataRange().getValues().slice(1);

  // Group by student
  const studentStats = {};

  data.forEach(row => {
    const email = row[1];
    const name = row[2];
    const hoursWorked = parseFloat(row[6]) || 0;
    const date = row[3];

    if (!studentStats[email]) {
      studentStats[email] = {
        name: name,
        totalHours: 0,
        sessions: 0,
        lastVisit: date
      };
    }

    studentStats[email].totalHours += hoursWorked;
    studentStats[email].sessions += 1;

    // Update last visit if more recent
    if (new Date(date) > new Date(studentStats[email].lastVisit)) {
      studentStats[email].lastVisit = date;
    }
  });

  // Clear summary sheet
  summarySheetFinal.clear();

  // Write headers
  summarySheetFinal.getRange(1, 1, 1, 5).setValues([[
    'Student Name',
    'Total Hours',
    'Total Sessions',
    'Avg Hours/Session',
    'Last Visit'
  ]]);

  // Write data
  const summaryData = Object.keys(studentStats).map(email => {
    const stats = studentStats[email];
    return [
      stats.name,
      stats.totalHours.toFixed(2),
      stats.sessions,
      (stats.totalHours / stats.sessions).toFixed(2),
      stats.lastVisit
    ];
  });

  if (summaryData.length > 0) {
    summarySheetFinal.getRange(2, 1, summaryData.length, 5).setValues(summaryData);
  }

  Logger.log('Summary updated for ' + summaryData.length + ' students');
}
