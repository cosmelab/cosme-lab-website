# Cosme Lab Website

Official website for the Cosme Lab at UC Riverside - Vector Biology & Mosquito Genomics Research

🔗 **Live Site**: [https://cosmelab.github.io/cosme-lab-website/](https://cosmelab.github.io/cosme-lab-website/)

## 🧬 About

The Cosme Lab investigates genetic mechanisms underlying insecticide resistance in disease-transmitting mosquitoes through genomics and computational approaches. Our research focuses on tracking resistance evolution, understanding vector competence, and developing sustainable protein alternatives.

## 🚀 Features

- **Responsive Design**: Dracula-themed interface optimized for all devices
- **Google Analytics**: Integrated tracking for visitor insights
- **Visitor Counter**: Real-time visitor tracking widget
- **SEO Optimized**: Sitemap, meta tags, and structured data
- **Containerized Development**: Docker setup for consistent development environment
- **CI/CD**: Automated deployment via GitHub Actions

## 💻 Development

### Using Docker (Recommended)

```bash
# Build and run the container
docker-compose up

# Access the site at http://localhost:8080
```

### Local Development

```bash
# Install live-server globally
npm install -g live-server

# Start the development server
live-server --port=8080

# Access the site at http://localhost:8080
```

### Using VS Code DevContainer

1. Open the project in VS Code
2. When prompted, click "Reopen in Container"
3. The development environment will be automatically configured

## 📂 Project Structure

```
cosme-lab-website/
├── index.html          # Homepage
├── research.html       # Research areas
├── publications.html   # Publications list
├── team.html          # Lab members
├── grants.html        # Active grants
├── news.html          # Lab news
├── teaching.html      # Teaching activities
├── service.html       # Professional service
├── join.html          # Open positions
├── contact.html       # Contact information
├── css/               # Stylesheets
│   ├── main.css       # Main styles
│   ├── components/    # Component styles
│   └── pages/         # Page-specific styles
├── js/                # JavaScript files
│   ├── main.js        # Main functionality
│   ├── analytics.js   # Google Analytics
│   └── visitor-counter.js  # Visitor counter
├── assets/            # Images and media
│   └── images/
├── .github/           # GitHub Actions
│   └── workflows/
└── .devcontainer/     # VS Code DevContainer config
```

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Theme**: Dracula color scheme
- **Analytics**: Google Analytics 4
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Development**: Docker, Live Server

## 📊 Analytics

The site includes Google Analytics (GA4) for tracking:
- Page views and user engagement
- Traffic sources and demographics
- Outbound clicks to journal publications
- Contact form submissions

## 🤝 Contributing

This is the official Cosme Lab website. For updates or corrections, please contact the lab directly.

## 📝 License

© 2025 Cosme Lab, UC Riverside. All rights reserved.

## 📧 Contact

**Cosme Lab**  
Department of Entomology  
University of California, Riverside  
  
Visit our [Contact Page](https://cosmelab.github.io/cosme-lab-website/contact.html) to get in touch.

---

*Built with 🦟 by the Cosme Lab*