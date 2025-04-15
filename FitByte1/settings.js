document.addEventListener('DOMContentLoaded', function() {
    // Sample user data
    const userData = {
        profile: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            joinDate: '2024-01-01',
            timezone: 'UTC-5',
            units: 'metric',
            language: 'en'
        },
        preferences: {
            darkMode: true,
            notifications: {
                email: true,
                push: true,
                workout: true,
                goals: true,
                community: false
            },
            privacy: {
                showProfile: true,
                showProgress: true,
                showWorkouts: false
            }
        },
        stats: {
            workoutsCompleted: 45,
            totalTime: '38h 15m',
            averagePerWeek: '4.5',
            streakDays: 12
        }
    };

    // Initialize settings page
    loadUserProfile();
    loadUserPreferences();
    loadUserStats();
    setupEventListeners();
});

function loadUserProfile() {
    const profileSection = document.querySelector('.profile-section');
    profileSection.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <img src="${userData.profile.avatar}" alt="Profile Avatar">
                <button class="change-avatar-btn">
                    <i class="fas fa-camera"></i>
                </button>
            </div>
            <div class="profile-info">
                <h2>${userData.profile.name}</h2>
                <p>${userData.profile.email}</p>
                <span class="join-date">
                    <i class="fas fa-calendar"></i>
                    Member since ${formatDate(userData.profile.joinDate)}
                </span>
            </div>
        </div>
        <div class="profile-form">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" value="${userData.profile.name}">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" value="${userData.profile.email}">
            </div>
            <div class="form-group">
                <label for="timezone">Timezone</label>
                <select id="timezone">
                    <option value="UTC-5" ${userData.profile.timezone === 'UTC-5' ? 'selected' : ''}>
                        Eastern Time (UTC-5)
                    </option>
                    <!-- Add more timezone options -->
                </select>
            </div>
            <div class="form-group">
                <label for="units">Units</label>
                <select id="units">
                    <option value="metric" ${userData.profile.units === 'metric' ? 'selected' : ''}>
                        Metric (kg, km)
                    </option>
                    <option value="imperial" ${userData.profile.units === 'imperial' ? 'selected' : ''}>
                        Imperial (lbs, miles)
                    </option>
                </select>
            </div>
        </div>
    `;
}

function loadUserPreferences() {
    const preferencesSection = document.querySelector('.preferences-section');
    preferencesSection.innerHTML = `
        <div class="preference-group">
            <h3>Appearance</h3>
            <div class="preference-item">
                <span>Dark Mode</span>
                <label class="switch">
                    <input type="checkbox" id="darkMode" 
                        ${userData.preferences.darkMode ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
        <div class="preference-group">
            <h3>Notifications</h3>
            ${createNotificationToggles()}
        </div>
        <div class="preference-group">
            <h3>Privacy</h3>
            ${createPrivacyToggles()}
        </div>
    `;
}

function loadUserStats() {
    const statsSection = document.querySelector('.stats-section');
    statsSection.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <i class="fas fa-dumbbell"></i>
                <h4>Workouts Completed</h4>
                <span>${userData.stats.workoutsCompleted}</span>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <h4>Total Time</h4>
                <span>${userData.stats.totalTime}</span>
            </div>
            <div class="stat-card">
                <i class="fas fa-calendar-check"></i>
                <h4>Average per Week</h4>
                <span>${userData.stats.averagePerWeek}</span>
            </div>
            <div class="stat-card">
                <i class="fas fa-fire"></i>
                <h4>Current Streak</h4>
                <span>${userData.stats.streakDays} days</span>
            </div>
        </div>
    `;
}

function createNotificationToggles() {
    const notifications = userData.preferences.notifications;
    return Object.entries(notifications).map(([key, value]) => `
        <div class="preference-item">
            <span>${capitalizeFirst(key)} Notifications</span>
            <label class="switch">
                <input type="checkbox" id="notif_${key}" ${value ? 'checked' : ''}>
                <span class="slider round"></span>
            </label>
        </div>
    `).join('');
}

function createPrivacyToggles() {
    const privacy = userData.preferences.privacy;
    return Object.entries(privacy).map(([key, value]) => `
        <div class="preference-item">
            <span>Show ${capitalizeFirst(key.replace('show', ''))}</span>
            <label class="switch">
                <input type="checkbox" id="privacy_${key}" ${value ? 'checked' : ''}>
                <span class="slider round"></span>
            </label>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Profile form submission
    document.querySelector('.profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges();
    });

    // Preference changes
    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            savePreferenceChanges(this);
        });
    });

    // Avatar change
    document.querySelector('.change-avatar-btn').addEventListener('click', function() {
        // Implement avatar change functionality
        console.log('Change avatar clicked');
    });
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function saveProfileChanges() {
    // Implement profile save functionality
    showNotification('Profile updated successfully!', 'success');
}

function savePreferenceChanges(toggle) {
    // Implement preference save functionality
    showNotification('Preferences saved!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
} 