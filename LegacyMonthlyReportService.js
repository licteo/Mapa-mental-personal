
```javascript
// LegacyMonthlyReportService.js - Handles monthly report generation for legacy version
export class LegacyMonthlyReportService {
    generateMonthlyReport(vehicleHistory) {
        var monthInput = document.getElementById('monthSelect');
        var selectedMonth = monthInput.value;

        if (!selectedMonth) {
            return false;
        }

        var monthlyVehicles = this.filterMonthlyVehicles(vehicleHistory, selectedMonth);

        if (monthlyVehicles.length === 0) {
            document.getElementById('monthlyReportResults').classList.add('hidden');
            return false;
        }

        var stats = this.calculateMonthlyStats(monthlyVehicles);
        this.renderMonthlyReport(stats, selectedMonth);

        return true;
    }

    filterMonthlyVehicles(vehicles, selectedMonth) {
        var parts = selectedMonth.split('-');
        var year = parseInt(parts[0]);
        var month = parseInt(parts[1]);
        var startDate = new Date(year, month - 1, 1);
        var endDate = new Date(year, month, 0, 23, 59, 59);

        return vehicles.filter(function(vehicle) {
            var entryDate = new Date(vehicle.entryTime);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    calculateMonthlyStats(vehicles) {
        var stats = {
            carro: 0,
            moto: 0,
            buseta: 0,
            turbo: 0,
            pintor: 0,
            total: vehicles.length,
            totalRevenue: 0
        };

        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            stats[v.vehicleType]++;
            stats.totalRevenue += v.totalCost;
        }

        return stats;
    }

    renderMonthlyReport(stats, selectedMonth) {
        var resultsContainer = document.getElementById('monthlySummary');

        var html = '<div class=\"summary-card\"><div class=\"summary-number\">' + stats.total + '</div>';
        html += '<div class=\"summary-label\">Total Vehículos</div></div>';
        html += '<div class=\"summary-card\"><div class=\"summary-number\">' + stats.carro + '</div>';
        html += '<div class=\"summary-label\">Carros Particulares</div></div>';
        html += '<div class=\"summary-card\"><div class=\"summary-number\">' + stats.moto + '</div>';
        html += '<div class=\"summary-label\">Motos</div></div>';
        html += '<div class=\"summary-card\"><div class=\"summary-number\">' + stats.buseta + '</div>';
        html += '<div class=\"summary-label\">Busetas</div></div>';
        html += '<div class=\"summary-card\"><div class=\"summary-number\">' + stats.turbo + '</div>';
        html += '<div class=\"summary-label\">Turbos</div></div>';
        html += '<div class=\"summary-card\"><div class=\"summary-number\">' + stats.pintor + '</div>';
        html += '<div class=\"summary-label\">Pintores/Mecánicos</div></div>';
        html += '<div class=\"summary-card summary-card-total\"><div class=\"summary-number\">$' + stats.totalRevenue.toLocaleString() + '</div>';
        html += '<div class=\"summary-label\">Total Recaudado</div></div>';
        html += '<div style=\"grid-column: 1 / -1; text-align: center; margin-top: 2rem;\">';
        html += '<button class=\"btn btn-primary\" onclick=\"legacyParkingManager.printMonthlyReport(\\'' + selectedMonth + '\\')\">🖨️ Imprimir Reporte Mensual</button></div>';

        resultsContainer.innerHTML = html;
        document.getElementById('monthlyReportResults').classList.remove('hidden');
    }

    printMonthlyReport(selectedMonth) {
        return true;
    }
}