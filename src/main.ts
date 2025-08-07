/// <reference types="@angular/localize" />

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

    // Aguardar que custom elements sejam definidos COM TIMEOUT
    if (typeof window !== 'undefined' && window.customElements) {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout aguardando custom elements')), 10000)
      );

      const customElementsReady = Promise.all([
        customElements.whenDefined('swiper-container'),
        customElements.whenDefined('swiper-slide')
      ]);

      try {
        await Promise.race([customElementsReady, timeout]);
        console.log('✅ Swiper custom elements definidos com sucesso');
      } catch (timeoutError) {
        console.warn('⚠️ Timeout aguardando custom elements, continuando mesmo assim:', timeoutError);
      }
    }

    // Aguardar um frame adicional para garantir que tudo está registrado
    await new Promise(resolve => requestAnimationFrame(resolve));

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
}// Initialize the application
initializeSwiperAndBootstrap();
