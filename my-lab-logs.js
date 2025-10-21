// My Lab Logs - Student Dashboard
// Displays personalized lab log data filtered by UCR email

// === CONFIGURATION ===
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGtxHqvl8GmRY6MK2pv6pzoA_rtIpo7kV5LFLAjLxP-B4EPnJZYEcH1fUdkAiRCL0yvw/exec';

// === DOM ELEMENTS ===
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const dashboardContent = document.getElementById('dashboard-content');
const userEmailDisplay = document.getElementById('user-email-display');

// Stats
const totalHoursEl = document.getElementById('total-hours');
const totalSessionsEl = document.getElementById('total-sessions');
const avgHoursEl = document.getElementById('avg-hours');
const lastVisitEl = document.getElementById('last-visit');

// Project breakdown
const projectBreakdownEl = document.getElementById('project-breakdown');

// Table
const logsTableBody = document.getElementById('logs-table-body');
const noLogsMessage = document.getElementById('no-logs-message');

// Buttons
const refreshBtn = document.getElementById('refresh-btn');

// === STATE ===
let userEmail = '';
let logsData = [];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    refreshBtn.addEventListener('click', () => {
        loadDashboard();
    });
});

// === LOAD DASHBOARD ===
async function loadDashboard() {
    showLoading();

    try {
        // Fetch user's logs from Apps Script
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getMyLogs`);
        const data = await response.json();

        if (data.success) {
            userEmail = data.email;
            logsData = data.logs;

            displayDashboard();
        } else {
            showError(data.error || 'Failed to load your logs');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Network error. Please check your connection and try again.');
    }
}

// === DISPLAY DASHBOARD ===
function displayDashboard() {
    // Display user email
    userEmailDisplay.textContent = userEmail;

    if (logsData.length === 0) {
        // No logs yet
        dashboardContent.classList.remove('hidden');
        loadingState.classList.add('hidden');
        noLogsMessage.classList.remove('hidden');
        document.getElementById('logs-table').classList.add('hidden');

        // Zero stats
        totalHoursEl.textContent = '0h';
        totalSessionsEl.textContent = '0';
        avgHoursEl.textContent = '0h';
        lastVisitEl.textContent = 'Never';

        // No projects
        projectBreakdownEl.innerHTML = '<p style="color: var(--comment); text-align: center;">No projects yet</p>';

        return;
    }

    // Calculate stats
    const stats = calculateStats(logsData);

    // Display stats
    totalHoursEl.textContent = formatHours(stats.totalHours);
    totalSessionsEl.textContent = stats.totalSessions;
    avgHoursEl.textContent = formatHours(stats.avgHours);
    lastVisitEl.textContent = formatDate(stats.lastVisit);

    // Display project breakdown
    displayProjectBreakdown(stats.projectHours);

    // Display recent logs table
    displayLogsTable(logsData);

    // Show dashboard
    dashboardContent.classList.remove('hidden');
    loadingState.classList.add('hidden');
}

// === CALCULATE STATS ===
function calculateStats(logs) {
    let totalHours = 0;
    const totalSessions = logs.length;
    const projectHours = {};
    let lastVisit = null;

    logs.forEach(log => {
        // Sum hours
        const hours = parseFloat(log.hours_worked) || 0;
        totalHours += hours;

        // Group by project
        const project = log.project || 'Unknown';
        projectHours[project] = (projectHours[project] || 0) + hours;

        // Track last visit
        const logDate = new Date(log.date);
        if (!lastVisit || logDate > lastVisit) {
            lastVisit = logDate;
        }
    });

    const avgHours = totalSessions > 0 ? totalHours / totalSessions : 0;

    return {
        totalHours,
        totalSessions,
        avgHours,
        lastVisit,
        projectHours
    };
}

// === DISPLAY PROJECT BREAKDOWN ===
function displayProjectBreakdown(projectHours) {
    projectBreakdownEl.innerHTML = '';

    // Sort projects by hours (descending)
    const sortedProjects = Object.entries(projectHours)
        .sort((a, b) => b[1] - a[1]);

    sortedProjects.forEach(([project, hours]) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        projectItem.innerHTML = `
            <span class="project-name">${project}</span>
            <span class="project-hours">${formatHours(hours)}</span>
        `;

        projectBreakdownEl.appendChild(projectItem);
    });
}

// === DISPLAY LOGS TABLE ===
function displayLogsTable(logs) {
    logsTableBody.innerHTML = '';

    // Sort by date (most recent first)
    const sortedLogs = [...logs].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    // Show last 20 logs
    const recentLogs = sortedLogs.slice(0, 20);

    recentLogs.forEach(log => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${formatDate(log.date)}</td>
            <td>${log.time_in}</td>
            <td>${log.time_out}</td>
            <td>${formatHours(log.hours_worked)}</td>
            <td>${log.project}</td>
            <td title="${log.accomplishments}">${log.accomplishments}</td>
        `;

        logsTableBody.appendChild(row);
    });

    noLogsMessage.classList.add('hidden');
    document.getElementById('logs-table').classList.remove('hidden');
}

// === FORMATTING HELPERS ===
function formatHours(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    if (m === 0) {
        return `${h}h`;
    }
    return `${h}h ${m}m`;
}

function formatDate(dateString) {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// === UI STATE HELPERS ===
function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    dashboardContent.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
    loadingState.classList.add('hidden');
    dashboardContent.classList.add('hidden');
}
