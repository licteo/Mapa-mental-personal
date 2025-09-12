// NotificationStyles.js - Handles notification styling
export class NotificationStyles {
    static addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                word-wrap: break-word;
            }
            .notification-error {
                background: #ef4444;
            }
            .notification-success {
                background: #10b981;
            }
            .notification-info {
                background: #3b82f6;
            }
        `;
        document.head.appendChild(style);
    }
}