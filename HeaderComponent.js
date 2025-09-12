export class HeaderComponent {
    constructor() {
        this.headerElement = document.getElementById('appHeader');
    }

    render() {
        this.headerElement.innerHTML = `
            <h1 class="app-title">🅿️ Sistema de Parqueadero</h1>
            <p class="app-subtitle">Gestión inteligente de vehículos</p>
        `;
    }
}

