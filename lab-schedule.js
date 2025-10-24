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

// Simplified time format for display
function formatTime(time) {
    // Show just the hour for most times
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');

    if (hour === 12) return '12p';  // Noon
    if (hour === 8) return '8a';    // 8 AM
    if (hour === 6 && isPM) return '6p';  // 6 PM

    // For others, just show the number with a/p
    if (isPM) {
        return hour === 12 ? '12p' : `${hour}p`;
    } else {
        return `${hour}a`;
    }
}

// Data structure to store availability
let availabilityData = {};
let studentColorMap = {};


// Extract first name only from full name
function getFirstName(fullName) {
    if (!fullName) return 'Unknown';
    // Split by space and take first part
    const parts = fullName.trim().split(/\s+/);
    return parts[0];
}

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
        const fullName = row.student_name || row.first_name || 'Unknown';
        const firstName = getFirstName(fullName);

        if (availabilityData[day] && availabilityData[day][time]) {
            availabilityData[day][time].count++;
            availabilityData[day][time].names.push(firstName);
        }
    });
}

// Color palette for student pills - Pastel
const colors = ['lavender', 'sky', 'mint', 'rose', 'peach', 'coral', 'lemon', 'lilac'];

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Assign colors to students
function assignStudentColors(randomize = false) {
    // Get all unique students
    const allStudents = new Set();
    weekdays.forEach(day => {
        timeSlots.forEach(time => {
            availabilityData[day][time].names.forEach(name => allStudents.add(name));
        });
    });

    // Use shuffled or original colors
    const colorPalette = randomize ? shuffleArray(colors) : colors;

    // Assign colors
    studentColorMap = {};
    Array.from(allStudents).forEach((student, index) => {
        studentColorMap[student] = colorPalette[index % colorPalette.length];
    });
}

// Build the heatmap grid HTML with student name pills
function buildHeatmapGrid() {
    const gridBody = document.getElementById('grid-body');
    gridBody.innerHTML = '';

    // Assign colors if not already done
    if (Object.keys(studentColorMap).length === 0) {
        assignStudentColors(false);
    }

    timeSlots.forEach(time => {
        const row = document.createElement('tr');

        // Time column (simplified format)
        const timeCell = document.createElement('td');
        timeCell.textContent = formatTime(time);
        timeCell.classList.add('time-cell');
        row.appendChild(timeCell);

        // Day columns
        weekdays.forEach(day => {
            const cell = document.createElement('td');
            const data = availabilityData[day][time];
            const names = data.names;

            cell.classList.add('schedule-cell');

            // Create pills for each student
            if (names.length > 0) {
                const pillContainer = document.createElement('div');
                pillContainer.classList.add('student-pills');

                names.forEach(name => {
                    const pill = document.createElement('div');
                    pill.classList.add('student-pill', `pill-${studentColorMap[name]}`);
                    pill.textContent = name.charAt(0); // Just first letter
                    pill.title = name; // Show full name on hover
                    pillContainer.appendChild(pill);
                });

                cell.appendChild(pillContainer);
            } else {
                cell.classList.add('empty-cell');
            }

            row.appendChild(cell);
        });

        gridBody.appendChild(row);
    });
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

    // Convert to array and sort alphabetically (no competition!)
    const studentArray = Object.entries(studentSlots)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // No students available
    if (studentArray.length === 0) {
        statsContainer.innerHTML = '<p style="color: var(--comment); text-align: center;">No availability data yet</p>';
        return;
    }

    // Create floating bubbles for each student
    studentArray.forEach((student) => {
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'student-bubble';

        // Get color from the global color map (same as cells)
        const colorClass = studentColorMap[student.name] || 'lavender';

        // Define color values for the bubble border
        const colorValues = {
            'lavender': 'rgba(200, 162, 255, 1)',
            'sky': 'rgba(135, 206, 250, 1)',
            'mint': 'rgba(152, 251, 152, 1)',
            'rose': 'rgba(255, 182, 193, 1)',
            'peach': 'rgba(255, 218, 185, 1)',
            'coral': 'rgba(255, 160, 122, 1)',
            'lemon': 'rgba(255, 250, 205, 1)',
            'lilac': 'rgba(221, 160, 221, 1)'
        };

        const borderColor = colorValues[colorClass] || colorValues['lavender'];

        bubbleDiv.innerHTML = `
            <div class="student-bubble-circle" style="border-color: ${borderColor}">
                <span style="color: ${borderColor}">${student.name.charAt(0)}</span>
            </div>
            <div class="student-bubble-name">${student.name}</div>
        `;

        // Add click event to bubble for highlighting
        bubbleDiv.addEventListener('click', () => {
            selectStudent(student.name);
        });

        statsContainer.appendChild(bubbleDiv);
    });
}

// Track selected student
let selectedStudent = null;

// Select and highlight a student's schedule
function selectStudent(studentName) {
    selectedStudent = studentName;

    // Show details card
    const detailsCard = document.getElementById('student-details-card');
    detailsCard.classList.remove('hidden');

    // Update student name in card
    document.getElementById('selected-student-name').textContent = studentName;

    // Calculate and display schedule breakdown
    displayScheduleBreakdown(studentName);

    // Highlight pills in grid
    highlightStudentInGrid(studentName);

    // Scroll to details card smoothly
    detailsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display schedule breakdown with day/time ranges and total hours
function displayScheduleBreakdown(studentName) {
    const breakdownContainer = document.getElementById('student-schedule-breakdown');
    breakdownContainer.innerHTML = '';

    // Group time slots by day
    const schedule = {};
    let totalSlots = 0;

    weekdays.forEach(day => {
        timeSlots.forEach(time => {
            const data = availabilityData[day][time];
            if (data.names.includes(studentName)) {
                if (!schedule[day]) {
                    schedule[day] = [];
                }
                schedule[day].push(time);
                totalSlots++;
            }
        });
    });

    // Create breakdown items for each day
    Object.entries(schedule).forEach(([day, times]) => {
        if (times.length === 0) return;

        const firstTime = times[0];
        const lastTime = times[times.length - 1];

        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.style.borderLeftColor = getStudentColor(studentName);

        item.innerHTML = `
            <span class="breakdown-day">${day}</span>
            <span class="breakdown-time">${firstTime} - ${lastTime}</span>
        `;

        breakdownContainer.appendChild(item);
    });

    // Calculate total hours (each slot is 1 hour)
    document.getElementById('total-hours').textContent = `${totalSlots} hours`;
}

// Get student's color from color map
function getStudentColor(studentName) {
    const colorClass = studentColorMap[studentName] || 'lavender';
    const colorValues = {
        'lavender': 'rgba(200, 162, 255, 1)',
        'sky': 'rgba(135, 206, 250, 1)',
        'mint': 'rgba(152, 251, 152, 1)',
        'rose': 'rgba(255, 182, 193, 1)',
        'peach': 'rgba(255, 218, 185, 1)',
        'coral': 'rgba(255, 160, 122, 1)',
        'lemon': 'rgba(255, 250, 205, 1)',
        'lilac': 'rgba(221, 160, 221, 1)'
    };
    return colorValues[colorClass];
}

// Highlight student pills in grid and fade others
function highlightStudentInGrid(studentName) {
    // Get all pills
    const allPills = document.querySelectorAll('.student-pill');
    const allCells = document.querySelectorAll('.schedule-cell');

    // Reset all cells
    allCells.forEach(cell => {
        cell.classList.remove('highlighted-cell');
    });

    // Process each pill
    allPills.forEach(pill => {
        // Compare using title attribute (full name) not textContent (just first letter)
        if (pill.title === studentName) {
            // Highlight matching pills
            pill.classList.add('highlighted');
            pill.classList.remove('faded');

            // Highlight parent cell
            const parentCell = pill.closest('.schedule-cell');
            if (parentCell) {
                parentCell.classList.add('highlighted-cell');
            }
        } else {
            // Fade non-matching pills
            pill.classList.remove('highlighted');
            pill.classList.add('faded');
        }
    });
}

// Clear selection
function clearSelection() {
    selectedStudent = null;

    // Hide details card
    document.getElementById('student-details-card').classList.add('hidden');

    // Remove all highlights and fades
    document.querySelectorAll('.student-pill').forEach(pill => {
        pill.classList.remove('highlighted', 'faded');
    });

    document.querySelectorAll('.schedule-cell').forEach(cell => {
        cell.classList.remove('highlighted-cell');
    });
}

// Add close button event listener when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentWeek();
    fetchAndDisplayData();

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        fetchAndDisplayData();
    });

    // Randomize colors button
    document.getElementById('randomize-colors-btn').addEventListener('click', () => {
        assignStudentColors(true);  // Randomize = true
        buildHeatmapGrid();
        buildStudentStats();
    });

    // Close details button
    document.getElementById('close-details').addEventListener('click', () => {
        clearSelection();
    });

    // Download calendar button
    document.getElementById('download-calendar-btn').addEventListener('click', () => {
        if (selectedStudent) {
            downloadCalendar(selectedStudent);
        }
    });
});

// Generate and download .ics calendar file
function downloadCalendar(studentName) {
    // Get next Monday to start the week
    const today = new Date();
    const monday = getMonday(today);

    // Build calendar events
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Cosme Lab//Lab Schedule//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:' + studentName + ' Lab Schedule',
        'X-WR-TIMEZONE:America/Los_Angeles'
    ];

    // Add events for each time slot
    weekdays.forEach((day, dayIndex) => {
        timeSlots.forEach(time => {
            const data = availabilityData[day][time];
            if (data.names.includes(studentName)) {
                // Calculate date for this day
                const eventDate = new Date(monday);
                eventDate.setDate(monday.getDate() + dayIndex);

                // Parse time to get hour
                const startHour = parseInt(time.split(':')[0]);
                const isPM = time.includes('PM');
                let hour24 = startHour;

                if (isPM && startHour !== 12) {
                    hour24 = startHour + 12;
                } else if (!isPM && startHour === 12) {
                    hour24 = 0;
                }

                // Create start and end times
                const startDate = new Date(eventDate);
                startDate.setHours(hour24, 0, 0);

                const endDate = new Date(startDate);
                endDate.setHours(hour24 + 1, 0, 0); // 1 hour duration

                // Format dates for ICS (YYYYMMDDTHHmmss)
                const formatICSDate = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
                };

                // Add event
                icsContent.push('BEGIN:VEVENT');
                icsContent.push('UID:' + Date.now() + '-' + dayIndex + '-' + hour24 + '@cosmelab.com');
                icsContent.push('DTSTAMP:' + formatICSDate(new Date()));
                icsContent.push('DTSTART:' + formatICSDate(startDate));
                icsContent.push('DTEND:' + formatICSDate(endDate));
                icsContent.push('SUMMARY:Lab Time - ' + studentName);
                icsContent.push('DESCRIPTION:Scheduled lab availability for ' + studentName);
                icsContent.push('LOCATION:Cosme Lab, UC Riverside');
                icsContent.push('STATUS:CONFIRMED');
                icsContent.push('END:VEVENT');
            }
        });
    });

    icsContent.push('END:VCALENDAR');

    // Create blob and download
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = studentName.replace(/\s+/g, '_') + '_Lab_Schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    // Show success message (you could make this fancier)
    alert('Calendar file downloaded! Import it into Google Calendar, Outlook, or Apple Calendar.');
}
