/**
 * Google Apps Script - GA4 Data API Endpoint
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Copy this entire code into the editor
 * 4. Click "Deploy" > "New Deployment"
 * 5. Choose "Web app" as the type
 * 6. Set "Execute as" to your account
 * 7. Set "Who has access" to "Anyone"
 * 8. Copy the deployment URL
 * 9. Update your website's visitor-counter.js with this URL
 */

// Your Google Analytics 4 Property ID
const GA4_PROPERTY_ID = '365092867'; // Found in your GA URL
const GA4_MEASUREMENT_ID = 'G-R6YGBLPHSH';

function doGet(request) {
  try {
    // Get visitor data from Google Analytics
    const visitorData = getAnalyticsData();

    // Return as JSON (CORS is automatically handled by Google Apps Script)
    return ContentService
      .createTextOutput(JSON.stringify(visitorData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString(),
        fallback: true,
        count: 1500
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getAnalyticsData() {
  // Use Google Analytics Data API (GA4)
  const propertyId = 'properties/' + GA4_PROPERTY_ID;

  try {
    // Get total users (all time)
    const totalUsersResponse = AnalyticsData.Properties.runReport({
      property: propertyId,
      dateRanges: [{
        startDate: '2024-07-01', // Your lab start date
        endDate: 'today'
      }],
      metrics: [{
        name: 'totalUsers'
      }]
    });

    // Get today's users
    const todayUsersResponse = AnalyticsData.Properties.runReport({
      property: propertyId,
      dateRanges: [{
        startDate: 'today',
        endDate: 'today'
      }],
      metrics: [{
        name: 'activeUsers'
      }]
    });

    // Get this week's users
    const weekUsersResponse = AnalyticsData.Properties.runReport({
      property: propertyId,
      dateRanges: [{
        startDate: '7daysAgo',
        endDate: 'today'
      }],
      metrics: [{
        name: 'activeUsers'
      }]
    });

    // Extract values
    const totalUsers = parseInt(totalUsersResponse.rows[0].metricValues[0].value);
    const todayUsers = parseInt(todayUsersResponse.rows[0].metricValues[0].value);
    const weekUsers = parseInt(weekUsersResponse.rows[0].metricValues[0].value);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        totalVisitors: totalUsers,
        todayVisitors: todayUsers,
        weekVisitors: weekUsers,
        averageDaily: Math.floor(weekUsers / 7)
      }
    };

  } catch (error) {
    // Fallback to manual values if API fails
    return {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString(),
      data: {
        totalVisitors: 1500,
        todayVisitors: 10,
        weekVisitors: 70,
        averageDaily: 10
      }
    };
  }
}

// Test function
function testGetAnalyticsData() {
  const result = getAnalyticsData();
  console.log(JSON.stringify(result, null, 2));
}

/**
 * ADDITIONAL SETUP REQUIRED:
 *
 * 1. Enable Google Analytics Data API:
 *    - In Apps Script editor, click "Services" (+)
 *    - Find "Google Analytics Data API"
 *    - Click "Add"
 *
 * 2. Set up OAuth:
 *    - The first deployment will ask for permissions
 *    - Authorize access to your Google Analytics
 *
 * 3. Update your website:
 *    - Copy the deployment URL
 *    - Update visitor-counter.js with this URL
 *
 * Your deployment URL will look like:
 * https://script.google.com/macros/s/[SCRIPT_ID]/exec
 */