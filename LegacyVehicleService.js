// LegacyVehicleService.js - Handles vehicle operations for legacy version
export class LegacyVehicleService {
    constructor() {
        this.dailyRates = {
            carro: 5000,
            moto: 2000,
            buseta: 6000,
            turbo: 8000,
            pintor: 3000
        };
    }

    createVehicle(vehicleData) {
        return {
            id: Date.now(),
            plate: vehicleData.plate,
            vehicleType: vehicleData.vehicleType,
            paymentType: vehicleData.paymentType,
            entryTime: new Date().toISOString(),
            company: vehicleData.company || null,
            pintorName: vehicleData.pintorName || null,
            monthlyPrice: vehicleData.monthlyPrice || null,
            personName: vehicleData.personName || null,
            paymentAmount: vehicleData.paymentAmount || null
        };
    }

    vehicleExists(vehicles, plate) {
        for (var i = 0; i < vehicles.length; i++) {
            if (vehicles[i].plate === plate) {
                return true;
            }
        }
        return false;
    }

    findVehicle(vehicles, vehicleId) {
        for (var i = 0; i < vehicles.length; i++) {
            if (vehicles[i].id === vehicleId) {
                return vehicles[i];
            }
        }
        return null;
    }

    moveToHistory(vehicle, cost) {
        return {
            id: vehicle.id,
            plate: vehicle.plate,
            vehicleType: vehicle.vehicleType,
            paymentType: vehicle.paymentType,
            entryTime: vehicle.entryTime,
            company: vehicle.company,
            pintorName: vehicle.pintorName,
            monthlyPrice: vehicle.monthlyPrice,
            personName: vehicle.personName,
            paymentAmount: vehicle.paymentAmount,
            exitTime: new Date().toISOString(),
            totalCost: cost,
            paid: true
        };
    }

    getVehicleTypeLabel(type) {
        var labels = {
            carro: 'Carro particular',
            moto: 'Moto',
            buseta: 'Buseta',
            turbo: 'Turbo',
            pintor: 'Pintor/Mecánico'
        };
        return labels[type] || type;
    }
}