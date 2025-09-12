// MonthlyReportComponent.js - Dedicated monthly report component
export class MonthlyReportComponent {
    constructor(monthlyReportService) {
        this.monthlyReportService = monthlyReportService;
        this.container = document.getElementById('monthlyReportResults');
    }

    renderMonthlyReport(stats, selectedMonth) {
        const summaryContainer = document.getElementById('monthlySummary');
        const summaryHtml = this.generateSummaryHtml(stats);
        const pintoresHtml = this.generatePintoresHtml(stats.pintorStats);
        
        summaryContainer.innerHTML = summaryHtml + pintoresHtml + this.generatePrintButton(selectedMonth);
        this.container.classList.remove('hidden');
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
}

