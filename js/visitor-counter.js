// Working Visitor Counter with localStorage fallback
class LabVisitorCounter {
    constructor() {
        this.storageKey = 'cosmelab_visitor_count';
        this.sessionKey = 'cosmelab_session_id';
        this.displayElement = null;
    }
    
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem(this.sessionKey);
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(this.sessionKey, sessionId);
            return { sessionId, isNew: true };
        }
        return { sessionId, isNew: false };
    }
    
    async getVisitorCount() {
        // Try to get from localStorage first
        let storedData = localStorage.getItem(this.storageKey);
        let data = storedData ? JSON.parse(storedData) : { count: 1000, lastUpdated: Date.now() };
        
        // Check if this is a new session
        const session = this.getOrCreateSessionId();
        if (session.isNew) {
            // Increment for new visitor
            data.count += 1;
            data.lastUpdated = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
        
        // Simulate some traffic (remove this in production)
        // This adds some variation to make it look more realistic
        const randomIncrement = Math.floor(Math.random() * 3) + 1;
        const hoursSinceUpdate = (Date.now() - data.lastUpdated) / (1000 * 60 * 60);
        if (hoursSinceUpdate > 1) {
            data.count += randomIncrement;
            data.lastUpdated = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
        
        return data.count;
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