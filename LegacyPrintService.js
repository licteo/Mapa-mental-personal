
```javascript
// LegacyPrintService.js - Handles printing and report generation for legacy version
export class LegacyPrintService {
    printReport(type, vehicleHistory) {
        var vehicles = type === 'all' ? vehicleHistory : vehicleHistory.filter(function(v) {
            return v.vehicleType === type;
        });

        if (vehicles.length === 0) {
            return false;
        }

        var printWindow = window.open('', '_blank');
        var title = type === 'all' ? 'Todos los Vehículos' : this.getVehicleTypeLabel(type);
        var currentDate = new Date().toLocaleString('es-CO');

        var html = this.generatePrintHTML(title, currentDate, vehicles);
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();

        return true;
    }

    generatePrintHTML(title, currentDate, vehicles) {
        var html = '<html><head><title>Reporte de ' + title + '</title>';
        html += '<style>body{font-family:Arial,sans-serif;margin:20px;}';
        html += 'table{width:100%;border-collapse:collapse;margin-top:20px;}';
        html += 'th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px;}';
        html += 'th{background-color:#2563eb;color:white;}</style>';
        html += '</head><body>';
        html += '<h1>Reporte de ' + title + '</h1>';
        html += '<p>Generado el ' + currentDate + '</p>';
        html += '<table><thead><tr>';
        html += '<th>Placa</th><th>Tipo</th><th>Entrada</th><th>Salida</th><th>Valor</th>';
        html += '</tr></thead><tbody>';

        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            var entryTime = new Date(v.entryTime);
            var exitTime = new Date(v.exitTime);
            html += '<tr>';
            html += '<td>' + v.plate + '</td>';
            html += '<td>' + this.getVehicleTypeLabel(v.vehicleType) + '</td>';
            html += '<td>' + entryTime.toLocaleString('es-CO') + '</td>';
            html += '<td>' + exitTime.toLocaleString('es-CO') + '</td>';
            html += '<td>$' + v.totalCost.toLocaleString() + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table></body></html>';
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