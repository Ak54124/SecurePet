document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');

    // Show Modal Function
    window.showLoginModal = function(type) {
        const modal = document.getElementById('loginModal');
        const title = document.getElementById('loginTitle');
        const signupLink = document.querySelector('.signup-link a');
        
        if (type === 'vet') {
            title.textContent = 'Veterinarian Login';
            signupLink.href = 'vet_signup.html';  // For vets
        } else {
            title.textContent = 'Pet Owner Login';
            signupLink.href = 'sign_up.html';     // For users
        }
        
        modal.style.display = 'block';
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('fade-in');
        modal.style.display = 'none';
    }

    closeBtn.onclick = closeModal;

    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // Add validation
        if (!validateEmail(email)) {
            showError('Please enter a valid email');
            return;
        }

        // Simulate login - Replace with your actual login logic
        console.log('Login attempt:', { email, type: modal.dataset.userType });
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
            closeModal();
        }, 1500);
    });

    // Email validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Error handling
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
});