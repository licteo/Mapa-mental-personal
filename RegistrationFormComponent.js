export class RegistrationFormComponent {
    constructor() {
        this.formElement = document.getElementById('registrationForm');
        this.bindEvents();
    }

    render() {
        this.formElement.innerHTML = `
            <h2 class="card-title">Registrar Entrada</h2>
            <form id="entryForm" class="form">
                <div class="form-group">
                    <label for="plate" class="form-label">Placa del Vehículo</label>
                    <input type="text" id="plate" class="form-input" placeholder="Ej: ABC123" required>
                </div>

                <div class="form-group">
                    <label for="vehicleType" class="form-label">Tipo de Vehículo</label>
                    <select id="vehicleType" class="form-select" required>
                        <option value="">Seleccione tipo</option>
                        <option value="carro">Carro particular</option>
                        <option value="moto">Moto</option>
                        <option value="buseta">Buseta</option>
                        <option value="turbo">Turbo</option>
                        <option value="pintor">Pintor/Mecánico</option>
                    </select>
                </div>

                <div id="personNameContainer" class="form-group">
                    <label for="personName" class="form-label">Nombre de la Persona</label>
                    <input type="text" id="personName" class="form-input" placeholder="Ingrese el nombre de la persona" required>
                </div>

                <div id="busetaOptions" class="form-group hidden">
                    <label for="busetaCompany" class="form-label">Empresa de Buseta</label>
                    <select id="busetaCompany" class="form-select">
                        <option value="">Seleccione empresa</option>
                        <option value="Lusitania">Lusitania</option>
                        <option value="San Juan">San Juan</option>
                        <option value="Unitransa">Unitransa</option>
                        <option value="Cotransa">Cotransa</option>
                        <option value="Flotax">Flotax</option>
                    </select>
                </div>

                <div id="pintorOptions" class="form-group hidden">
                    <label for="pintorName" class="form-label">Nombre del Pintor/Mecánico</label>
                    <select id="pintorName" class="form-select">
                        <option value="">Seleccione persona</option>
                        <option value="Don Iván">Don Iván</option>
                        <option value="Don Álvaro">Don Álvaro</option>
                        <option value="Don David">Don David</option>
                        <option value="Don Jon">Don Jon</option>
                        <option value="Don Pedro">Don Pedro</option>
                        <option value="Don Garavito">Don Garavito</option>
                        <option value="Don Lucho">Don Lucho</option>
                        <option value="Don Cristian">Don Cristian</option>
                        <option value="Don Miguel">Don Miguel</option>
                        <option value="Don Francisco">Don Francisco</option>
                        <option value="Moisés">Moisés</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="paymentType" class="form-label">Tipo de Pago</label>
                    <select id="paymentType" class="form-select" required>
                        <option value="">Seleccione tipo</option>
                        <option value="diario">Diario</option>
                        <option value="mensual">Mensual</option>
                    </select>
                </div>

                <div id="monthlyPriceContainer" class="form-group hidden">
                    <label for="monthlyPrice" class="form-label">Precio Mensual</label>
                    <input type="number" id="monthlyPrice" class="form-input" placeholder="Ingrese el precio mensual">
                </div>

                <div id="paymentAmountContainer" class="form-group">
                    <label for="paymentAmount" class="form-label">Monto del Pago</label>
                    <input type="number" id="paymentAmount" class="form-input" placeholder="Ingrese el monto del pago" value="0" required>
                </div>

                <button type="submit" class="btn btn-primary">Registrar Entrada</button>
            </form>
        `;
    }

    bindEvents() {
        // Form events will be handled by FormHandler
        // This component only handles rendering
    }
}