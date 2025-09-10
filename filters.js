// Filters module - Handle filtering and search functionality
export class Filters {
    constructor() {
        this.searchTerm = '';
        this.categoryFilter = '';
        this.languageFilter = '';
        this.showOnlyFavorites = false;
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase();
    }

    setCategoryFilter(category) {
        this.categoryFilter = category;
    }

    setLanguageFilter(language) {
        this.languageFilter = language;
    }

    setShowOnlyFavorites(show) {
        this.showOnlyFavorites = show;
    }

    apply(channels, favorites) {
        return channels.filter((channel, index) => {
            const channelName = channel.name.toLowerCase();
            const isFavorite = favorites.includes(channel.name);

            let shouldShow = channelName.includes(this.searchTerm);
            
            if (this.showOnlyFavorites) {
                shouldShow = shouldShow && isFavorite;
            }
            if (this.categoryFilter) {
                shouldShow = shouldShow && channel.group === this.categoryFilter;
            }
            if (this.languageFilter) {
                shouldShow = shouldShow && channel.detectedLanguage === this.languageFilter;
            }

            return shouldShow;
        });
    }

    clear() {
        this.searchTerm = '';
        this.categoryFilter = '';
        this.languageFilter = '';
        this.showOnlyFavorites = false;
    }
}