// ComponentManager.js - Manages all UI components
import { HeaderComponent } from '../components/HeaderComponent.js';
import { RegistrationFormComponent } from '../components/RegistrationFormComponent.js';
import { ActiveVehiclesComponent } from '../components/ActiveVehiclesComponent.js';
import { PrintButtonsComponent } from '../components/PrintButtonsComponent.js';

export class ComponentManager {
    constructor() {
        this.components = {};
    }

    renderAll() {
        // Initialize and render all components
        this.components.header = new HeaderComponent();
        this.components.registrationForm = new RegistrationFormComponent();
        this.components.activeVehicles = new ActiveVehiclesComponent();
        this.components.printButtons = new PrintButtonsComponent();

        // Render components
        Object.values(this.components).forEach(component => {
            if (component.render) component.render();
        });
    }

    getComponent(name) {
        return this.components[name];
    }
}