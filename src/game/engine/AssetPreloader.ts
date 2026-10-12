import { GAME_ASSETS } from '../assets';

class AssetPreloader {
  private preloadedImages = new Set<string>();
  private preloadedVideos = new Set<string>();
  public cachedVideoBlobUrl: string | null = null;

  preloadAll() {
    if (typeof window === 'undefined') return;

    // 1. Preload transition video into memory/blob so playback never lags or buffers
    this.preloadVideo('./assets/avatars/videos/transition-drive-to-client.webm');

    // 2. Preload essential scene backgrounds, character sprites, and Spark GIFs
    const imagesToPreload = [
      './assets/spark/animations/spark1.gif',
      './assets/spark/animations/spark2.gif',
      './assets/Spark/spark1.gif',
      './assets/Spark/spark2.gif',
      GAME_ASSETS.backgrounds.bakeryInterior,
      GAME_ASSETS.backgrounds.bakeryStreet,
      GAME_ASSETS.backgrounds.studioSpark,
      GAME_ASSETS.characters.marie,
      GAME_ASSETS.characters.spark,
      './assets/portraits/portrait_Mari.webp',
      './assets/bakery_street.webp',
      './assets/spark_car.webp',
    ];

    imagesToPreload.forEach((src) => {
      this.preloadImage(src);
    });
  }

  preloadImage(src: string): Promise<void> {
    if (!src || this.preloadedImages.has(src)) return Promise.resolve();

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.preloadedImages.add(src);
        resolve();
      };
      img.onerror = () => {
        resolve(); // resolve anyway so errors don't hang
      };
      img.src = src;
    });
  }

  preloadVideo(src: string): void {
    if (!src || this.preloadedVideos.has(src)) return;
    this.preloadedVideos.add(src);

    // Fetch video as blob so it's instantly decoded from memory without network lag
    try {
      fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error('Video fetch failed');
          return res.blob();
        })
        .then((blob) => {
          this.cachedVideoBlobUrl = URL.createObjectURL(blob);
        })
        .catch(() => {
          // Fallback to standard video element preloader
          const video = document.createElement('video');
          video.preload = 'auto';
          video.src = src;
          video.muted = true;
          video.playsInline = true;
          video.load();
        });
    } catch {
      // Ignore background preload errors
    }
  }

  getVideoUrl(defaultSrc: string): string {
    return this.cachedVideoBlobUrl || defaultSrc;
  }
}

export const assetPreloader = new AssetPreloader();
