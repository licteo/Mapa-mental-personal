// MonthlyReportService.js - Refactored to use component
import { MonthlyReportComponent } from '../components/MonthlyReportComponent.js';

export class MonthlyReportService {
    constructor(storageService) {
        this.storageService = storageService;
        this.monthlyReportComponent = new MonthlyReportComponent(this);
    }

    generateReport(vehicleHistory) {
        const monthInput = document.getElementById('monthSelect');
        const selectedMonth = monthInput.value;

        if (!selectedMonth) {
            return false;
        }

        const monthlyVehicles = this.filterMonthlyVehicles(vehicleHistory, selectedMonth);

        if (monthlyVehicles.length === 0) {
            document.getElementById('monthlyReportResults').classList.add('hidden');
            return false;
        }

        const stats = this.calculateStats(monthlyVehicles);
        this.monthlyReportComponent.renderMonthlyReport(stats, selectedMonth);

        return true;
    }

    filterMonthlyVehicles(vehicles, selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        return vehicles.filter(vehicle => {
            const entryDate = new Date(vehicle.entryTime);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    calculateStats(vehicles) {
        const stats = {
            carro: 0,
            moto: 0,
            buseta: 0,
            turbo: 0,
            pintor: 0,
            total: vehicles.length,
            totalRevenue: 0,
            pintorStats: {}
        };

        vehicles.forEach(vehicle => {
            stats[vehicle.vehicleType]++;
            stats.totalRevenue += vehicle.totalCost;

            // Estadísticas específicas de pintores
            if (vehicle.vehicleType === 'pintor' && vehicle.pintorName) {
                stats.pintorStats[vehicle.pintorName] = (stats.pintorStats[vehicle.pintorName] || 0) + 1;
            }
        });

        return stats;
    }

    renderMonthlyReport(stats, selectedMonth) {
        const resultsContainer = document.getElementById('monthlySummary');

        const summaryHtml = this.generateSummaryHtml(stats);
        const pintoresHtml = this.generatePintoresHtml(stats.pintorStats);

        resultsContainer.innerHTML = summaryHtml + pintoresHtml + this.generatePrintButton(selectedMonth);
        document.getElementById('monthlyReportResults').classList.remove('hidden');
    }

    generateSummaryHtml(stats) {
        return `
            <div class="summary-card">
                <div class="summary-number">${stats.total}</div>
                <div class="summary-label">Total Vehículos</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${stats.carro}</div>
                <div class="summary-label">Carros Particulares</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${stats.moto}</div>
                <div class="summary-label">Motos</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${stats.buseta}</div>
                <div class="summary-label">Busetas</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${stats.turbo}</div>
                <div class="summary-label">Turbos</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${stats.pintor}</div>
                <div class="summary-label">Pintores/Mecánicos</div>
            </div>
            <div class="summary-card summary-card-total">
                <div class="summary-number">$${stats.totalRevenue.toLocaleString()}</div>
                <div class="summary-label">Total Recaudado</div>
            </div>
        `;
    }

    generatePintoresHtml(pintorStats) {
        if (Object.keys(pintorStats).length === 0) return '';

        const pintoresHtml = Object.entries(pintorStats)
            .sort((a, b) => b[1] - a[1])
            .map(([nombre, cantidad]) => `
                <div class="summary-card">
                    <div class="summary-number">${cantidad}</div>
                    <div class="summary-label">${nombre}</div>
                </div>
            `).join('');

        return `
            <div style="grid-column: 1 / -1; margin-top: 2rem;">
                <h4 style="color: var(--primary-blue); margin-bottom: 1rem; font-size: 1.2rem;">
                    📈 Pintores/Mecánicos más frecuentes
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${pintoresHtml}
                </div>
            </div>
        `;
    }

    generatePrintButton(selectedMonth) {
        return `
            <div style="grid-column: 1 / -1; text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="parkingManager.printMonthlyReport('${selectedMonth}')">
                    🖨️ Imprimir Reporte Mensual
                </button>
            </div>
        `;
    }

    printMonthlyReport(selectedMonth) {
        // This would be implemented in PrintService, but we need to expose it globally
        // For now, this is a placeholder that would be called from the main ParkingManager
        return this.generateMonthlyPrintReport(selectedMonth);
    }

    generateMonthlyPrintReport(selectedMonth) {
        // Implementation would be similar to PrintService but for monthly reports
        // This is a placeholder for the actual implementation
        return true;
    }
}