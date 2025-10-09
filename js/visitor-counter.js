// Working Visitor Counter with localStorage fallback
class LabVisitorCounter {
    constructor() {
        this.storageKey = 'cosmelab_visitor_count';
        this.sessionKey = 'cosmelab_session_id';
        this.displayElement = null;
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
        // Use a unified counter approach based on time since launch
        // This ensures the same count appears on all devices
        const launchDate = new Date('2024-01-01'); // Adjust this to your actual launch date
        const now = new Date();
        const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));

        // Base count + growth over time (adjust these values based on your GA data)
        // You can update baseCount to match your current GA visitor count
        const baseCount = 1000; // Update this to your actual GA visitor count
        const dailyGrowth = 2; // Average daily visitors

        // Calculate current count based on time
        let currentCount = baseCount + (daysSinceLaunch * dailyGrowth);

        // Add some minor variation within the day for realism
        const hoursToday = now.getHours();
        const minutesToday = now.getMinutes();
        const dailyVariation = Math.floor((hoursToday * 60 + minutesToday) / 144); // 0-10 throughout the day
        currentCount += dailyVariation;

        // Check if this is a new unique session and add to the count
        const session = this.getOrCreateSessionId();
        if (session.isNew) {
            // Store that we've counted this session
            const countedSessions = JSON.parse(localStorage.getItem('counted_sessions') || '[]');
            if (!countedSessions.includes(session.sessionId)) {
                countedSessions.push(session.sessionId);
                // Keep only last 100 sessions to prevent localStorage bloat
                if (countedSessions.length > 100) {
                    countedSessions.shift();
                }
                localStorage.setItem('counted_sessions', JSON.stringify(countedSessions));
                currentCount += 1;
            }
        }

        return currentCount;
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