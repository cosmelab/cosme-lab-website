// Daily Lab Log - JavaScript
// Handles form submission, time calculations, and user authentication

// === CONFIGURATION ===
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGtxHqvl8GmRY6MK2pv6pzoA_rtIpo7kV5LFLAjLxP-B4EPnJZYEcH1fUdkAiRCL0yvw/exec';

// === DOM ELEMENTS ===
const form = document.getElementById('lab-log-form');
const emailInput = document.getElementById('student-email');
const nameInput = document.getElementById('student-name');
const dateInput = document.getElementById('work-date');
const timeInInput = document.getElementById('time-in');
const timeOutInput = document.getElementById('time-out');
const projectSelect = document.getElementById('project');
const accomplishmentsTextarea = document.getElementById('accomplishments');

const totalHoursDisplay = document.getElementById('total-hours');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const mainCard = document.querySelector('.main-card');

// Buttons
const useTodayBtn = document.getElementById('use-today');
const useCurrentTimeBtn = document.getElementById('use-current-time');
const newLogBtn = document.getElementById('new-log-btn');

// Success details
const successHours = document.getElementById('success-hours');
const successProject = document.getElementById('success-project');

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date by default
    setTodayDate();

    // Try to get user email from session (will be populated after UCR login)
    getUserEmail();

    // Set up event listeners
    setupEventListeners();
});

// === USER AUTHENTICATION ===
function getUserEmail() {
    // When deployed with "Execute as: User accessing the web app"
    // and "Who has access: Anyone in ucr.edu",
    // the Apps Script can get the user's email via Session.getActiveUser().getEmail()

    // For now, we'll get it from the backend after first interaction
    // The backend will send it back on the first request
    fetch(`${APPS_SCRIPT_URL}?action=getUserEmail`)
        .then(response => response.json())
        .then(data => {
            if (data.email) {
                emailInput.value = data.email;
                // Try to pre-fill name if available
                if (data.name) {
                    nameInput.value = data.name;
                }
            }
        })
        .catch(error => {
            console.log('Could not fetch user email:', error);
            // Email will be required on backend anyway due to UCR auth
        });
}

// === EVENT LISTENERS ===
function setupEventListeners() {
    // Use today's date button
    useTodayBtn.addEventListener('click', setTodayDate);

    // Use current time button
    useCurrentTimeBtn.addEventListener('click', setCurrentTime);

    // Calculate hours when time changes
    timeInInput.addEventListener('change', calculateTotalHours);
    timeOutInput.addEventListener('change', calculateTotalHours);

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // New log button
    newLogBtn.addEventListener('click', resetForm);
}

// === DATE/TIME FUNCTIONS ===
function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
}

function setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeOutInput.value = `${hours}:${minutes}`;
    calculateTotalHours();
}

function calculateTotalHours() {
    const timeIn = timeInInput.value;
    const timeOut = timeOutInput.value;

    if (!timeIn || !timeOut) {
        totalHoursDisplay.textContent = '0h 0m';
        return;
    }

    // Parse times
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);

    // Convert to minutes
    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    // Calculate difference
    let diffMinutes = outTotalMinutes - inTotalMinutes;

    // Handle overnight work (rare, but possible)
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Add 24 hours
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    totalHoursDisplay.textContent = `${hours}h ${minutes}m`;
}

// === FORM SUBMISSION ===
async function handleSubmit(e) {
    e.preventDefault();

    // Hide any previous errors
    hideError();

    // Validate form
    if (!form.checkValidity()) {
        showError('Please fill out all required fields.');
        return;
    }

    // Get form data
    const formData = {
        email: emailInput.value,
        name: nameInput.value,
        date: dateInput.value,
        time_in: timeInInput.value,
        time_out: timeOutInput.value,
        project: projectSelect.value,
        accomplishments: accomplishmentsTextarea.value
    };

    // Calculate hours for backend
    const hoursWorked = calculateHoursWorked(formData.time_in, formData.time_out);
    formData.hours_worked = hoursWorked;

    try {
        // Show loading state
        mainCard.classList.add('loading');

        // Submit to Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            showSuccess(formData);
        } else {
            showError(result.error || 'Failed to submit log. Please try again.');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        mainCard.classList.remove('loading');
    }
}

function calculateHoursWorked(timeIn, timeOut) {
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);

    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    let diffMinutes = outTotalMinutes - inTotalMinutes;
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
    }

    // Return as decimal hours
    return (diffMinutes / 60).toFixed(2);
}

// === UI FUNCTIONS ===
function showSuccess(formData) {
    // Hide form
    mainCard.classList.add('hidden');

    // Update success details
    const hours = Math.floor(parseFloat(formData.hours_worked));
    const minutes = Math.round((parseFloat(formData.hours_worked) - hours) * 60);
    successHours.textContent = `${hours}h ${minutes}m`;
    successProject.textContent = formData.project;

    // Show success message
    successMessage.classList.remove('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');

    // Scroll to error
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function resetForm() {
    // Hide success message
    successMessage.classList.add('hidden');

    // Show form
    mainCard.classList.remove('hidden');

    // Reset form fields (but keep email and name)
    dateInput.value = '';
    timeInInput.value = '';
    timeOutInput.value = '';
    projectSelect.value = '';
    accomplishmentsTextarea.value = '';
    totalHoursDisplay.textContent = '0h 0m';

    // Set today's date again
    setTodayDate();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
