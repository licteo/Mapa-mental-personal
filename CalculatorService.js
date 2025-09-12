// CalculatorService.js - Handles cost calculations
export class CalculatorService {
    constructor() {
        this.dailyRates = {
            carro: 5000,
            moto: 2000,
            buseta: 6000,
            turbo: 8000,
            pintor: 3000
        };
    }

    calculateCost(vehicle) {
        if (vehicle.paymentType === 'mensual') {
            return vehicle.monthlyPrice || 0;
        }

        // Use custom payment amount if provided
        if (vehicle.paymentAmount !== null && vehicle.paymentAmount !== undefined) {
            return vehicle.paymentAmount;
        }

        const hours = this.calculateHours(vehicle.entryTime);
        const days = Math.max(1, Math.ceil(hours / 24));
        const rate = this.dailyRates[vehicle.vehicleType] || 3000;

        return days * rate;
    }

    calculateHours(entryTime) {
        const entry = new Date(entryTime);
        const now = new Date();
        return Math.ceil((now - entry) / (1000 * 60 * 60));
    }

    calculateDuration(entryTime, exitTime) {
        const entry = new Date(entryTime);
        const exit = new Date(exitTime);
        return Math.ceil((exit - entry) / (1000 * 60 * 60));
    }
}