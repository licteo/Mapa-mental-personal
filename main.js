// Main application entry point with proper module structure
import { App } from './modules/App.js';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});