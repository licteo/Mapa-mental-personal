// StorageService.js - Handles all localStorage operations
export class StorageService {
    constructor() {
        this.ACTIVE_VEHICLES_KEY = 'activeVehicles';
        this.VEHICLE_HISTORY_KEY = 'vehicleHistory';
    }

    getActiveVehicles() {
        return JSON.parse(localStorage.getItem(this.ACTIVE_VEHICLES_KEY)) || [];
    }

    getVehicleHistory() {
        return JSON.parse(localStorage.getItem(this.VEHICLE_HISTORY_KEY)) || [];
    }

    saveActiveVehicles(vehicles) {
        localStorage.setItem(this.ACTIVE_VEHICLES_KEY, JSON.stringify(vehicles));
    }

    saveVehicleHistory(vehicles) {
        localStorage.setItem(this.VEHICLE_HISTORY_KEY, JSON.stringify(vehicles));
    }

    clearAllData() {
        localStorage.removeItem(this.ACTIVE_VEHICLES_KEY);
        localStorage.removeItem(this.VEHICLE_HISTORY_KEY);
    }
}

