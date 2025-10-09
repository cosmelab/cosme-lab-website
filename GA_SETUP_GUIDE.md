# Google Analytics Real Visitor Counter Setup Guide

## Quick Setup (Immediate)

For now, your visitor counter is configured with estimated values. To update with your real Google Analytics data:

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Navigate to**: Reports → Acquisition → User acquisition
3. **Note these values**:
   - Total Users (all time)
   - Average daily users (last 30 days)

4. **Update `js/visitor-counter.js`** (lines 56-57):
   ```javascript
   const baseCount = 1500; // Replace with your total users
   const dailyGrowth = 5; // Replace with your average daily users
   ```

## Advanced Setup: Real-time GA Data (Recommended)

This setup creates a free API endpoint that fetches real Google Analytics data automatically.

### Step 1: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Copy the entire contents of `google-apps-script.gs` into the editor
4. Save the project (name it "Cosme Lab GA API")

### Step 2: Enable Google Analytics Data API

1. In the Apps Script editor, click "Services" (+ icon on left)
2. Find "Google Analytics Data API"
3. Click "Add"
4. It will be added to your project

### Step 3: Deploy as Web App

1. Click "Deploy" → "New Deployment"
2. Configure:
   - Type: **Web app**
   - Description: "GA visitor counter API"
   - Execute as: **Me** (your email)
   - Who has access: **Anyone**
3. Click "Deploy"
4. **Authorize** the app when prompted
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/AKfyc.../exec`)

### Step 4: Update Your Website

1. Open `js/visitor-counter.js`
2. Update line 8 with your Web App URL:
   ```javascript
   this.gaEndpoint = 'YOUR_WEB_APP_URL_HERE';
   ```

### Step 5: Test

1. Open your website locally
2. Check browser console for any errors
3. The counter should now show real GA data!

## Troubleshooting

### "GA fetch failed" in console
- Check that your Web App URL is correct
- Ensure the Apps Script is deployed as "Anyone can access"
- Verify Google Analytics Data API is enabled

### Counter shows fallback values
- The script falls back to estimated values if GA fetch fails
- Check your Google Apps Script logs for errors
- Ensure your GA4 property ID is correct (line 17 in google-apps-script.gs)

### Finding Your GA4 Property ID
1. Go to Google Analytics
2. Click Admin (gear icon)
3. Under Property column, click "Property details"
4. Copy the Property ID (numeric value like 365092867)

## Current Status

✅ **Basic counter working** - Shows unified count across devices
✅ **SEO improvements added** - Meta tags for better search visibility
✅ **Google Apps Script prepared** - Ready for deployment
⏳ **Awaiting GA API setup** - Follow steps above to connect real data

## Benefits of This Setup

- **Real visitor data** - Shows actual GA metrics
- **Automatic updates** - Refreshes every hour
- **No server costs** - Uses free Google Apps Script
- **Secure** - No API keys exposed in frontend code
- **Cached** - Reduces API calls, faster loading

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all IDs and URLs are correct
3. Ensure proper permissions in Google Apps Script
4. The fallback counter will always work as backup