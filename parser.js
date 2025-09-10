// Parser module - Handles M3U parsing and channel processing
export const parser = {
    parseM3U(content) {
        const lines = content.split('\n');
        const channels = [];
        let currentChannel = {};

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith('#EXTINF:')) {
                const info = line.split(',');
                currentChannel.name = info[1] || 'Sin nombre';

                const tvgId = line.match(/tvg-id="([^"]*)"/);
                const group = line.match(/group-title="([^"]*)"/);
                const logo = line.match(/tvg-logo="([^"]*)"/);

                if (tvgId) currentChannel.id = tvgId[1];
                if (group) currentChannel.group = this.normalizeCategory(group[1]);
                if (logo) currentChannel.logo = logo[1];
            } else if (line && !line.startsWith('#') && line.includes('://')) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {};
            }
        });

        return channels;
    },

    normalizeCategory(categoryName) {
        if (!categoryName) return 'Sin categoría';
        
        const normalizationMap = {
            'general': 'General',
            'news': 'Noticias',
            'sports': 'Deportes',
            'movies': 'Cine',
            'entertainment': 'Entretenimiento',
            'music': 'Música',
            'documentary': 'Documentales',
            'children': 'Infantil',
            'educational': 'Educación',
            'religious': 'Religioso',
            'shopping': 'Compras',
            'regional': 'Regional',
            'international': 'Internacional',
            'premium': 'Premium',
            'adult': 'Adultos'
        };
        
        const normalized = categoryName.toLowerCase().trim();
        return normalizationMap[normalized] || categoryName;
    },

    detectLanguages(channels) {
        const languagePatterns = {
            'ES': /\b(español|spanish|castellano|latino|ES)\b/i,
            'EN': /\b(english|ingles|EN)\b/i,
            'FR': /\b(français|french|FR)\b/i,
            'DE': /\b(deutsch|german|DE)\b/i,
            'PT': /\b(português|portuguese|PT)\b/i,
            'IT': /\b(italiano|italian|IT)\b/i
        };

        channels.forEach(channel => {
            channel.detectedLanguage = 'Unknown';
            for (const [lang, pattern] of Object.entries(languagePatterns)) {
                if (pattern.test(channel.name)) {
                    channel.detectedLanguage = lang;
                    break;
                }
            }
        });

        return channels;
    },

    getCategories(channels) {
        const categories = [...new Set(channels.map(ch => ch.group).filter(Boolean))];
        return categories.sort((a, b) => {
            const priorityOrder = ['General', 'Noticias', 'Deportes', 'Cine', 'Entretenimiento', 'Música', 'Documentales', 'Infantil'];
            const aPriority = priorityOrder.indexOf(a);
            const bPriority = priorityOrder.indexOf(b);
            
            if (aPriority === -1 && bPriority === -1) return a.localeCompare(b);
            if (aPriority === -1) return 1;
            if (bPriority === -1) return -1;
            return aPriority - bPriority;
        });
    },

    getLanguages(channels) {
        return [...new Set(channels.map(ch => ch.detectedLanguage))];
    }
};