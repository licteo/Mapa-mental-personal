// App.js - Refactored to use NotificationStyles
import { StorageService } from './StorageService.js';
import { NotificationService } from './NotificationService.js';
import { PrintService } from './PrintService.js';
import { MonthlyReportService } from './MonthlyReportService.js';
import { CalculatorService } from './CalculatorService.js';
import { NotificationStyles } from './NotificationStyles.js';
import { ComponentManager } from './ComponentManager.js';
import { ParkingManager } from './ParkingManager.js';

export class App {
    constructor() {
        this.parkingManager = null;
        this.componentManager = null;
        this.services = {};
    }

    async initialize() {
        try {
            // Add notification styles
            NotificationStyles.addStyles();

            // Initialize services in order
            this.initializeServices();

            // Initialize components
            this.componentManager = new ComponentManager();
            this.componentManager.renderAll();

            // Initialize parking manager with all dependencies
            this.parkingManager = new ParkingManager(this.services);
            
            // Expose to global scope for HTML onclick handlers
            window.parkingManager = this.parkingManager;

            console.log('✅ Sistema de Parqueadero iniciado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            alert('Error al inicializar la aplicación: ' + error.message);
        }
    }

    initializeServices() {
        this.services.storage = new StorageService();
        this.services.notification = new NotificationService();
        this.services.print = new PrintService();
        this.services.monthlyReport = new MonthlyReportService(this.services.storage);
        this.services.calculator = new CalculatorService();
    }
}