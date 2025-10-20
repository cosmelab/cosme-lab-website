// Lab Availability Poll - Interactive Grid
// Cosme Lab - Undergrad Research Scheduling

// Configuration
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxGtxHqvl8GmRY6MK2pv6pzoA_rtIpo7kV5LFLAjLxP-B4EPnJZYEcH1fUdkAiRCL0yvw/exec';

// Time slots (8 AM to 6 PM)
const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// State
let selectedCells = new Set();
let isDragging = false;
let dragMode = null; // 'select' or 'deselect'

// Initialize grid
function initializeGrid() {
    const gridBody = document.getElementById('grid-body');

    timeSlots.forEach(time => {
        const row = document.createElement('tr');

        // Time label
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        // Day cells
        weekdays.forEach((day, dayIndex) => {
            const cell = document.createElement('td');
            cell.dataset.day = day;
            cell.dataset.time = time;
            cell.dataset.id = `${dayIndex}-${timeSlots.indexOf(time)}`;

            // Mouse events for selection
            cell.addEventListener('mousedown', handleMouseDown);
            cell.addEventListener('mouseenter', handleMouseEnter);
            cell.addEventListener('mouseup', handleMouseUp);

            // Touch events for mobile
            cell.addEventListener('touchstart', handleTouchStart);
            cell.addEventListener('touchmove', handleTouchMove);
            cell.addEventListener('touchend', handleTouchEnd);

            row.appendChild(cell);
        });

        gridBody.appendChild(row);
    });
}

// Mouse event handlers
function handleMouseDown(e) {
    e.preventDefault();
    isDragging = true;

    const cellId = e.target.dataset.id;
    if (selectedCells.has(cellId)) {
        dragMode = 'deselect';
        deselectCell(e.target);
    } else {
        dragMode = 'select';
        selectCell(e.target);
    }
}

function handleMouseEnter(e) {
    if (!isDragging) return;

    if (dragMode === 'select') {
        selectCell(e.target);
    } else if (dragMode === 'deselect') {
        deselectCell(e.target);
    }
}

function handleMouseUp(e) {
    isDragging = false;
    dragMode = null;
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);

    if (cell && cell.dataset.id) {
        isDragging = true;
        const cellId = cell.dataset.id;

        if (selectedCells.has(cellId)) {
            dragMode = 'deselect';
            deselectCell(cell);
        } else {
            dragMode = 'select';
            selectCell(cell);
        }
    }
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);

    if (cell && cell.dataset.id) {
        if (dragMode === 'select') {
            selectCell(cell);
        } else if (dragMode === 'deselect') {
            deselectCell(cell);
        }
    }
}

function handleTouchEnd(e) {
    isDragging = false;
    dragMode = null;
}

// Cell selection
function selectCell(cell) {
    if (!cell.dataset.id) return;

    cell.classList.add('selected');
    selectedCells.add(cell.dataset.id);
    updateBlockCount();
}

function deselectCell(cell) {
    if (!cell.dataset.id) return;

    cell.classList.remove('selected');
    selectedCells.delete(cell.dataset.id);
    updateBlockCount();
}

// Update block count and check for consecutive hours
function updateBlockCount() {
    const count = selectedCells.size;
    document.getElementById('block-count').textContent = count;

    // Check for 3+ consecutive hours in any column
    const hasThreeConsecutive = checkConsecutiveHours();
    const warning = document.getElementById('consecutive-warning');

    if (count > 0 && !hasThreeConsecutive) {
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }
}

// Check if there are 3+ consecutive selected hours in any day
function checkConsecutiveHours() {
    for (let dayIndex = 0; dayIndex < weekdays.length; dayIndex++) {
        let consecutive = 0;

        for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
            const cellId = `${dayIndex}-${timeIndex}`;

            if (selectedCells.has(cellId)) {
                consecutive++;
                if (consecutive >= 3) {
                    return true;
                }
            } else {
                consecutive = 0;
            }
        }
    }
    return false;
}

// Clear all selections
function clearAll() {
    document.querySelectorAll('#availability-grid td.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    selectedCells.clear();
    updateBlockCount();
}

// Submit availability
async function submitAvailability() {
    const studentName = document.getElementById('student-name').value.trim();
    const studentEmail = document.getElementById('student-email').value.trim();
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('submit-message');

    // Validation
    if (!studentName) {
        messageDiv.textContent = 'Please enter your name';
        messageDiv.className = 'error';
        return;
    }

    if (!studentEmail) {
        messageDiv.textContent = 'Please enter your UCR email';
        messageDiv.className = 'error';
        return;
    }

    // Validate @ucr.edu email
    if (!studentEmail.endsWith('@ucr.edu')) {
        messageDiv.textContent = 'Please use your @ucr.edu email address';
        messageDiv.className = 'error';
        return;
    }

    if (selectedCells.size === 0) {
        messageDiv.textContent = 'Please select at least one time block';
        messageDiv.className = 'error';
        return;
    }

    // Prepare data
    const selections = [];
    selectedCells.forEach(cellId => {
        const [dayIndex, timeIndex] = cellId.split('-').map(Number);
        selections.push({
            day: weekdays[dayIndex],
            time: timeSlots[timeIndex],
            dayIndex: dayIndex,
            timeIndex: timeIndex
        });
    });

    const data = {
        studentName: studentName,
        studentEmail: studentEmail,
        selections: selections,
        timestamp: new Date().toISOString()
    };

    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    messageDiv.textContent = '';
    messageDiv.className = '';

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires this
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Show success message
        messageDiv.textContent = `Thank you, ${studentName}! Your availability has been submitted.`;
        messageDiv.className = 'success';

        // Disable further submissions
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted';
        document.getElementById('student-name').disabled = true;
        document.getElementById('student-email').disabled = true;
        document.querySelectorAll('#availability-grid td').forEach(cell => {
            cell.style.pointerEvents = 'none';
        });

    } catch (error) {
        console.error('Submission error:', error);
        messageDiv.textContent = 'Error submitting. Please try again or contact me.';
        messageDiv.className = 'error';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Availability';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();

    // Prevent text selection during drag
    document.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });

    // Stop dragging on mouse up anywhere
    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragMode = null;
    });

    // Button listeners
    document.getElementById('submit-btn').addEventListener('click', submitAvailability);
    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('Clear all selections?')) {
            clearAll();
        }
    });

    // Prevent context menu on grid
    document.getElementById('availability-grid').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
