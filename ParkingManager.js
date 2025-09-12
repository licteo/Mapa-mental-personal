// ParkingManager.js - Main business logic coordinator
import { VehicleService } from './VehicleService.js';
import { FormHandler } from './FormHandler.js';
import { ActiveVehiclesComponent } from '../components/ActiveVehiclesComponent.js';

export class ParkingManager {
    constructor(services) {
        this.services = services;
        
        // Initialize data
        this.activeVehicles = this.services.storage.getActiveVehicles();
        this.vehicleHistory = this.services.storage.getVehicleHistory();
        
        // Initialize business services
        this.vehicleService = new VehicleService();
        this.formHandler = new FormHandler(this);
        
        // Initialize UI components with proper dependencies
        this.activeVehiclesComponent = new ActiveVehiclesComponent(this.services.calculator);
        
        this.init();
    }

    init() {
        this.formHandler.bindEvents();
        this.renderActiveVehicles();
        this.renderHistory();
    }

    handleVehicleTypeChange(vehicleType) {
        this.formHandler.handleVehicleTypeChange(vehicleType);
    }

    handlePaymentTypeChange(paymentType) {
        this.formHandler.handlePaymentTypeChange(paymentType);
    }

    registerEntry() {
        const vehicleData = this.formHandler.getFormData();
        
        // Validate required fields
        if (!vehicleData.plate || !vehicleData.vehicleType || !vehicleData.paymentType) {
            this.services.notification.show('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        if (vehicleData.paymentType === 'diario' && !vehicleData.paymentAmount) {
            this.services.notification.show('Por favor ingrese el monto del pago', 'error');
            return;
        }
        
        if (this.vehicleService.vehicleExists(this.activeVehicles, vehicleData.plate)) {
            this.services.notification.show('Ya existe un vehículo activo con esa placa', 'error');
            return;
        }

        const vehicle = this.vehicleService.createVehicle(vehicleData);
        this.activeVehicles.push(vehicle);
        this.saveData();
        this.renderActiveVehicles();
        this.formHandler.clearForm();
        this.services.notification.show('Vehículo registrado exitosamente', 'success');
    }

    exitVehicle(vehicleId) {
        const vehicle = this.vehicleService.findVehicle(this.activeVehicles, vehicleId);
        if (!vehicle) return;

        const cost = this.services.calculator.calculateCost(vehicle);
        const updatedVehicle = this.vehicleService.moveToHistory(vehicle, cost);
        
        this.vehicleHistory.unshift(updatedVehicle);
        this.activeVehicles = this.activeVehicles.filter(v => v.id !== vehicleId);
        
        this.saveData();
        this.renderActiveVehicles();
        this.renderHistory();
        
        this.services.notification.show(`Vehículo ${vehicle.plate} ha salido. Total: $${cost.toLocaleString()}`, 'success');
    }

    renderActiveVehicles() {
        this.activeVehiclesComponent.renderActiveVehicles(this.activeVehicles);
    }

    renderHistory() {
        this.activeVehiclesComponent.renderHistory(this.vehicleHistory);
    }

    saveData() {
        this.services.storage.saveActiveVehicles(this.activeVehicles);
        this.services.storage.saveVehicleHistory(this.vehicleHistory);
    }

    printReport(type = 'all') {
        const success = this.services.print.printReport(type, this.vehicleHistory);
        if (!success) {
            this.services.notification.show('No hay vehículos para imprimir en esta categoría', 'info');
        }
    }

    generateMonthlyReport() {
        const success = this.services.monthlyReport.generateReport(this.vehicleHistory);
        if (!success) {
            this.services.notification.show('No hay vehículos registrados en el mes seleccionado', 'info');
        }
    }
}