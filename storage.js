// Storage module - Handles all localStorage operations
const STORAGE_KEYS = {
    CHANNELS: 'iptvChannels',
    FAVORITES: 'iptvFavorites'
};

export const storage = {
    getChannels() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANNELS) || '[]');
    },

    saveChannels(channels) {
        localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
    },

    getFavorites() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    },

    saveFavorites(favorites) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    },

    clearAll() {
        localStorage.removeItem(STORAGE_KEYS.CHANNELS);
        localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    }
};