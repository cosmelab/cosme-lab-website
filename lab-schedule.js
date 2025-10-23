// Lab Schedule Heatmap - Fetch and Display Availability Data
// Cosme Lab - Undergrad Research Scheduling

// Configuration - Your Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGtxHqvl8GmRY6MK2pv6pzoA_rtIpo7kV5LFLAjLxP-B4EPnJZYEcH1fUdkAiRCL0yvw/exec';

// Time slots and weekdays (must match poll)
const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Data structure to store availability
let availabilityData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentWeek();
    fetchAndDisplayData();

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        fetchAndDisplayData();
    });
});

// Display current week date
function displayCurrentWeek() {
    const today = new Date();
    const monday = getMonday(today);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const weekText = `${monday.toLocaleDateString('en-US', options)} - ${friday.toLocaleDateString('en-US', options)}`;

    document.getElementById('current-week').textContent = weekText;
}

// Get Monday of current week
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// Fetch data from Google Apps Script
async function fetchAndDisplayData() {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error-message');
    const gridBody = document.getElementById('grid-body');

    // Show loading
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    gridBody.innerHTML = '';

    try {
        // Fetch data from Apps Script
        const response = await fetch(APPS_SCRIPT_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch data');
        }

        // Process the data
        processAvailabilityData(result.data);

        // Hide loading, show grid
        loadingDiv.classList.add('hidden');

        // Build the heatmap grid
        buildHeatmapGrid();

        // Build student stats bars (WoW style)
        buildStudentStats();

        // Update last updated time
        document.getElementById('last-updated-time').textContent = new Date().toLocaleTimeString();

    } catch (error) {
        console.error('Error fetching data:', error);
        loadingDiv.classList.add('hidden');
        errorDiv.textContent = `Error loading schedule: ${error.message}. Please try again later.`;
        errorDiv.classList.remove('hidden');
    }
}

// Process raw data into structured format
function processAvailabilityData(data) {
    // Reset availability data
    availabilityData = {};

    // Initialize structure
    weekdays.forEach(day => {
        availabilityData[day] = {};
        timeSlots.forEach(time => {
            availabilityData[day][time] = {
                count: 0,
                names: []
            };
        });
    });

    // Process each row from Google Sheet
    data.forEach(row => {
        const day = row.day;
        const time = row.time;
        const name = row.student_name || row.first_name || 'Unknown';

        if (availabilityData[day] && availabilityData[day][time]) {
            availabilityData[day][time].count++;
            availabilityData[day][time].names.push(name);
        }
    });
}

// Build the heatmap grid HTML
function buildHeatmapGrid() {
    const gridBody = document.getElementById('grid-body');
    gridBody.innerHTML = '';

    timeSlots.forEach(time => {
        const row = document.createElement('tr');

        // Time column
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        // Day columns
        weekdays.forEach(day => {
            const cell = document.createElement('td');
            const data = availabilityData[day][time];
            const count = data.count;
            const names = data.names;

            // Set cell content (count)
            cell.textContent = count > 0 ? count : '';

            // Set color class based on count
            if (count === 0) {
                cell.classList.add('count-0');
            } else if (count <= 2) {
                cell.classList.add('count-1');
            } else if (count <= 4) {
                cell.classList.add('count-3');
            } else {
                cell.classList.add('count-5plus');
            }

            // Add tooltip with names on hover
            if (count > 0) {
                cell.addEventListener('mouseenter', (e) => {
                    showTooltip(e.target, names);
                });

                cell.addEventListener('mouseleave', (e) => {
                    hideTooltip(e.target);
                });
            }

            row.appendChild(cell);
        });

        gridBody.appendChild(row);
    });
}

// Show tooltip with student names
function showTooltip(cell, names) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';

    if (names.length === 1) {
        tooltip.textContent = names[0];
    } else {
        tooltip.textContent = names.join(', ');
    }

    cell.appendChild(tooltip);
}

// Hide tooltip
function hideTooltip(cell) {
    const tooltip = cell.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Build WoW-style student stats bars
function buildStudentStats() {
    const statsContainer = document.getElementById('student-stats');
    statsContainer.innerHTML = '';

    // Aggregate total slots per student
    const studentSlots = {};

    // Count all slots for each student across all days/times
    weekdays.forEach(day => {
        timeSlots.forEach(time => {
            const data = availabilityData[day][time];
            data.names.forEach(name => {
                if (!studentSlots[name]) {
                    studentSlots[name] = 0;
                }
                studentSlots[name]++;
            });
        });
    });

    // Convert to array and sort by slot count (descending)
    const studentArray = Object.entries(studentSlots)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // No students available
    if (studentArray.length === 0) {
        statsContainer.innerHTML = '<p style="color: var(--comment); text-align: center;">No availability data yet</p>';
        return;
    }

    // Calculate max for percentage
    const maxSlots = studentArray[0].count;

    // Color palette - Dracula + Magenta
    const colors = ['purple', 'cyan', 'green', 'pink', 'orange', 'magenta', 'red', 'yellow'];

    // Create bars for each student
    studentArray.forEach((student, index) => {
        const barDiv = document.createElement('div');
        barDiv.className = 'student-bar';

        // Calculate percentage
        const percentage = (student.count / maxSlots) * 100;

        // Assign color (cycle through palette)
        const colorClass = colors[index % colors.length];

        barDiv.innerHTML = `
            <div class="student-count-circle" style="color: var(--${colorClass})">
                ${student.count}
            </div>
            <div class="student-bar-container">
                <div class="student-bar-bg">
                    <div class="student-bar-fill color-${colorClass}" style="width: ${percentage}%">
                        <span class="student-bar-name">${student.name}</span>
                        <span class="student-bar-slots">${student.count} slot${student.count !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `;

        statsContainer.appendChild(barDiv);
    });
}
