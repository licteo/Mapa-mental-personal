// Player module - Handles video playback and HLS
import Hls from 'hls.js';

export class Player {
    constructor(videoElement) {
        this.video = videoElement;
        this.hls = null;
        this.onLoading = null;
        this.onError = null;
    }

    playStream(url) {
        this.showLoading(true);
        
        // Detener cualquier reproducción actual
        this.stop();
        
        if (Hls.isSupported()) {
            this.initializeHLS(url);
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.initializeNativePlayer(url);
        } else {
            this.handleError('Tu navegador no soporta la reproducción de streams HLS');
        }
    }

    initializeHLS(url) {
        this.hls = new Hls({
            maxBufferLength: 30,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
            maxSeekHole: 2,
            liveSyncDurationCount: 3,
            liveMaxLatencyDurationCount: 7,
            maxLiveSyncPlaybackRate: 1.5,
            fragLoadingTimeOut: 20000,
            fragLoadingMaxRetry: 6,
            fragLoadingRetryDelay: 1000,
            fragLoadingMaxRetryTimeout: 64000,
            levelLoadingTimeOut: 10000,
            levelLoadingMaxRetry: 4,
            levelLoadingRetryDelay: 1000,
            levelLoadingMaxRetryTimeout: 32000,
            startLevel: -1,
            startFragPrefetch: true,
            appendErrorMaxRetry: 3,
            enableWorker: true,
            // Nuevas configuraciones para evitar el cambio de velocidad inicial
            startLevel: 0, // Empezar con el primer nivel (menor calidad)
            capLevelToPlayerSize: false, // No limitar por tamaño del player
            autoStartLoad: true,
            levelSwitchingStrategy: 'CONTINUOUS', // Cambios de nivel más suaves
            progressive: true, // Carga progresiva
            lowLatencyMode: false // Desactivar modo baja latencia para estabilidad
        });

        this.hls.loadSource(url);
        this.hls.attachMedia(this.video);

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // Configurar velocidad de reproducción normal desde el inicio
            this.video.playbackRate = 1;
            this.video.defaultPlaybackRate = 1;
            
            // Forzar velocidad normal en cualquier cambio de velocidad
            this.video.addEventListener('ratechange', () => {
                if (this.video.playbackRate !== 1) {
                    this.video.playbackRate = 1;
                    this.video.defaultPlaybackRate = 1;
                }
            });
            
            setTimeout(() => {
                this.attemptPlay();
            }, 500); // Aumentar ligeramente el timeout para estabilidad
            
            this.showLoading(false);
        });

        this.hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
                if (data.type === 'networkError' && data.details === 'manifestLoadError') {
                    console.log('Error temporal de red, el stream puede cargarse correctamente');
                    return;
                }
                this.showLoading(false);
                this.handleError('Error al cargar el stream');
            }
        });
    }

    initializeNativePlayer(url) {
        this.video.src = url;
        
        this.video.addEventListener('loadedmetadata', () => {
            this.attemptPlay();
            this.showLoading(false);
        });

        this.video.addEventListener('error', () => {
            console.error('Video error:', this.video.error);
            this.showLoading(false);
        });
    }

    attemptPlay() {
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Reproducción bloqueada por políticas del navegador:', error);
                if (this.onError) this.onError('play-blocked');
            });
        }
    }

    stop() {
        this.video.pause();
        this.video.removeAttribute('src');
        this.video.load();
        
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
    }

    showLoading(show) {
        if (this.onLoading) this.onLoading(show);
    }

    handleError(message) {
        if (this.onError) this.onError(message);
    }
}