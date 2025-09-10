// UI module - Handles DOM manipulation and UI updates
export class UI {
    constructor() {
        this.elements = {};
        this.controlsTimeout = null;
    }

    initializeElements() {
        this.elements = {
            video: document.getElementById('videoPlayer'),
            channelUrl: document.getElementById('channelUrl'),
            loadChannelBtn: document.getElementById('loadChannel'),
            m3uFile: document.getElementById('m3uFile'),
            loadListBtn: document.getElementById('loadList'),
            channelList: document.getElementById('channelList'),
            loading: document.getElementById('loading'),
            searchInput: document.getElementById('searchInput'),
            currentChannelInfo: document.getElementById('currentChannelInfo'),
            playButton: document.getElementById('playButton'),
            favoritesToggle: document.getElementById('favoritesToggle'),
            prevChannel: document.getElementById('prevChannel'),
            nextChannel: document.getElementById('nextChannel'),
            favoriteCurrent: document.getElementById('favoriteCurrent')
        };
    }

    showChannelList(channels, favorites, currentChannel, onChannelSelect, onFavoriteToggle) {
        if (channels.length === 0) {
            this.elements.channelList.innerHTML = '<p class="empty-message">No hay canales cargados</p>';
            return;
        }

        this.elements.channelList.innerHTML = channels.map((channel, index) => `
            <div class="channel-item" data-index="${index}">
                <div class="channel-info">
                    <span class="channel-name">${channel.name}</span>
                    <span class="channel-number">${index + 1}</span>
                </div>
                <button class="favorite-btn ${favorites.includes(channel.name) ? 'active' : ''}" data-index="${index}">
                    ${favorites.includes(channel.name) ? '★' : '☆'}
                </button>
            </div>
        `).join('');

        // Agregar event listeners
        this.elements.channelList.querySelectorAll('.channel-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-btn')) {
                    const index = parseInt(item.dataset.index);
                    onChannelSelect(index);
                }
            });
        });

        this.elements.channelList.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                onFavoriteToggle(index);
            });
        });
    }

    setActiveChannel(index) {
        this.elements.channelList.querySelectorAll('.channel-item').forEach(item => {
            item.classList.remove('active');
        });

        if (index !== null && this.elements.channelList.children[index]) {
            this.elements.channelList.children[index].classList.add('active');
        }
    }

    updateCurrentChannelInfo(channel, index, isFavorite) {
        if (channel) {
            this.elements.currentChannelInfo.textContent = `${index + 1} - ${channel.name}`;
            this.updateFavoriteButton(isFavorite);
            
            // Asegurar que los controles sean visibles cuando hay un canal activo
            const controls = document.querySelector('.channel-controls');
            controls.classList.add('visible');
        }
    }

    updateFavoriteButton(isFavorite) {
        const btn = this.elements.favoriteCurrent;
        if (btn) {
            btn.textContent = isFavorite ? '★' : '☆';
            btn.style.color = isFavorite ? '#00d4ff' : '#fff';
            btn.style.textShadow = isFavorite ? '0 0 10px rgba(0, 212, 255, 0.5)' : 'none';
        }
    }

    showLoading(show) {
        if (show) {
            this.elements.loading.classList.add('show');
        } else {
            this.elements.loading.classList.remove('show');
        }
    }

    toggleControls() {
        const controls = document.querySelector('.channel-controls');
        controls.classList.toggle('visible');
        
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = setTimeout(() => {
            controls.classList.remove('visible');
        }, 3000);
    }

    showControls() {
        const controls = document.querySelector('.channel-controls');
        controls.classList.add('visible');
        
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = setTimeout(() => {
            controls.classList.remove('visible');
        }, 3000);
    }

    renderFilters(categories, languages, onFilterChange, onClearFilters) {
        const existingFilters = document.querySelector('.filters-container');
        if (existingFilters) existingFilters.remove();

        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'filters-container';

        // Categorías con contador
        if (categories.length > 0) {
            const categorySelect = document.createElement('select');
            categorySelect.id = 'categoryFilter';
            
            const categoryCounts = this.getCategoryCounts();
            categorySelect.innerHTML = '<option value="">Todas las categorías</option>' +
                categories.map(cat => `<option value="${cat}">${cat} (${categoryCounts[cat] || 0})</option>`).join('');

            const categoryLabel = document.createElement('label');
            categoryLabel.textContent = 'Categoría: ';
            categoryLabel.appendChild(categorySelect);
            filtersContainer.appendChild(categoryLabel);
        }

        // Idiomas con contador
        if (languages.length > 1) {
            const languageSelect = document.createElement('select');
            languageSelect.id = 'languageFilter';
            
            const languageCounts = this.getLanguageCounts();
            languageSelect.innerHTML = '<option value="">Todos los idiomas</option>' +
                languages.map(lang => `<option value="${lang}">${lang} (${languageCounts[lang] || 0})</option>`).join('');

            const languageLabel = document.createElement('label');
            languageLabel.textContent = 'Idioma: ';
            languageLabel.appendChild(languageSelect);
            filtersContainer.appendChild(languageLabel);
        }

        // Limpiar filtros
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Limpiar filtros';
        clearBtn.className = 'btn-secondary';
        clearBtn.onclick = onClearFilters;
        filtersContainer.appendChild(clearBtn);

        document.querySelector('.input-section').parentNode.insertBefore(
            filtersContainer,
            document.querySelector('.channel-list')
        );

        // Event listeners
        document.getElementById('categoryFilter')?.addEventListener('change', onFilterChange);
        document.getElementById('languageFilter')?.addEventListener('change', onFilterChange);
    }

    getCategoryCounts() {
        const counts = {};
        const channels = window.iptvPlayer?.channels || [];
        channels.forEach(channel => {
            const category = channel.group || 'Sin categoría';
            counts[category] = (counts[category] || 0) + 1;
        });
        return counts;
    }

    getLanguageCounts() {
        const counts = {};
        const channels = window.iptvPlayer?.channels || [];
        channels.forEach(channel => {
            const language = channel.detectedLanguage || 'Unknown';
            counts[language] = (counts[language] || 0) + 1;
        });
        return counts;
    }

    showError(message) {
        alert(message);
    }
}