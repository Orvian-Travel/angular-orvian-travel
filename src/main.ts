import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Import and register Swiper
import { register } from 'swiper/element/bundle';
register();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
