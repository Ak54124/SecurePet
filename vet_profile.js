// Modal Functionality
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('show');

            // Pre-fill edit form when opening edit modal
            if (modalId === 'editModal') {
                document.getElementById('bio').value = document.getElementById('profile-bio').textContent;
                document.getElementById('specializations').value = document.getElementById('profile-specializations').textContent;
                document.getElementById('email').value = document.getElementById('profile-email').textContent.replace(/^.*\]/, '');
                document.getElementById('phone').value = document.getElementById('profile-phone').textContent.replace(/^.*\]/, '');
                document.getElementById('address').value = document.getElementById('profile-address').textContent.replace(/^.*\]/, '');
                document.getElementById('hours').value = document.getElementById('profile-hours').textContent;
            }
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('show');
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modals = document.getElementsByClassName('modal');
            for (let modal of modals) {
                if (event.target === modal) {
                    modal.classList.remove('show');
                }
            }
        }

        // Photo Upload Handler
        document.getElementById('photoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('photo');
            const file = fileInput.files[0];
        
            if (file) {
                // File size validation (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File is too large. Maximum size is 5MB.');
                    return;
                }
        
                // File type validation
                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!validTypes.includes(file.type)) {
                    alert('Invalid file type. Please upload JPG, PNG, or GIF.');
                    return;
                }
        
                // Create FileReader to preview and upload
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Update profile photo preview
                    const profilePhoto = document.querySelector('.profile-photo');
                    profilePhoto.src = event.target.result;
                    
                    // Prepare file for upload
                    uploadProfilePicture(file);
                };
                reader.readAsDataURL(file);
            }
        });
        
        function uploadProfilePicture(file) {
            // Create FormData to send file to server
            const formData = new FormData();
            formData.append('profile_picture', file);
        
            // Send to server using fetch
            fetch('upload_profile_picture.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update profile picture URL in database
                    alert('Profile picture uploaded successfully!');
                } else {
                    // Handle upload error
                    alert('Failed to upload profile picture: ' + data.message);
                    // Revert to default image
                    document.querySelector('.profile-photo').src = 'images/default-profile.jpg';
                }
            })
            .catch(error => {
                console.error('Upload error:', error);
                alert('An error occurred while uploading the profile picture.');
            });
        }
        

        // Video Upload Handler
        document.getElementById('videoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const videoUrl = document.getElementById('videoUrl').value.trim();

            // Basic YouTube URL validation
            const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
            if (!youtubeRegex.test(videoUrl)) {
                alert('Please enter a valid YouTube URL');
                return;
            }

            // Update video container
            const videoContainer = document.querySelector('.video-container');
            videoContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="${convertToEmbedUrl(videoUrl)}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
                <button class="video-btn" onclick="openModal('videoModal')">
                    <i class="fas fa-video"></i>
                    Update Video
                </button>
            `;
            closeModal('videoModal');
        });

        // Profile Edit Handler
        document.getElementById('editProfileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update profile sections
            document.getElementById('profile-bio').textContent = document.getElementById('bio').value;
            document.getElementById('profile-specializations').textContent = document.getElementById('specializations').value;
            document.getElementById('profile-email').innerHTML = `<i class="fas fa-envelope"></i>${document.getElementById('email').value}`;
            document.getElementById('profile-phone').innerHTML = `<i class="fas fa-phone"></i>${document.getElementById('phone').value}`;
            document.getElementById('profile-address').innerHTML = `<i class="fas fa-location-dot"></i>${document.getElementById('address').value}`;
            document.getElementById('profile-hours').textContent = document.getElementById('hours').value;

            closeModal('editModal');
        });

        // Helper function to convert YouTube watch URL to embed URL
        function convertToEmbedUrl(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);

            if (match && match[2].length === 11) {
                return `https://www.youtube.com/embed/${match[2]}`;
            } else {
                alert('Invalid YouTube URL');
                return '';
            }
        }
