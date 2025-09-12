export class ActiveVehiclesComponent {
    constructor(calculatorService) {
        this.activeContainer = document.getElementById('activeVehicles');
        this.historyContainer = document.getElementById('historyVehicles');
        this.calculatorService = calculatorService;
    }

    renderActiveVehicles(vehicles) {
        if (vehicles.length === 0) {
            this.activeContainer.innerHTML = '<p class="empty-message">No hay vehículos activos</p>';
            return;
        }

        this.activeContainer.innerHTML = vehicles.map(vehicle => this.createActiveVehicleCard(vehicle)).join('');
    }

    renderHistory(vehicles) {
        if (vehicles.length === 0) {
            this.historyContainer.innerHTML = '<p class="empty-message">No hay vehículos en el historial</p>';
            return;
        }

        // Show only last 10 vehicles in history
        const recentVehicles = vehicles.slice(0, 10);
        this.historyContainer.innerHTML = recentVehicles.map(vehicle => this.createHistoryVehicleCard(vehicle)).join('');
    }

    createActiveVehicleCard(vehicle) {
        const cost = this.calculatorService.calculateCost(vehicle);
        const entryTime = new Date(vehicle.entryTime);
        const hours = this.calculatorService.calculateHours(vehicle.entryTime);

        return `
            <div class="vehicle-card">
                <div class="vehicle-info">
                    <div>
                        <div class="vehicle-plate">${vehicle.plate}</div>
                        <div class="vehicle-type">${this.getVehicleTypeLabel(vehicle.vehicleType)}</div>
                    </div>
                </div>
                <div class="vehicle-details">
                    <div class="detail-item">
                        <span class="detail-label">Entrada</span>
                        <span class="detail-value">${entryTime.toLocaleString('es-CO')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tiempo</span>
                        <span class="detail-value">${hours} horas</span>
                    </div>
                    ${vehicle.company ? `
                    <div class="detail-item">
                        <span class="detail-label">Empresa</span>
                        <span class="detail-value">${vehicle.company}</span>
                    </div>
                    ` : ''}
                    ${vehicle.pintorName ? `
                    <div class="detail-item">
                        <span class="detail-label">Pintor/Mecánico</span>
                        <span class="detail-value">${vehicle.pintorName}</span>
                    </div>
                    ` : ''}
                    ${vehicle.personName ? `
                    <div class="detail-item">
                        <span class="detail-label">Nombre</span>
                        <span class="detail-value">${vehicle.personName}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">Tipo de Pago</span>
                        <span class="detail-value">${vehicle.paymentType === 'mensual' ? 'Mensual' : 'Diario'}</span>
                    </div>
                </div>
                <div class="total-cost">Total: $${cost.toLocaleString()}</div>
                <div class="vehicle-actions">
                    <button class="btn btn-success" onclick="parkingManager.exitVehicle(${vehicle.id})">
                        Registrar Salida
                    </button>
                </div>
            </div>
        `;
    }

    createHistoryVehicleCard(vehicle) {
        const entryTime = new Date(vehicle.entryTime);
        const exitTime = new Date(vehicle.exitTime);
        const duration = this.calculatorService.calculateDuration(vehicle.entryTime, vehicle.exitTime);

        return `
            <div class="vehicle-card">
                <div class="vehicle-info">
                    <div>
                        <div class="vehicle-plate">${vehicle.plate}</div>
                        <div class="vehicle-type">${this.getVehicleTypeLabel(vehicle.vehicleType)}</div>
                    </div>
                </div>
                <div class="vehicle-details">
                    <div class="detail-item">
                        <span class="detail-label">Entrada</span>
                        <span class="detail-value">${entryTime.toLocaleString('es-CO')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Salida</span>
                        <span class="detail-value">${exitTime.toLocaleString('es-CO')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duración</span>
                        <span class="detail-value">${duration} horas</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Costo Total</span>
                        <span class="detail-value">$${vehicle.totalCost.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getVehicleTypeLabel(type) {
        const labels = {
            carro: 'Carro particular',
            moto: 'Moto',
            buseta: 'Buseta',
            turbo: 'Turbo',
            pintor: 'Pintor/Mecánico'
        };
        return labels[type] || type;
    }
}