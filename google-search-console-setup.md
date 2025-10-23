# Google Search Console Setup Instructions

## Step 1: Verify Your Site

1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Enter: `https://cosmelab.github.io/cosme-lab-website/`
4. Choose verification method:

### Option A: HTML Meta Tag (Recommended)
Google will give you a meta tag like:
```html
<meta name="google-site-verification" content="YOUR_CODE_HERE" />
```

Add this to the `<head>` section of `index.html` (right after the existing meta tags).

### Option B: HTML File Upload
Google will give you a file like `googleXXXXXXXXX.html`

Simply place this file in the root directory of your website.

## Step 2: Submit Your Sitemap

After verification is complete:

1. In Google Search Console, go to "Sitemaps" in the left sidebar
2. Enter: `sitemap.xml`
3. Click "Submit"

## Step 3: Request Indexing

1. Go to "URL Inspection" in the left sidebar
2. Enter your homepage URL: `https://cosmelab.github.io/cosme-lab-website/`
3. Click "Request Indexing"
4. Repeat for key pages:
   - `/research.html`
   - `/team.html`
   - `/publications.html`
   - `/join.html`

## Step 4: Monitor Performance

After 1-2 weeks, check:
- **Coverage**: Shows which pages are indexed
- **Performance**: Shows search queries and clicks
- **Enhancements**: Shows any SEO issues

## Expected Timeline

- **Week 1-2**: Initial indexing begins
- **Week 3-4**: Pages start appearing in search
- **Month 2-3**: Rankings improve as Google understands your content
- **Month 3-6**: Full SEO potential realized

## Additional Tips

1. **Get UCR Backlinks**: Ensure your lab is listed on:
   - UCR Entomology Department website
   - UCR Faculty Directory
   - UCR Research Spotlight pages

2. **Content Updates**: Regularly update your News page to signal fresh content

3. **Social Signals**: Share your publications and news on Twitter/X mentioning @UCRiverside

4. **Academic Citations**: Add your lab website URL to your publications and conference posters
