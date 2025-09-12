// FormHandler.js - Handles form operations and validation
export class FormHandler {
    constructor(parkingManager) {
        this.parkingManager = parkingManager;
    }

    bindEvents() {
        const self = this;
        document.getElementById('entryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            self.parkingManager.registerEntry();
        });

        document.getElementById('vehicleType').addEventListener('change', (e) => {
            self.parkingManager.handleVehicleTypeChange(e.target.value);
        });

        document.getElementById('paymentType').addEventListener('change', (e) => {
            self.parkingManager.handlePaymentTypeChange(e.target.value);
        });
    }

    getFormData() {
        return {
            plate: document.getElementById('plate').value.toUpperCase().trim(),
            vehicleType: document.getElementById('vehicleType').value,
            paymentType: document.getElementById('paymentType').value,
            company: document.getElementById('busetaCompany').value || null,
            pintorName: document.getElementById('pintorName').value || null,
            monthlyPrice: document.getElementById('paymentType').value === 'mensual' 
                ? parseFloat(document.getElementById('monthlyPrice').value) 
                : null,
            personName: document.getElementById('personName').value || null,
            paymentAmount: document.getElementById('paymentType').value === 'diario' 
                ? parseFloat(document.getElementById('paymentAmount').value) 
                : null
        };
    }

    clearForm() {
        document.getElementById('entryForm').reset();
        document.getElementById('busetaOptions').classList.add('hidden');
        document.getElementById('pintorOptions').classList.add('hidden');
        document.getElementById('monthlyPriceContainer').classList.add('hidden');
    }

    handleVehicleTypeChange(vehicleType) {
        const busetaOptions = document.getElementById('busetaOptions');
        const pintorOptions = document.getElementById('pintorOptions');
        const personNameContainer = document.getElementById('personNameContainer');

        busetaOptions.classList.add('hidden');
        pintorOptions.classList.add('hidden');
        personNameContainer.classList.add('hidden');

        if (vehicleType === 'buseta') {
            busetaOptions.classList.remove('hidden');
        } else if (vehicleType === 'pintor') {
            pintorOptions.classList.remove('hidden');
        }

        // Show person name field for all vehicle types
        personNameContainer.classList.remove('hidden');
    }

    handlePaymentTypeChange(paymentType) {
        const monthlyPriceContainer = document.getElementById('monthlyPriceContainer');
        const paymentAmountContainer = document.getElementById('paymentAmountContainer');
        
        if (paymentType === 'mensual') {
            monthlyPriceContainer.classList.remove('hidden');
            document.getElementById('monthlyPrice').required = true;
            paymentAmountContainer.classList.add('hidden');
            document.getElementById('paymentAmount').required = false;
        } else {
            monthlyPriceContainer.classList.add('hidden');
            document.getElementById('monthlyPrice').required = false;
            paymentAmountContainer.classList.remove('hidden');
            document.getElementById('paymentAmount').required = true;
        }
    }
}