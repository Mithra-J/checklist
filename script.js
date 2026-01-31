// February Task Scheduler - Main Script

// Configuration
const PLATFORMS = [
  { id: 'leetcode', name: 'LeetCode', icon: 'fab fa-java', color: '#f89820' },
  { id: 'gfg', name: 'GFG', icon: 'fas fa-code', color: '#2F8D46' },
  { id: 'codingNinja', name: 'Coding Ninja', icon: 'fas fa-laptop-code', color: '#FF6B6B' },
  { id: 'codechef', name: 'CodeChef', icon: 'fas fa-chart-line', color: '#7B3F00' },
  { id: 'duolingo', name: 'Duolingo', icon: 'fas fa-language', color: '#58CC02' },
  { id: 'mimo', name: 'Mimo', icon: 'fas fa-mobile-alt', color: '#8B5CF6' },
  { id: 'additionalCourse', name: 'Additional Course', icon: 'fas fa-graduation-cap', color: '#0EA5E9' }
];

const DAYS_IN_FEBRUARY = 28;
const CURRENT_YEAR = 2025;

// State management
let tasksState = {};
let currentView = 'table'; // 'table' or 'card'
let streak = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeState();
  renderTable();
  renderCards();
  updateStats();
  setupEventListeners();
  checkCurrentDate();
});

// Initialize tasks state from localStorage or create fresh
function initializeState() {
  const savedState = localStorage.getItem('februaryTasks');
  
  if (savedState) {
    tasksState = JSON.parse(savedState);
    // Calculate current streak
    streak = calculateStreak();
  } else {
    // Create fresh state for February
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // January is 0
    
    for (let day = 1; day <= DAYS_IN_FEBRUARY; day++) {
      const dateKey = `2025-02-${day.toString().padStart(2, '0')}`;
      const dateObj = new Date(CURRENT_YEAR, 1, day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const isFuture = (currentMonth < 2) || (currentMonth === 2 && day > currentDay);
      const isPast = (currentMonth > 2) || (currentMonth === 2 && day < currentDay);
      
      tasksState[dateKey] = {
        date: dateObj,
        isWeekend: isWeekend,
        dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        platforms: {}
      };
      
      // Initialize each platform status
      PLATFORMS.forEach(platform => {
        // If date is in the future, mark as "not due"
        if (isFuture) {
          tasksState[dateKey].platforms[platform.id] = 'not-due';
        } 
        // If date is today or in the past, mark as "pending"
        else if (isPast || day === currentDay) {
          tasksState[dateKey].platforms[platform.id] = 'pending';
        }
      });
    }
    
    saveState();
  }
}

// Calculate current streak of consecutive completed days
function calculateStreak() {
  let currentStreak = 0;
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  
  // Only calculate streak if we're in February
  if (todayMonth !== 2) return 0;
  
  // Check days backwards from today
  for (let day = todayDay; day >= 1; day--) {
    const dateKey = `2025-02-${day.toString().padStart(2, '0')}`;
    const dayData = tasksState[dateKey];
    
    if (!dayData) break;
    
    // Check if all platforms are completed for this day
    const allCompleted = PLATFORMS.every(platform => {
      return dayData.platforms[platform.id] === 'completed';
    });
    
    if (allCompleted) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
}

// Render the table view
function renderTable() {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  
  for (let day = 1; day <= DAYS_IN_FEBRUARY; day++) {
    const dateKey = `2025-02-${day.toString().padStart(2, '0')}`;
    const dayData = tasksState[dateKey];
    
    const row = document.createElement('tr');
    
    // Date cell
    const dateCell = document.createElement('td');
    dateCell.className = `date-cell ${dayData.isWeekend ? 'weekend' : ''}`;
    dateCell.textContent = `${dayData.dayOfWeek}, Feb ${day}`;
    row.appendChild(dateCell);
    
    // Platform cells
    PLATFORMS.forEach(platform => {
      const platformCell = document.createElement('td');
      platformCell.className = `platform-cell ${dayData.platforms[platform.id]}`;
      platformCell.dataset.date = dateKey;
      platformCell.dataset.platform = platform.id;
      platformCell.innerHTML = `<i class="${platform.icon}"></i>`;
      
      // Add tooltip
      platformCell.title = `${platform.name}: ${formatStatusText(dayData.platforms[platform.id])}`;
      
      platformCell.addEventListener('click', () => toggleTaskStatus(dateKey, platform.id));
      row.appendChild(platformCell);
    });
    
    // Day score cell
    const dayScoreCell = document.createElement('td');
    const dayScore = calculateDayScore(dateKey);
    dayScoreCell.className = `day-score-cell ${getScoreClass(dayScore)}`;
    dayScoreCell.textContent = `${dayScore}/${PLATFORMS.length}`;
    row.appendChild(dayScoreCell);
    
    tableBody.appendChild(row);
  }
}

// Render the card view
function renderCards() {
  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';
  
  for (let day = 1; day <= DAYS_IN_FEBRUARY; day++) {
    const dateKey = `2025-02-${day.toString().padStart(2, '0')}`;
    const dayData = tasksState[dateKey];
    const dayScore = calculateDayScore(dateKey);
    
    const card = document.createElement('div');
    card.className = `day-card ${dayData.isWeekend ? 'weekend' : ''}`;
    
    // Card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'day-card-header';
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'day-card-date';
    dateDiv.textContent = `${dayData.dayOfWeek}, Feb ${day}`;
    
    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'day-card-score';
    scoreDiv.textContent = `${dayScore}/${PLATFORMS.length}`;
    
    cardHeader.appendChild(dateDiv);
    cardHeader.appendChild(scoreDiv);
    card.appendChild(cardHeader);
    
    // Platform items
    const platformsDiv = document.createElement('div');
    platformsDiv.className = 'day-card-platforms';
    
    PLATFORMS.forEach(platform => {
      const platformItem = document.createElement('div');
      platformItem.className = `platform-item ${dayData.platforms[platform.id]}`;
      platformItem.dataset.date = dateKey;
      platformItem.dataset.platform = platform.id;
      
      platformItem.innerHTML = `
        <div class="platform-icon" style="color: ${platform.color}">
          <i class="${platform.icon}"></i>
        </div>
        <div class="platform-name">${platform.name}</div>
        <div class="platform-status">
          ${getStatusIcon(dayData.platforms[platform.id])}
        </div>
      `;
      
      platformItem.addEventListener('click', () => toggleTaskStatus(dateKey, platform.id));
      platformsDiv.appendChild(platformItem);
    });
    
    card.appendChild(platformsDiv);
    cardsContainer.appendChild(card);
  }
}

// Toggle task status between pending/completed/overdue
function toggleTaskStatus(dateKey, platformId) {
  const currentStatus = tasksState[dateKey].platforms[platformId];
  const dateObj = new Date(dateKey);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determine next status based on current status and date
  let nextStatus;
  
  if (currentStatus === 'completed') {
    nextStatus = 'pending';
  } else if (currentStatus === 'pending' || currentStatus === 'overdue' || currentStatus === 'not-due') {
    nextStatus = 'completed';
  }
  
  tasksState[dateKey].platforms[platformId] = nextStatus;
  
  // If marking as completed and date is in the past, check if it should be overdue
  if (nextStatus === 'completed' && dateObj < today) {
    // Check if all other tasks for this day are also completed
    const allCompleted = PLATFORMS.every(p => {
      return p.id === platformId || tasksState[dateKey].platforms[p.id] === 'completed';
    });
    
    if (!allCompleted) {
      tasksState[dateKey].platforms[platformId] = 'overdue';
    }
  }
  
  saveState();
  updateUI();
}

// Calculate score for a specific day
function calculateDayScore(dateKey) {
  const dayData = tasksState[dateKey];
  let score = 0;
  
  PLATFORMS.forEach(platform => {
    if (dayData.platforms[platform.id] === 'completed') {
      score++;
    }
  });
  
  return score;
}

// Get CSS class for score display
function getScoreClass(score) {
  const total = PLATFORMS.length;
  if (score === total) return 'high';
  if (score >= total / 2) return 'medium';
  return 'low';
}

// Get status icon for display
function getStatusIcon(status) {
  switch(status) {
    case 'completed': return '<i class="fas fa-check-circle"></i>';
    case 'pending': return '<i class="fas fa-clock"></i>';
    case 'overdue': return '<i class="fas fa-exclamation-circle"></i>';
    case 'not-due': return '<i class="fas fa-calendar"></i>';
    default: return '<i class="fas fa-question-circle"></i>';
  }
}

// Format status text for display
function formatStatusText(status) {
  const statusText = {
    'completed': 'Completed',
    'pending': 'Pending',
    'overdue': 'Overdue',
    'not-due': 'Not Due Yet'
  };
  
  return statusText[status] || 'Unknown';
}

// Update all UI elements
function updateUI() {
  renderTable();
  renderCards();
  updateStats();
}

// Update statistics display
function updateStats() {
  // Calculate completed tasks
  let completedTasks = 0;
  let totalTasks = 0;
  
  for (const dateKey in tasksState) {
    PLATFORMS.forEach(platform => {
      totalTasks++;
      if (tasksState[dateKey].platforms[platform.id] === 'completed') {
        completedTasks++;
      }
    });
  }
  
  // Update streak
  streak = calculateStreak();
  
  // Update DOM
  document.getElementById('completed-tasks').textContent = completedTasks;
  document.getElementById('total-tasks').textContent = totalTasks;
  document.getElementById('current-streak').textContent = streak;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  document.getElementById('completion-rate').textContent = completionRate;
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('februaryTasks', JSON.stringify(tasksState));
}

// Setup event listeners for buttons and controls
function setupEventListeners() {
  // Toggle between table and card view
  document.getElementById('toggle-view').addEventListener('click', function() {
    const tableView = document.getElementById('table-view');
    const cardView = document.getElementById('card-view');
    const toggleBtn = document.getElementById('toggle-view');
    
    if (currentView === 'table') {
      currentView = 'card';
      tableView.classList.remove('active');
      cardView.classList.add('active');
      toggleBtn.innerHTML = '<i class="fas fa-table"></i> Switch to Table View';
    } else {
      currentView = 'table';
      cardView.classList.remove('active');
      tableView.classList.add('active');
      toggleBtn.innerHTML = '<i class="fas fa-th-large"></i> Switch to Card View';
    }
  });
  
  // Reset all progress
  document.getElementById('reset-all').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('februaryTasks');
      location.reload();
    }
  });
  
  // Export progress
  document.getElementById('export-btn').addEventListener('click', function() {
    exportProgress();
  });
  
  // Month navigation buttons (disabled for this demo, but functional)
  document.getElementById('prev-month').addEventListener('click', function() {
    alert('January data would load here in a full application.');
  });
  
  document.getElementById('next-month').addEventListener('click', function() {
    alert('March data would load here in a full application.');
  });
}

// Check current date and highlight today
function checkCurrentDate() {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  
  // Only highlight if we're in February
  if (todayMonth === 2 && todayDay <= DAYS_IN_FEBRUARY) {
    const dateKey = `2025-02-${todayDay.toString().padStart(2, '0')}`;
    
    // Highlight today's row in table
    const rows = document.querySelectorAll('#table-body tr');
    if (rows[todayDay - 1]) {
      rows[todayDay - 1].style.backgroundColor = '#e8f4fc';
      rows[todayDay - 1].style.borderLeft = '4px solid #3498db';
    }
    
    // Highlight today's card
    const cards = document.querySelectorAll('.day-card');
    if (cards[todayDay - 1]) {
      cards[todayDay - 1].style.boxShadow = '0 5px 20px rgba(52, 152, 219, 0.3)';
      cards[todayDay - 1].style.borderLeft = '6px solid #e74c3c';
    }
  }
}

// Export progress as JSON
function exportProgress() {
  const dataStr = JSON.stringify(tasksState, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `february-tasks-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  // Show brief confirmation
  const exportBtn = document.getElementById('export-btn');
  const originalText = exportBtn.innerHTML;
  exportBtn.innerHTML = '<i class="fas fa-check"></i> Exported!';
  exportBtn.style.backgroundColor = '#2ecc71';
  
  setTimeout(() => {
    exportBtn.innerHTML = originalText;
    exportBtn.style.backgroundColor = '';
  }, 2000);
}

// Popup functionality
function showPopup() {
  const popupOverlay = document.getElementById('popup-overlay');
  popupOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const popupOverlay = document.getElementById('popup-overlay');
  popupOverlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close popup when clicking outside of it
document.getElementById('popup-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    closePopup();
  }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closePopup();
  }
});
