export class PrintButtonsComponent {
    constructor() {
        this.container = document.getElementById('printButtons');
    }

    render() {
        this.container.innerHTML = `
            <h2 class="card-title">📄 Imprimir Reportes</h2>
            <div class="print-buttons-container">
                <button class="btn btn-primary" onclick="parkingManager.printReport('all')">
                    Imprimir Todo
                </button>
                <button class="btn btn-secondary" onclick="parkingManager.printReport('carro')">
                    Carros Particulares
                </button>
                <button class="btn btn-secondary" onclick="parkingManager.printReport('moto')">
                    Motos
                </button>
                <button class="btn btn-secondary" onclick="parkingManager.printReport('buseta')">
                    Busetas
                </button>
                <button class="btn btn-secondary" onclick="parkingManager.printReport('turbo')">
                    Turbos
                </button>
                <button class="btn btn-secondary" onclick="parkingManager.printReport('pintor')">
                    Pintores/Mecánicos
                </button>
            </div>
        `;
    }
}

