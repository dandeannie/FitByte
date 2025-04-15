document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    loadChallenges();
    loadLeaderboard();
    setupEventListeners();
});

function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    const samplePosts = [
        {
            id: 1,
            user: {
                name: 'Sarah Johnson',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                level: 'Gold'
            },
            content: 'Just completed my first marathon! 🏃‍♀️ Thanks to everyone in the community for the support and motivation!',
            image: 'marathon.jpg',
            likes: 156,
            comments: 23,
            timestamp: new Date(Date.now() - 3600000)
        },
        {
            id: 2,
            user: {
                name: 'Mike Chen',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
                level: 'Silver'
            },
            content: 'New personal best on deadlifts today! 💪 Remember: progress is progress, no matter how small.',
            likes: 89,
            comments: 12,
            timestamp: new Date(Date.now() - 7200000)
        }
        // Add more sample posts as needed
    ];

    postsContainer.innerHTML = samplePosts.map(post => createPostHTML(post)).join('');
}

function createPostHTML(post) {
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${post.user.avatar}" alt="${post.user.name}" class="user-avatar">
                <div class="post-user-info">
                    <div class="user-name-badge">
                        <h4>${post.user.name}</h4>
                        <span class="level-badge ${post.user.level.toLowerCase()}">${post.user.level}</span>
                    </div>
                    <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" onclick="handleLike(${post.id})">
                    <i class="fas fa-heart"></i> ${post.likes}
                </button>
                <button class="action-btn comment-btn" onclick="handleComment(${post.id})">
                    <i class="fas fa-comment"></i> ${post.comments}
                </button>
                <button class="action-btn share-btn" onclick="handleShare(${post.id})">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `;
}

function loadChallenges() {
    const challengesContainer = document.getElementById('challenges-container');
    const activeChallenges = [
        {
            id: 1,
            title: '30-Day Running Challenge',
            participants: 234,
            daysinset-inline-start: 15,
            progress: 50
        },
        {
            id: 2,
            title: 'Summer Weight Loss',
            participants: 189,
            daysinset-inline-start: 45,
            progress: 30
        }
    ];

    challengesContainer.innerHTML = activeChallenges.map(challenge => `
        <div class="challenge-card">
            <h4>${challenge.title}</h4>
            <div class="challenge-stats">
                <span><i class="fas fa-users"></i> ${challenge.participants}</span>
                <span><i class="fas fa-clock"></i> ${challenge.daysLeft} days left</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="inline-size: ${challenge.progress}%"></div>
            </div>
            <button class="join-challenge-btn">Join Challenge</button>
        </div>
    `).join('');
}

function loadLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard-container');
    const topUsers = [
        { name: 'Sarah Johnson', points: 2840, rank: 1 },
        { name: 'Mike Chen', points: 2720, rank: 2 },
        { name: 'Emma Wilson', points: 2650, rank: 3 }
    ];

    leaderboardContainer.innerHTML = topUsers.map(user => `
        <div class="leaderboard-item">
            <span class="rank">#${user.rank}</span>
            <span class="name">${user.name}</span>
            <span class="points">${user.points} pts</span>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Create post button
    document.querySelector('.create-post-btn').addEventListener('click', () => {
        document.getElementById('createPostModal').style.display = 'flex';
    });

    // Close modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('createPostModal').style.display = 'none';
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Implement filter functionality here
        });
    });
}

// Utility functions
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Event handlers
function handleLike(postId) {
    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
    const likeBtn = postCard.querySelector('.like-btn');
    likeBtn.classList.toggle('liked');
    // Implement like functionality
}

function handleComment(postId) {
    // Implement comment functionality
    console.log('Comment on post:', postId);
}

function handleShare(postId) {
    // Implement share functionality
    console.log('Share post:', postId);
} 