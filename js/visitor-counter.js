// Sophisticated Visitor Counter with GitHub API backend
class LabVisitorCounter {
    constructor() {
        this.apiUrl = 'https://api.countapi.xyz/hit/cosmelab-ucr/visits';
        this.displayElement = null;
    }
    
    async getVisitorCount() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            return data.value;
        } catch (error) {
            console.error('Error fetching visitor count:', error);
            return null;
        }
    }
    
    formatNumber(num) {
        // Add commas and format nicely
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    createWidget(count, isFooter = false) {
        const widget = document.createElement('div');
        widget.className = isFooter ? 'visitor-widget-footer' : 'visitor-widget-floating';
        widget.innerHTML = `
            <div class="visitor-content">
                <i class="fas fa-eye"></i>
                <span class="visitor-count" data-count="${count}">${this.formatNumber(count)}</span>
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
        let current = 0;
        
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
    // Check if element exists and initialize with appropriate mode
    const footerElement = document.getElementById('visitor-counter-footer');
    if (footerElement) {
        counter.init('visitor-counter-footer', true);
    } else {
        counter.init('visitor-counter', false);
    }
});