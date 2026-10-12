/**
 * FullscreenManager
 * Provides hybrid Fullscreen handling:
 * 1. Native Fullscreen API (OS/hardware level)
 * 2. In-Window Virtual Fullscreen (100% viewport fill) when native API is blocked by iframe permissions
 * 3. Auto-trigger on initial user gesture
 * 4. Helper to detect if standalone tab opening is recommended
 */

type FullscreenListener = (isFullscreen: boolean, isVirtual: boolean) => void;

let virtualFullscreen = false;
const listeners = new Set<FullscreenListener>();

const notifyAll = () => {
  const isFull = FullscreenManager.isFullscreen();
  const isVirt = FullscreenManager.isVirtualFullscreen();
  listeners.forEach((cb) => {
    try {
      cb(isFull, isVirt);
    } catch {
      // ignore listener error
    }
  });
};

export const FullscreenManager = {
  /**
   * Check if running inside an iframe (e.g. AI Studio preview)
   */
  isInIframe(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  },

  /**
   * Checks if native browser Fullscreen API is permitted and active
   */
  isNativeFullscreen(): boolean {
    if (typeof document === 'undefined') return false;
    const doc = document as any;
    return Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  },

  /**
   * Checks if in-window virtual fullscreen is active
   */
  isVirtualFullscreen(): boolean {
    return virtualFullscreen;
  },

  /**
   * Returns true if either native fullscreen or virtual fullscreen is active
   */
  isFullscreen(): boolean {
    return this.isNativeFullscreen() || this.isVirtualFullscreen();
  },

  /**
   * Checks whether native Fullscreen API is supported and enabled in this document context
   */
  isNativeFullscreenSupported(): boolean {
    if (typeof document === 'undefined') return false;
    const doc = document as any;
    if (doc.fullscreenEnabled === false || doc.webkitFullscreenEnabled === false) {
      return false;
    }
    return Boolean(
      doc.fullscreenEnabled !== undefined ||
      doc.webkitFullscreenEnabled !== undefined ||
      doc.documentElement?.requestFullscreen ||
      doc.documentElement?.webkitRequestFullscreen
    );
  },

  /**
   * Request fullscreen with automatic fallback to virtual fullscreen
   */
  async requestFullscreen(targetElement?: Element): Promise<{ success: boolean; mode: 'native' | 'virtual' }> {
    if (typeof document === 'undefined') {
      virtualFullscreen = true;
      notifyAll();
      return { success: true, mode: 'virtual' };
    }

    const el = (targetElement || document.documentElement) as any;

    // Try native fullscreen first if permitted
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
        virtualFullscreen = false;
        notifyAll();
        return { success: true, mode: 'native' };
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
        virtualFullscreen = false;
        notifyAll();
        return { success: true, mode: 'native' };
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
        virtualFullscreen = false;
        notifyAll();
        return { success: true, mode: 'native' };
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
        virtualFullscreen = false;
        notifyAll();
        return { success: true, mode: 'native' };
      }
    } catch {
      // Native fullscreen was blocked by iframe permissions policy, browser security, or missing user gesture.
      // Gracefully fall back to in-window virtual fullscreen:
    }

    // Activate virtual fullscreen so the game fills 100% of the viewport/iframe
    virtualFullscreen = true;
    notifyAll();
    return { success: true, mode: 'virtual' };
  },

  /**
   * Exit fullscreen (handles both native and virtual)
   */
  async exitFullscreen(): Promise<boolean> {
    virtualFullscreen = false;

    if (typeof document !== 'undefined') {
      const doc = document as any;
      try {
        if (this.isNativeFullscreen()) {
          if (doc.exitFullscreen) {
            await doc.exitFullscreen();
          } else if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen) {
            await doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen) {
            await doc.msExitFullscreen();
          }
        }
      } catch {
        // ignore exit error
      }
    }

    notifyAll();
    return true;
  },

  /**
   * Toggle between fullscreen and normal view
   */
  async toggleFullscreen(targetElement?: Element): Promise<boolean> {
    if (this.isFullscreen()) {
      await this.exitFullscreen();
      return false;
    } else {
      const res = await this.requestFullscreen(targetElement);
      return res.success;
    }
  },

  /**
   * Subscribe to fullscreen state changes
   */
  addFullscreenChangeListener(callback: FullscreenListener): () => void {
    listeners.add(callback);
    callback(this.isFullscreen(), this.isVirtualFullscreen());

    if (typeof document === 'undefined') {
      return () => listeners.delete(callback);
    }

    const nativeHandler = () => {
      // If user exited native via Esc key, sync state
      if (!this.isNativeFullscreen() && !virtualFullscreen) {
        notifyAll();
      } else {
        notifyAll();
      }
    };

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    events.forEach((evt) => {
      document.addEventListener(evt, nativeHandler, { passive: true });
    });

    return () => {
      listeners.delete(callback);
      events.forEach((evt) => {
        document.removeEventListener(evt, nativeHandler);
      });
    };
  },
};
