// Utils module - Utility functions
export const utils = {
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrado:', registration);
                })
                .catch(error => {
                    console.log('Error al registrar ServiceWorker:', error);
                });
        }
    },

    handleKeyboardControls(event, changeChannel) {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                changeChannel(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                changeChannel(1);
                break;
        }
    }
};

