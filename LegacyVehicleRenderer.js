// LegacyVehicleRenderer.js - Handles vehicle UI rendering for legacy version
export class LegacyVehicleRenderer {
    constructor(calculatorService) {
        this.calculatorService = calculatorService;
    }

    renderActiveVehicles(vehicles) {
        var container = document.getElementById('activeVehicles');
        
        if (vehicles.length === 0) {
            container.innerHTML = '<p class="empty-message">No hay vehículos activos</p>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < vehicles.length; i++) {
            html += this.createActiveVehicleCard(vehicles[i]);
        }
        container.innerHTML = html;
    }

    createActiveVehicleCard(vehicle) {
        var cost = this.calculatorService.calculateCost(vehicle);
        var entryTime = new Date(vehicle.entryTime);
        var hours = this.calculatorService.calculateHours(vehicle.entryTime);
        
        var html = '<div class="vehicle-card">';
        html += '<div class="vehicle-info"><div>';
        html += '<div class="vehicle-plate">' + vehicle.plate + '</div>';
        html += '<div class="vehicle-type">' + this.getVehicleTypeLabel(vehicle.vehicleType) + '</div>';
        html += '</div></div>';
        html += '<div class="vehicle-details">';
        html += '<div class="detail-item"><span class="detail-label">Entrada</span>';
        html += '<span class="detail-value">' + entryTime.toLocaleString('es-CO') + '</span></div>';
        html += '<div class="detail-item"><span class="detail-label">Tiempo</span>';
        html += '<span class="detail-value">' + hours + ' horas</span></div>';
        
        if (vehicle.company) {
            html += '<div class="detail-item"><span class="detail-label">Empresa</span>';
            html += '<span class="detail-value">' + vehicle.company + '</span></div>';
        }
        if (vehicle.pintorName) {
            html += '<div class="detail-item"><span class="detail-label">Pintor/Mecánico</span>';
            html += '<span class="detail-value">' + vehicle.pintorName + '</span></div>';
        }
        if (vehicle.personName) {
            html += '<div class="detail-item"><span class="detail-label">Nombre</span>';
            html += '<span class="detail-value">' + vehicle.personName + '</span></div>';
        }
        
        html += '<div class="detail-item"><span class="detail-label">Tipo de Pago</span>';
        html += '<span class="detail-value">' + (vehicle.paymentType === 'mensual' ? 'Mensual' : 'Diario') + '</span></div>';
        html += '</div>';
        html += '<div class="total-cost">Total: $' + cost.toLocaleString() + '</div>';
        html += '<div class="vehicle-actions">';
        html += '<button class="btn btn-success" onclick="legacyParkingManager.exitVehicle(' + vehicle.id + ')">';
        html += 'Registrar Salida</button></div></div>';
        
        return html;
    }

    renderHistory(vehicles) {
        var container = document.getElementById('historyVehicles');
        
        if (vehicles.length === 0) {
            container.innerHTML = '<p class="empty-message">No hay vehículos en el historial</p>';
            return;
        }
        
        var html = '';
        var limit = Math.min(10, vehicles.length);
        for (var i = 0; i < limit; i++) {
            html += this.createHistoryVehicleCard(vehicles[i]);
        }
        container.innerHTML = html;
    }

    createHistoryVehicleCard(vehicle) {
        var entryTime = new Date(vehicle.entryTime);
        var exitTime = new Date(vehicle.exitTime);
        var duration = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));
        
        var html = '<div class="vehicle-card">';
        html += '<div class="vehicle-info"><div>';
        html += '<div class="vehicle-plate">' + vehicle.plate + '</div>';
        html += '<div class="vehicle-type">' + this.getVehicleTypeLabel(vehicle.vehicleType) + '</div>';
        html += '</div></div>';
        html += '<div class="vehicle-details">';
        html += '<div class="detail-item"><span class="detail-label">Entrada</span>';
        html += '<span class="detail-value">' + entryTime.toLocaleString('es-CO') + '</span></div>';
        html += '<div class="detail-item"><span class="detail-label">Salida</span>';
        html += '<span class="detail-value">' + exitTime.toLocaleString('es-CO') + '</span></div>';
        html += '<div class="detail-item"><span class="detail-label">Duración</span>';
        html += '<span class="detail-value">' + duration + ' horas</span></div>';
        html += '<div class="detail-item"><span class="detail-label">Costo Total</span>';
        html += '<span class="detail-value">$' + vehicle.totalCost.toLocaleString() + '</span></div>';
        html += '</div></div>';
        
        return html;
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