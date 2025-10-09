// Google Analytics Integrated Visitor Counter
class LabVisitorCounter {
    constructor() {
        this.storageKey = 'cosmelab_visitor_count';
        this.sessionKey = 'cosmelab_session_id';
        this.displayElement = null;
        // Google Apps Script endpoint for real GA data
        this.gaEndpoint = 'https://script.google.com/macros/s/AKfycbwLAyrcQwN2mSryqzcYeCllAzJ0aRrgEuac1RVGteYx8JQRSS_uF1k17qnNF7wbP8Tp/exec';
        this.cacheKey = 'ga_data_cache';
        this.cacheExpiry = 3600000; // 1 hour cache
    }
    
    getOrCreateSessionId() {
        // Use a device-agnostic session ID to ensure consistency
        let sessionId = sessionStorage.getItem(this.sessionKey);
        if (!sessionId) {
            // Create session ID that's the same format regardless of device
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            sessionStorage.setItem(this.sessionKey, sessionId);
            return { sessionId, isNew: true };
        }
        return { sessionId, isNew: false };
    }
    
    async getVisitorCount() {
        // Try to fetch real GA data if endpoint is configured
        if (this.gaEndpoint) {
            try {
                // Check cache first
                const cached = this.getCachedGAData();
                if (cached) {
                    return cached.totalVisitors;
                }

                // Fetch from Google Apps Script endpoint
                const response = await fetch(this.gaEndpoint);
                const data = await response.json();

                if (data.success && data.data) {
                    // Cache the data
                    this.setCachedGAData(data.data);
                    return data.data.totalVisitors;
                }
            } catch (error) {
                console.log('GA fetch failed, using fallback:', error);
            }
        }

        // Fallback: Use time-based estimation
        const launchDate = new Date('2024-07-01'); // Lab establishment date
        const now = new Date();
        const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));

        // UPDATE THESE based on your actual GA data:
        // Go to GA4 > Reports > Acquisition > User acquisition
        const baseCount = 1500; // Your actual total users from GA
        const dailyGrowth = 5; // Your average daily new users

        // Calculate current count
        let currentCount = baseCount + (daysSinceLaunch * dailyGrowth);

        // Add realistic daily variation
        const hoursToday = now.getHours();
        const minutesToday = now.getMinutes();
        const dailyVariation = Math.floor((hoursToday * 60 + minutesToday) / 144);
        currentCount += dailyVariation;

        return currentCount;
    }

    getCachedGAData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < this.cacheExpiry) {
                    return data;
                }
            }
        } catch (e) {
            console.error('Cache read error:', e);
        }
        return null;
    }

    setCachedGAData(data) {
        try {
            const cacheData = {
                ...data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (e) {
            console.error('Cache write error:', e);
        }
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    createWidget(count, isFooter = false) {
        const widget = document.createElement('div');
        widget.className = isFooter ? 'visitor-widget-footer' : 'visitor-widget-floating';
        widget.style.border = 'none';
        widget.style.background = 'transparent';
        widget.style.boxShadow = 'none';
        widget.innerHTML = `
            <div class="visitor-content" style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                background: linear-gradient(135deg, #44475a, #282a36);
                border-radius: 8px;
                border: 1px solid rgba(189, 147, 249, 0.3);
                outline: none;
                color: #bd93f9;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            " onmouseover="
                this.style.background='linear-gradient(135deg, #bd93f9, rgba(189, 147, 249, 0.9))';
                this.style.color='white';
                this.style.transform='translateY(-2px)';
                this.style.boxShadow='0 0 15px rgba(189, 147, 249, 0.5), 0 6px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                this.style.border='1px solid rgba(189, 147, 249, 0.3)';
            " onmouseout="
                this.style.background='linear-gradient(135deg, #44475a, #282a36)';
                this.style.color='#bd93f9';
                this.style.transform='translateY(0)';
                this.style.boxShadow='none';
                this.style.border='1px solid rgba(189, 147, 249, 0.3)';
            ">
                <i class="fas fa-eye"></i>
                <span class="visitor-count" style="
                    font-weight: bold;
                    margin: 0 4px;
                " data-count="${count}">${this.formatNumber(count)}</span>
                <span class="visitor-label">visitors</span>
            </div>
        `;
        return widget;
    }
    
    async init(elementId, isFooter = false) {
        this.displayElement = document.getElementById(elementId);
        if (!this.displayElement) return;
        
        const count = await this.getVisitorCount();
        if (count) {
            const widget = this.createWidget(count, isFooter);
            this.displayElement.appendChild(widget);
            
            // Animate the counter
            this.animateCounter(widget.querySelector('.visitor-count'), count);
        }
    }
    
    animateCounter(element, finalCount) {
        const duration = 2000;
        const steps = 50;
        const increment = finalCount / steps;
        let current = finalCount - 50; // Start from a bit below to show animation
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalCount) {
                current = finalCount;
                clearInterval(timer);
            }
            element.textContent = this.formatNumber(Math.floor(current));
        }, duration / steps);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const counter = new LabVisitorCounter();
    const footerElement = document.getElementById('visitor-counter-footer');
    if (footerElement) {
        counter.init('visitor-counter-footer', true);
    } else {
        counter.init('visitor-counter', false);
    }
});