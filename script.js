console.log("Mentorship Platform script loaded.");

// --- Data Layer (using localStorage to simulate a database) ---

/**
 * Retrieves all sessions from localStorage.
 * @returns {Array} An array of session objects.
 */
function getSessions() {
    const sessions = localStorage.getItem('sessions');
    return sessions ? JSON.parse(sessions) : [];
}

/**
 * Saves all sessions to localStorage.
 * @param {Array} sessions - The array of session objects to save.
 */
function saveSessions(sessions) {
    localStorage.setItem('sessions', JSON.stringify(sessions));
}

/**
 * Adds a new session.
 * @param {object} session - The session object to add.
 */
function addSession(session) {
    const sessions = getSessions();
    sessions.push(session);
    saveSessions(sessions);
}

/**
 * Updates a session by its ID.
 * @param {string} sessionId - The ID of the session to update.
 * @param {object} updatedProperties - An object with the properties to update.
 */
function updateSession(sessionId, updatedProperties) {
    let sessions = getSessions();
    sessions = sessions.map(session => {
        if (session.id === sessionId) {
            return { ...session, ...updatedProperties };
        }
        return session;
    });
    saveSessions(sessions);
}

// --- Utility Functions ---

/**
 * Determines the status of a session based on its date and time.
 * @param {object} session - The session object.
 * @returns {string} The session status ('Completed', 'In Progress', or 'Upcoming').
 */
function getSessionStatus(session) {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const now = new Date();
    const sessionEnd = new Date(sessionDateTime.getTime() + 60 * 60 * 1000); // Assuming 1-hour sessions

    if (now > sessionEnd) {
        return 'Completed';
    } else if (now >= sessionDateTime && now <= sessionEnd) {
        return 'In Progress';
    } else {
        return 'Upcoming';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // --- General Page Logic ---
    handleRegistrationForm();
    handleLoginForm();
    showRegistrationAlert();

    // --- Page-Specific Logic ---
    const pathname = window.location.pathname.split('/').pop();
    if (pathname === 'mentor.html') {
        initializeMentorDashboard();
    } else if (pathname === 'mentee.html') {
        initializeMenteeDashboard();
    } else if (pathname === 'admin.html') {
        initializeAdminDashboard();
    }
});

function handleRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            sessionStorage.setItem('registrationSuccess', 'true');
            window.location.href = 'index.html';
        });
    }
}

function handleLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const role = document.getElementById('role').value;
            const destinationPage = `${role}.html`;
            window.location.href = destinationPage;
        });
    }
}

function showRegistrationAlert() {
    if (sessionStorage.getItem('registrationSuccess') === 'true') {
        showAlert('Registered Successfully!');
        sessionStorage.removeItem('registrationSuccess');
    }
}

// --- Mentor Dashboard Logic ---
function initializeMentorDashboard() {
    const modal = document.getElementById('sessionModal');
    const btn = document.getElementById('newSessionBtn');
    const span = document.getElementsByClassName('close-button')[0];
    const sessionForm = document.getElementById('newSessionForm');
    if (!modal || !btn || !span || !sessionForm) return;

    btn.onclick = () => modal.style.display = "block";
    span.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };

    sessionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newSession = {
            id: `sess_${Date.now()}`,
            agenda: document.getElementById('sessionAgenda').value,
            date: document.getElementById('sessionDate').value,
            time: document.getElementById('sessionTime').value,
            venue: document.getElementById('sessionVenue').value,
            guidelines: document.getElementById('sessionGuidelines').value,
            feedback: null,
            mentee: 'Alex (Example)' // In a real app, this would be selected
        };
        addSession(newSession);
        renderMentorSessions();
        modal.style.display = "none";
        this.reset();
        showAlert('Session created successfully!');
    });

    renderMentorSessions();
}

function renderMentorSessions() {
    const cardList = document.querySelector('#mentor-sessions .card-list');
    if (!cardList) return;
    cardList.innerHTML = ''; // Clear existing cards
    const sessions = getSessions();

    if (sessions.length === 0) {
        cardList.innerHTML = '<p>No sessions scheduled yet.</p>';
        return;
    }

    sessions.forEach(session => {
        const status = getSessionStatus(session);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-status status-${status.toLowerCase().replace(' ', '-')}">${status}</div>
            <h3>${session.agenda}</h3>
            <p><strong>Mentee:</strong> ${session.mentee}</p>
            <p><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()} at ${session.time}</p>
            <p><strong>Venue:</strong> ${session.venue}</p>
            ${session.feedback ? `<div class="feedback-display"><strong>Feedback:</strong> "${session.feedback}"</div>` : ''}
        `;
        cardList.appendChild(card);
    });
}

// --- Mentee Dashboard Logic ---
function initializeMenteeDashboard() {
    renderMenteeSessions();
}

function renderMenteeSessions() {
    const cardList = document.querySelector('#mentee-sessions .card-list');
    if (!cardList) return;
    cardList.innerHTML = '';
    const sessions = getSessions();

    if (sessions.length === 0) {
        cardList.innerHTML = '<p>You have no upcoming sessions.</p>';
        return;
    }

    sessions.forEach(session => {
        const status = getSessionStatus(session);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-status status-${status.toLowerCase().replace(' ', '-')}">${status}</div>
            <h3>${session.agenda}</h3>
            <p><strong>Mentor:</strong> John Doe (Example)</p>
            <p><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()} at ${session.time}</p>
            <p><strong>Venue:</strong> ${session.venue}</p>
            ${status === 'Completed' && !session.feedback ? `<div class="card-actions"><button class="cta-button" onclick="provideFeedback('${session.id}')">Give Feedback</button></div>` : ''}
            ${session.feedback ? `<div class="feedback-display"><strong>Your Feedback:</strong> "${session.feedback}"</div>` : ''}
        `;
        cardList.appendChild(card);
    });
}

function provideFeedback(sessionId) {
    const feedback = prompt('Please provide your feedback for the session:');
    if (feedback) {
        updateSession(sessionId, { feedback: feedback });
        renderMenteeSessions();
        showAlert('Thank you for your feedback!');
    }
}

// --- Admin Dashboard Logic ---
function initializeAdminDashboard() {
    const sessionList = document.getElementById('admin-session-list');
    if (!sessionList) return;
    sessionList.innerHTML = '';
    const sessions = getSessions();

    if (sessions.length === 0) {
        sessionList.innerHTML = '<tr><td colspan="5">No sessions have been created in the system.</td></tr>';
        return;
    }

    sessions.forEach(session => {
        const status = getSessionStatus(session);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${session.agenda}</td>
            <td>${session.mentee}</td>
            <td>${new Date(session.date).toLocaleDateString()} ${session.time}</td>
            <td><span class="status-badge status-${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
            <td>${session.feedback || 'N/A'}</td>
        `;
        sessionList.appendChild(row);
    });
}

// --- Generic UI Functions ---
function showAlert(message) {
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        document.body.appendChild(alertContainer);
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.textContent = message;

    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500); // Remove from DOM after fade out
    }, 3000); // Alert visible for 3 seconds
}

// Make functions globally accessible for inline event handlers
window.provideFeedback = provideFeedback;
