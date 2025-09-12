// LegacyStorageService.js - Traditional storage service
export class LegacyStorageService {
    getActiveVehicles() {
        return JSON.parse(localStorage.getItem('activeVehicles')) || [];
    }

    getVehicleHistory() {
        return JSON.parse(localStorage.getItem('vehicleHistory')) || [];
    }

    saveActiveVehicles(vehicles) {
        localStorage.setItem('activeVehicles', JSON.stringify(vehicles));
    }

    saveVehicleHistory(vehicles) {
        localStorage.setItem('vehicleHistory', JSON.stringify(vehicles));
    }
}

