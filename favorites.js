// Favorites module - Handle favorite functionality
export class Favorites {
    constructor(storage) {
        this.storage = storage;
        this.favorites = this.storage.getFavorites();
    }

    toggle(channelName) {
        const index = this.favorites.indexOf(channelName);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(channelName);
        }
        
        this.storage.saveFavorites(this.favorites);
        return this.favorites;
    }

    isFavorite(channelName) {
        return this.favorites.includes(channelName);
    }

    getFavorites() {
        return this.favorites;
    }
}

