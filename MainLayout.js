
```javascript
export class MainLayout {
    constructor() {
        this.mainContent = document.getElementById('appMain');
    }

    render() {
        this.mainContent.innerHTML = `
            <!-- Registration Form Card -->
            <section class="registration-form" id="registrationForm"></section>

            <!-- Active Vehicles Card -->
            <section class="card active-vehicles-card">
                <h2 class="card-title">Vehículos Activos</h2>
                <div id="activeVehicles" class="vehicles-list"></div>
            </section>

            <!-- History Card -->
            <section class="card history-card">
                <h2 class="card-title">Historial de Vehículos</h2>
                <div id="historyVehicles" class="vehicles-list"></div>
            </section>

            <!-- Print Buttons Card -->
            <section class="card print-card" id="printButtons"></section>

            <!-- Monthly Report Card -->
            <section class="card monthly-report-card">
                <h2 class="card-title">📊 Reporte Mensual</h2>
                <div class="form-group">
                    <label for="monthSelect" class="form-label">Seleccionar Mes</label>
                    <input type="month" id="monthSelect" class="form-input">
                </div>
                <div class="print-buttons">
                    <button class="btn btn-primary" onclick="parkingManager.generateMonthlyReport()">
                        Generar Reporte Mensual
                    </button>
                </div>
                <div id="monthlyReportResults" class="monthly-results hidden">
                    <h3 class="card-title">Resumen del Mes</h3>
                    <div id="monthlySummary" class="monthly-summary"></div>
                </div>
            </section>
        `;
    }
}