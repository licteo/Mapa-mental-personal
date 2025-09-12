// NotificationService.js - Handles user notifications
export class NotificationService {
    show(message, type = 'info') {
        const notification = this.createNotificationElement(message, type);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
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

        return notification;
    }
}

