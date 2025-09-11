// Main application class - Ties everything together
import Hls from 'hls.js';
import { storage } from './storage.js';
import { parser } from './parser.js';
import { Player } from './player.js';
import { UI } from './ui.js';
import { Favorites } from './favorites.js';
import { Filters } from './filters.js';
import { utils } from './utils.js';

class IPTVPlayer {
    constructor() {
        this.channels = storage.getChannels();
        this.currentChannel = null;
        this.favorites = new Favorites(storage);
        this.filters = new Filters();
        this.ui = new UI();
        this.player = null;
        this.filteredChannels = []; // Agregar esta propiedad
        
        this.init();
    }

    init() {
        this.ui.initializeElements();
        this.player = new Player(this.ui.elements.video);
        
        // Configurar callbacks
        this.player.onLoading = (show) => this.ui.showLoading(show);
        this.player.onError = (error) => this.handlePlayerError(error);
        
        // Hacer referencia global para acceso desde UI
        window.iptvPlayer = this;
        
        this.setupEventListeners();
        utils.registerServiceWorker();
        
        // Si hay canales guardados, renderizarlos inmediatamente
        if (this.channels.length > 0) {
            this.renderChannels();
            this.detectLanguagesAndCategories();
        }
        
        // Establecer volumen máximo
        this.ui.elements.video.volume = 1;
    }

    setupEventListeners() {
        // Botones principales
        this.ui.elements.loadChannelBtn.addEventListener('click', () => this.loadChannelFromUrl());
        this.ui.elements.loadListBtn.addEventListener('click', () => this.ui.elements.m3uFile.click());
        this.ui.elements.m3uFile.addEventListener('change', (e) => this.loadM3UFile(e.target.files[0]));
        this.ui.elements.searchInput.addEventListener('input', () => this.handleSearch());
        
        // Controles
        document.addEventListener('keydown', (e) => utils.handleKeyboardControls(e, (direction) => this.changeChannel(direction)));
        this.ui.elements.prevChannel?.addEventListener('click', () => this.changeChannel(-1));
        this.ui.elements.nextChannel?.addEventListener('click', () => this.changeChannel(1));
        this.ui.elements.favoriteCurrent?.addEventListener('click', () => this.toggleCurrentFavorite());
        
        // Video controls
        this.ui.elements.video.addEventListener('click', () => this.ui.toggleControls());
        this.ui.elements.video.addEventListener('mousemove', () => this.ui.showControls());
        
        // Limpiar lista
        document.getElementById('clearList')?.addEventListener('click', () => this.clearChannelList());
    }

    loadChannelFromUrl() {
        const url = this.ui.elements.channelUrl.value.trim();
        if (!url) return;
        
        this.player.playStream(url);
        this.ui.elements.channelUrl.value = '';
    }

    async loadM3UFile(file) {
        if (!file) return;
        
        const content = await file.text();
        this.channels = parser.parseM3U(content);
        this.channels = parser.detectLanguages(this.channels);
        
        storage.saveChannels(this.channels);
        this.renderChannels();
        this.detectLanguagesAndCategories();
    }

    detectLanguagesAndCategories() {
        const categories = parser.getCategories(this.channels);
        const languages = parser.getLanguages(this.channels);
        
        this.ui.renderFilters(categories, languages, () => this.applyFilters(), () => this.clearFilters());
        
        // Aplicar sincronización inicial de filtros
        setTimeout(() => this.applyFilters(), 100);
    }

    renderChannels() {
        this.filteredChannels = this.filters.apply(this.channels, this.favorites.getFavorites());
        this.ui.showChannelList(
            this.filteredChannels, 
            this.favorites.getFavorites(), 
            this.currentChannel,
            (index) => this.selectChannelFromFiltered(index, this.filteredChannels),
            (index) => this.toggleFavoriteFromFiltered(index, this.filteredChannels)
        );
    }

    selectChannelFromFiltered(filteredIndex, filteredChannels) {
        const actualChannel = filteredChannels[filteredIndex];
        const originalIndex = this.channels.findIndex(ch => ch === actualChannel);
        this.selectChannel(originalIndex);
    }

    toggleFavoriteFromFiltered(filteredIndex, filteredChannels) {
        const actualChannel = filteredChannels[filteredIndex];
        const originalIndex = this.channels.findIndex(ch => ch === actualChannel);
        this.toggleFavorite(originalIndex);
    }

    selectChannel(index) {
        this.currentChannel = index;
        this.ui.setActiveChannel(index);
        
        const channel = this.channels[index];
        this.ui.updateCurrentChannelInfo(channel, index, this.favorites.isFavorite(channel.name));
        
        // Agregar clase para indicar que hay canal activo
        document.querySelector('.video-container').classList.add('has-active-channel');
        
        if (channel && channel.url) {
            this.player.playStream(channel.url);
        }
    }

    changeChannel(direction) {
        if (this.filteredChannels.length === 0) return;
        
        const currentFilteredIndex = this.getCurrentFilteredIndex();
        const newIndex = (currentFilteredIndex + direction + this.filteredChannels.length) % this.filteredChannels.length;
        
        const actualChannel = this.filteredChannels[newIndex];
        const originalIndex = this.channels.findIndex(ch => ch === actualChannel);
        this.selectChannel(originalIndex);
    }

    getCurrentFilteredIndex() {
        if (this.currentChannel === null || this.filteredChannels.length === 0) return 0;
        
        const currentChannel = this.channels[this.currentChannel];
        return this.filteredChannels.findIndex(ch => ch === currentChannel);
    }

    toggleFavorite(index) {
        const channel = this.channels[index];
        this.favorites.toggle(channel.name);
        this.renderChannels();
    }

    toggleCurrentFavorite() {
        if (this.currentChannel !== null) {
            this.toggleFavorite(this.currentChannel);
        }
    }

    handleSearch() {
        this.filters.setSearchTerm(this.ui.elements.searchInput.value);
        this.applyFilters();
    }

    applyFilters() {
        const showOnlyFavorites = this.ui.elements.favoritesToggle?.checked || false;
        this.filters.setShowOnlyFavorites(showOnlyFavorites);
        
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        this.filters.setCategoryFilter(categoryFilter);
        
        const languageFilter = document.getElementById('languageFilter')?.value || '';
        this.filters.setLanguageFilter(languageFilter);
        
        // Sincronizar filtros: si se selecciona un idioma, actualizar categorías
        if (languageFilter) {
            const filteredByLang = this.channels.filter(ch => 
                ch.detectedLanguage === languageFilter
            );
            const availableCategories = parser.getCategories(filteredByLang);
            this.updateCategoryOptions(availableCategories);
        } else {
            // Si no hay filtro de idioma, mostrar todas las categorías
            const allCategories = parser.getCategories(this.channels);
            this.updateCategoryOptions(allCategories);
        }
        
        // Sincronizar filtros: si se selecciona una categoría, actualizar idiomas
        if (categoryFilter) {
            const filteredByCat = this.channels.filter(ch => 
                ch.group === categoryFilter
            );
            const availableLanguages = parser.getLanguages(filteredByCat);
            this.updateLanguageOptions(availableLanguages);
        } else {
            // Si no hay filtro de categoría, mostrar todos los idiomas
            const allLanguages = parser.getLanguages(this.channels);
            this.updateLanguageOptions(allLanguages);
        }
        
        this.renderChannels();
    }

    clearFilters() {
        this.filters.clear();
        this.ui.elements.searchInput.value = '';
        if (this.ui.elements.favoritesToggle) this.ui.elements.favoritesToggle.checked = false;
        
        // Restablecer todas las opciones de filtros
        this.detectLanguagesAndCategories();
        this.applyFilters();
    }

    clearChannelList() {
        if (confirm('¿Estás seguro de que quieres limpiar la lista de canales?')) {
            this.channels = [];
            storage.saveChannels([]);
            this.renderChannels();
            
            const existingFilters = document.querySelector('.filters-container');
            if (existingFilters) existingFilters.remove();
        }
    }

    handlePlayerError(error) {
        if (error === 'play-blocked') {
            this.ui.showError('La reproducción fue bloqueada. Por favor, haz clic en el video para reproducir.');
        } else {
            this.ui.showError('Error al cargar el stream');
        }
    }

    updateCategoryOptions(availableCategories) {
        const categorySelect = document.getElementById('categoryFilter');
        if (!categorySelect) return;
        
        const currentValue = categorySelect.value;
        const categoryCounts = this.getFilteredCategoryCounts(availableCategories);
        
        categorySelect.innerHTML = '<option value="">Todas las categorías</option>' +
            availableCategories.map(cat => 
                `<option value="${cat}" ${cat === currentValue ? 'selected' : ''}>${cat} (${categoryCounts[cat] || 0})</option>`
            ).join('');
    }

    updateLanguageOptions(availableLanguages) {
        const languageSelect = document.getElementById('languageFilter');
        if (!languageSelect) return;
        
        const currentValue = languageSelect.value;
        const languageCounts = this.getFilteredLanguageCounts(availableLanguages);
        
        languageSelect.innerHTML = '<option value="">Todos los idiomas</option>' +
            availableLanguages.map(lang => {
                const displayName = lang === 'Unknown' ? 'Desconocido' : lang;
                return `<option value="${lang}" ${lang === currentValue ? 'selected' : ''}>${displayName} (${languageCounts[lang] || 0})</option>`;
            }).join('');
    }

    getFilteredCategoryCounts(categories) {
        const counts = {};
        const languageFilter = this.filters.languageFilter;
        
        this.channels.forEach(channel => {
            if (languageFilter && channel.detectedLanguage !== languageFilter) return;
            
            const category = channel.group || 'Sin categoría';
            if (categories.includes(category)) {
                counts[category] = (counts[category] || 0) + 1;
            }
        });
        return counts;
    }

    getFilteredLanguageCounts(languages) {
        const counts = {};
        const categoryFilter = this.filters.categoryFilter;
        
        this.channels.forEach(channel => {
            if (categoryFilter && channel.group !== categoryFilter) return;
            
            const language = channel.detectedLanguage || 'Unknown';
            if (languages.includes(language)) {
                counts[language] = (counts[language] || 0) + 1;
            }
        });
        return counts;
    }
}

// Inicializar el reproductor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new IPTVPlayer();
});