
```javascript
// script.js - Legacy compatibility script
// This file is kept for backward compatibility but modern browsers will use ES6 modules

console.log('Legacy script loaded - ES6 modules not supported');

// Main entry point - compatible version without ES6 modules
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    try {
        // Create a global parkingManager object with traditional function syntax
        window.parkingManager = new LegacyParkingManager();
        window.parkingManager.init();

        // Add notification styles
        NotificationStyles.addStyles();

    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error al inicializar la aplicación: ' + error.message);
    }
}