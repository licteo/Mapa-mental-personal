// PrintService.js - Handles printing and report generation
export class PrintService {
    printReport(type, vehicleHistory) {
        const vehicles = type === 'all' 
            ? vehicleHistory 
            : vehicleHistory.filter(v => v.vehicleType === type);

        if (vehicles.length === 0) {
            // Notification will be handled by caller
            return false;
        }

        const printWindow = window.open('', '_blank');
        const title = type === 'all' ? 'Todos los Vehículos' : this.getVehicleTypeLabel(type);
        const currentDate = new Date().toLocaleString('es-CO');

        const tableRows = this.generateTableRows(vehicles);
        const htmlContent = this.generatePrintHTML(title, currentDate, tableRows, vehicles);

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        
        return true;
    }

    generateTableRows(vehicles) {
        return vehicles.map(vehicle => {
            const entryTime = new Date(vehicle.entryTime);
            const exitTime = new Date(vehicle.exitTime);
            const duration = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));

            return `
                <tr>
                    <td>${vehicle.plate}</td>
                    <td>${this.getVehicleTypeLabel(vehicle.vehicleType)}</td>
                    <td>${vehicle.company || vehicle.pintorName || '-'}</td>
                    <td>${vehicle.paymentType === 'mensual' ? 'Mensual' : 'Diario'}</td>
                    <td>${entryTime.toLocaleString('es-CO')}</td>
                    <td>${exitTime.toLocaleString('es-CO')}</td>
                    <td>${duration}h</td>
                    <td>$${vehicle.totalCost.toLocaleString()}</td>
                </tr>
            `;
        }).join('');
    }

    generatePrintHTML(title, currentDate, tableRows, vehicles) {
        const totalRevenue = vehicles.reduce((sum, v) => sum + v.totalCost, 0);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reporte de ${title}</title>
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 20px;
                    }
                    .title {
                        color: #2563eb;
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    .subtitle {
                        color: #666;
                        font-size: 14px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th {
                        background-color: #2563eb;
                        color: white;
                        font-weight: 600;
                    }
                    tr:nth-child(even) {
                        background-color: #f9fafb;
                    }
                    .summary {
                        margin-top: 30px;
                        padding: 20px;
                        background-color: #f3f4f6;
                        border-radius: 8px;
                    }
                    .summary-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-weight: 500;
                    }
                    .total {
                        font-size: 18px;
                        color: #059669;
                        border-top: 2px solid #059669;
                        padding-top: 10px;
                    }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="title">Reporte de ${title}</h1>
                    <p class="subtitle">Generado el ${currentDate}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Placa</th>
                            <th>Tipo</th>
                            <th>Empresa/Pintor</th>
                            <th>Pago</th>
                            <th>Fecha Entrada</th>
                            <th>Fecha Salida</th>
                            <th>Duración</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                
                <div class="summary">
                    <div class="summary-item">
                        <span>Total de vehículos:</span>
                        <span>${vehicles.length}</span>
                    </div>
                    <div class="summary-item">
                        <span>Total recaudado:</span>
                        <span class="total">$${totalRevenue.toLocaleString()}</span>
                    </div>
                </div>
            </body>
            </html>
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