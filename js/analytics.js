// Google Analytics 4 Setup
// Measurement ID for cosmelab.github.io/cosme-lab-website/
const GA_MEASUREMENT_ID = 'G-R6YGBLPHSH';

// Load Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

// Custom event tracking for lab website
function trackEvent(category, action, label) {
    gtag('event', action, {
        'event_category': category,
        'event_label': label
    });
}

// Track publication clicks
document.addEventListener('DOMContentLoaded', function() {
    // Track publication PDF downloads
    document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Publication', 'download', this.href);
        });
    });
    
    // Track external links
    document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('External Link', 'click', this.href);
        });
    });
    
    // Track contact form submissions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('Contact', 'form_submit', 'Contact Form');
        });
    }
});