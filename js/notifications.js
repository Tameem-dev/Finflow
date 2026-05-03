// ========== NOTIFICATION SYSTEM ==========

function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function saveUserNotifications(notifications) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return;
    const allNotifications = JSON.parse(localStorage.getItem('finflow_notifications')) || {};
    allNotifications[userEmail] = notifications;
    localStorage.setItem('finflow_notifications', JSON.stringify(allNotifications));
}

function loadUserNotifications() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return [];
    const allNotifications = JSON.parse(localStorage.getItem('finflow_notifications')) || {};
    return allNotifications[userEmail] || [];
}

function addNotification(title, message, type) {
    const notifications = loadUserNotifications();
    notifications.unshift({
        id: Date.now(),
        title: title,
        message: message,
        type: type,
        read: false,
        time: new Date().toLocaleString()
    });
    if (notifications.length > 50) notifications.pop();
    saveUserNotifications(notifications);
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const notifications = loadUserNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationCount');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function markAsRead(id) {
    let notifications = loadUserNotifications();
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveUserNotifications(notifications);
    updateNotificationBadge();
    renderNotificationsList();
}

function markAllAsRead() {
    let notifications = loadUserNotifications();
    notifications = notifications.map(n => ({ ...n, read: true }));
    saveUserNotifications(notifications);
    updateNotificationBadge();
    renderNotificationsList();
}

function deleteNotification(id) {
    let notifications = loadUserNotifications();
    notifications = notifications.filter(n => n.id !== id);
    saveUserNotifications(notifications);
    updateNotificationBadge();
    renderNotificationsList();
}

function renderNotificationsList() {
    const container = document.getElementById('notificationsList');
    if (!container) return;
    const notifications = loadUserNotifications();
    
    if (notifications.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.5)">No notifications yet</div>`;
        return;
    }
    
    container.innerHTML = notifications.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}">
            <div class="notif-icon ${n.type || 'info'}">
                <i class="ph ${n.type === 'warning' ? 'ph-warning' : n.type === 'achievement' ? 'ph-trophy' : 'ph-bell'}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title">${escapeHtml(n.title)}</div>
                <div class="notif-message">${escapeHtml(n.message)}</div>
                <div class="notif-time">${n.time}</div>
            </div>
            <div class="notif-actions">
                ${!n.read ? `<button class="notif-mark-read" onclick="markAsRead(${n.id})"><i class="ph ph-check"></i></button>` : ''}
                <button class="notif-delete" onclick="deleteNotification(${n.id})"><i class="ph ph-x"></i></button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initNotifications() {
    updateNotificationBadge();
    renderNotificationsList();
    
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (notificationDropdown) {
                notificationDropdown.classList.toggle('show');
                renderNotificationsList();
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (notificationDropdown && notificationBtn) {
            if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        }
    });
    
    const markAllBtn = document.getElementById('markAllReadBtn');
    if (markAllBtn) markAllBtn.addEventListener('click', markAllAsRead);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}