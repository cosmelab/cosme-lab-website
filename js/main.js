// Mobile Bottom Navigation - REMOVED
// Keeping only the hamburger menu

// Toggle reproducibility story
function toggleReproducibilityStory() {
    const story = document.querySelector('.reproducibility-story');
    const btn = document.querySelector('.reproducibility-btn');
    
    if (story.style.display === 'none' || story.style.display === '') {
        story.style.display = 'block';
        story.style.marginTop = '20px';
        btn.innerHTML = '<i class="fas fa-times"></i> Close';
    } else {
        story.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-book-open"></i> Learn More';
    }
}

// Floating Mosquito Animation System
function initFloatingMosquitoes() {
    // Create floating mosquitoes
    function createFloatingMosquitoes() {
        // Check if mosquitoes already exist
        if (document.querySelectorAll('.floating-mosquito').length > 0) {
            return;
        }
        
        const mosquitoCount = 3; // Keep it subtle with just 3
        const container = document.body;
        
        console.log('Creating floating mosquitoes...');
        
        for (let i = 1; i <= mosquitoCount; i++) {
            const mosquitoDiv = document.createElement('div');
            mosquitoDiv.className = `floating-mosquito floating-mosquito-${i}`;
            mosquitoDiv.style.cssText = 'position: fixed; width: 50px; height: 50px; z-index: 9000;';
            
            const mosquitoImg = document.createElement('img');
            mosquitoImg.src = 'assets/images/mosquitoes/aedes_transparent_background.png';
            mosquitoImg.alt = '';
            mosquitoImg.onerror = function() {
                // If image fails to load, use a CSS-only mosquito
                this.style.display = 'none';
                mosquitoDiv.innerHTML = '<div style="width: 100%; height: 100%; background: radial-gradient(circle, rgba(189,147,249,0.8) 0%, rgba(139,233,253,0.6) 100%); border-radius: 50%;"></div>';
            };
            
            mosquitoDiv.appendChild(mosquitoImg);
            container.appendChild(mosquitoDiv);
            console.log(`Mosquito ${i} created and added to page`);
        }
    }
    
    // Initialize floating mosquitoes only on desktop
    if (window.innerWidth > 768) {
        createFloatingMosquitoes();
    }
    
    // Clean up on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const existingMosquitoes = document.querySelectorAll('.floating-mosquito');
            if (window.innerWidth <= 768) {
                existingMosquitoes.forEach(m => m.remove());
            } else if (existingMosquitoes.length === 0) {
                createFloatingMosquitoes();
            }
        }, 250);
    });
}

// Call it immediately and on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingMosquitoes);
} else {
    // DOM is already ready
    initFloatingMosquitoes();
}

// Also try with a delay to ensure everything is loaded
setTimeout(function() {
    if (document.querySelectorAll('.floating-mosquito').length === 0 && window.innerWidth > 768) {
        console.log('Attempting to create mosquitoes after delay...');
        initFloatingMosquitoes();
    }
}, 1000);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile bottom nav removed - using hamburger only
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translateY(8px)' : '';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translateY(-8px)' : '';
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
    
    // Add active class to current page link
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach(item => {
        if(item.getAttribute('href') === currentLocation.split('/').pop() || 
           (currentLocation === '/' && item.getAttribute('href') === 'index.html')) {
            item.classList.add('active');
        }
    });
    
    // Also add active class to quick links
    const quickLinks = document.querySelectorAll('.quick-links-minimal a');
    quickLinks.forEach(link => {
        if(link.getAttribute('href') === currentLocation.split('/').pop() || 
           (currentLocation === '/' && link.getAttribute('href') === 'index.html') ||
           (currentLocation.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(68, 71, 90, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '';
        navbar.style.backdropFilter = '';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            
            // Stagger animations for child elements
            const children = entry.target.querySelectorAll('.fade-in-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('fade-in-visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    
    // Parallax effect for images
    const parallaxElements = document.querySelectorAll('.parallax-img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const rate = el.dataset.parallaxRate || 0.5;
            const yPos = -(scrolled * rate);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Publication Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationCards = document.querySelectorAll('.pub-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter publications
                publicationCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                        card.classList.add('fade-in-visible');
                    } else {
                        const categories = card.getAttribute('data-categories');
                        if (categories && categories.includes(filter)) {
                            card.style.display = 'block';
                            card.classList.add('fade-in-visible');
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
});