// LegacyNotificationService.js - Traditional notification service
export class LegacyNotificationService {
    show(message, type) {
        var notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;
        
        // Apply styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '0.5rem';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideInRight 0.3s ease-out';
        notification.style.maxWidth = '300px';
        notification.style.wordWrap = 'break-word';
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

