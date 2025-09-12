// LegacyParkingManager.js - Refactored to use smaller, focused modules
import { LegacyStorageService } from './LegacyStorageService.js';
import { LegacyCalculatorService } from './LegacyCalculatorService.js';
import { LegacyNotificationService } from './LegacyNotificationService.js';
import { LegacyFormHandler } from './LegacyFormHandler.js';
import { LegacyVehicleService } from './LegacyVehicleService.js';
import { LegacyPrintService } from './LegacyPrintService.js';
import { LegacyMonthlyReportService } from './LegacyMonthlyReportService.js';
import { LegacyVehicleRenderer } from './LegacyVehicleRenderer.js';

export class LegacyParkingManager {
    constructor() {
        this.storageService = new LegacyStorageService();
        this.calculatorService = new LegacyCalculatorService();
        this.notificationService = new LegacyNotificationService();
        this.formHandler = new LegacyFormHandler(this);
        this.vehicleService = new LegacyVehicleService();
        this.printService = new LegacyPrintService();
        this.monthlyReportService = new LegacyMonthlyReportService();
        this.vehicleRenderer = new LegacyVehicleRenderer(this.calculatorService);
        
        this.activeVehicles = [];
        this.vehicleHistory = [];
    }

    init() {
        this.activeVehicles = this.storageService.getActiveVehicles();
        this.vehicleHistory = this.storageService.getVehicleHistory();
        this.renderActiveVehicles();
        this.renderHistory();
        this.formHandler.bindEvents();
    }

    registerEntry() {
        var vehicleData = this.formHandler.getFormData();
        
        if (!vehicleData.plate || !vehicleData.vehicleType || !vehicleData.paymentType) {
            this.notificationService.show('Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        if (vehicleData.paymentType === 'diario' && !vehicleData.paymentAmount) {
            this.notificationService.show('Por favor ingrese el monto del pago', 'error');
            return;
        }
        
        if (this.vehicleService.vehicleExists(this.activeVehicles, vehicleData.plate)) {
            this.notificationService.show('Ya existe un vehículo activo con esa placa', 'error');
            return;
        }
        
        var vehicle = this.vehicleService.createVehicle(vehicleData);
        this.activeVehicles.push(vehicle);
        this.saveData();
        this.renderActiveVehicles();
        this.formHandler.clearForm();
        this.notificationService.show('Vehículo registrado exitosamente', 'success');
    }

    exitVehicle(vehicleId) {
        var vehicle = this.vehicleService.findVehicle(this.activeVehicles, vehicleId);
        if (!vehicle) return;
        
        var cost = this.calculatorService.calculateCost(vehicle);
        var updatedVehicle = this.vehicleService.moveToHistory(vehicle, cost);
        
        this.vehicleHistory.unshift(updatedVehicle);
        this.activeVehicles = this.activeVehicles.filter(v => v.id !== vehicleId);
        
        this.saveData();
        this.renderActiveVehicles();
        this.renderHistory();
        
        this.notificationService.show('Vehículo ' + vehicle.plate + ' ha salido. Total: $' + cost.toLocaleString(), 'success');
    }

    renderActiveVehicles() {
        this.vehicleRenderer.renderActiveVehicles(this.activeVehicles);
    }

    renderHistory() {
        this.vehicleRenderer.renderHistory(this.vehicleHistory);
    }

    saveData() {
        this.storageService.saveActiveVehicles(this.activeVehicles);
        this.storageService.saveVehicleHistory(this.vehicleHistory);
    }

    printReport(type) {
        return this.printService.printReport(type, this.vehicleHistory);
    }

    generateMonthlyReport() {
        return this.monthlyReportService.generateMonthlyReport(this.vehicleHistory);
    }
}