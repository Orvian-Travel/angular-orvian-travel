import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Import and register Swiper with error handling
async function initializeSwiperAndBootstrap() {
  try {
    // Import Swiper dynamically to ensure it loads correctly
    const { register } = await import('swiper/element/bundle');

    // Register Swiper custom elements
    register();

    // Ensure custom elements are defined before bootstrap
    if (typeof window !== 'undefined' && window.customElements) {
      await Promise.all([
        customElements.whenDefined('swiper-container'),
        customElements.whenDefined('swiper-slide')
      ]);
    }

    console.log('✅ Swiper registered successfully');

    // Bootstrap Angular application
    await bootstrapApplication(App, appConfig);

  } catch (error) {
    console.error('❌ Error initializing Swiper or Angular:', error);
    // Fallback: try to bootstrap without Swiper
    try {
      await bootstrapApplication(App, appConfig);
    } catch (bootstrapError) {
      console.error('❌ Critical error bootstrapping app:', bootstrapError);
    }
  }
}

// Initialize the application
initializeSwiperAndBootstrap();
