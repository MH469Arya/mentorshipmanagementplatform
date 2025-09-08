// Future JavaScript for interactive features
console.log("Mentorship Platform script loaded.");

document.addEventListener('DOMContentLoaded', () => {
    // --- Registration Form Logic ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();

            // Store a flag in sessionStorage to indicate successful registration
            sessionStorage.setItem('registrationSuccess', 'true');

            // Redirect immediately to the home page
            window.location.href = 'index.html';
        });
    }

    // --- Login Form Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get the selected role
            const role = document.getElementById('role').value;

            // Define the destination page based on the role
            const destinationPage = `${role}.html`;

            // Redirect to the corresponding dashboard
            window.location.href = destinationPage;
        });
    }

    // --- Alert Logic on Page Load ---
    // Check if we need to show the registration success alert
    if (sessionStorage.getItem('registrationSuccess') === 'true') {
        showAlert('Registered Successfully!');
        // Remove the flag so the alert doesn't show again on refresh
        sessionStorage.removeItem('registrationSuccess');
    }
});

// --- Modal Logic for Mentor Dashboard ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('sessionModal');
    const btn = document.getElementById('newSessionBtn');
    const span = document.getElementsByClassName('close-button')[0];
    const sessionForm = document.getElementById('newSessionForm');

    // If these elements don't exist, do nothing (we are not on the mentor page)
    if (!modal || !btn || !span || !sessionForm) {
        return;
    }

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Handle form submission
    sessionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const agenda = document.getElementById('sessionAgenda').value;
        const date = new Date(document.getElementById('sessionDate').value);
        const time = document.getElementById('sessionTime').value;

        // Format date for display
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Create a new session card
        const cardList = document.querySelector('.dashboard-section .card-list');
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.innerHTML = `
            <h3>${agenda}</h3>
            <p>Date: ${formattedDate} at ${time}</p>
            <a href="#">View Details</a>
        `;
        cardList.appendChild(newCard);

        // Close the modal and reset the form
        modal.style.display = "none";
        this.reset();
    });
});

function showAlert(message) {
    // Ensure an alert container exists on the current page
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

    // Automatically remove the alert after a few seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500); // Remove from DOM after fade out
    }, 3000); // Alert visible for 3 seconds
}
