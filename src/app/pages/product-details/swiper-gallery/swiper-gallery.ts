import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageMediaDetail } from '../../../services/entities/package.model';

@Component({
  selector: 'app-swiper-gallery',
  imports: [CommonModule],
  templateUrl: './swiper-gallery.html',
  styleUrl: './swiper-gallery.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperGallery implements OnInit, AfterViewInit, OnChanges {
  @Input() medias: PackageMediaDetail[] = [];
  @Input() packageTitle: string = '';
  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;

  currentSlideIndex = 0;
  swiperLoaded = false;
  private mediasProcessed = false;

  ngOnInit() {
    this.processMedias();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medias']) {

      this.mediasProcessed = false;
      this.processMedias();
    }
  }

  ngAfterViewInit() {
    console.log('🔄 SwiperGallery: ngAfterViewInit chamado');

    // Usar múltiplas estratégias para garantir inicialização
    this.initializeSwiperWithRetry();
  }

  private initializeSwiperWithRetry(): void {
    // Estratégia 1: Aguardar o próximo frame
    requestAnimationFrame(() => {
      this.attemptSwiperInitialization();
    });

    // Estratégia 2: Usar MutationObserver para detectar quando o DOM muda
    if (typeof window !== 'undefined' && window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' &&
            mutation.addedNodes.length > 0) {
            // Verificar se o swiper foi adicionado
            Array.from(mutation.addedNodes).forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'SWIPER-CONTAINER' ||
                  element.querySelector('swiper-container')) {
                  console.log('✅ SwiperGallery: Swiper detectado no DOM via observer');
                  setTimeout(() => this.attemptSwiperInitialization(), 100);
                  observer.disconnect();
                }
              }
            });
          }
        });
      });

      // Observar mudanças no container da galeria
      if (this.mainSwiper?.nativeElement?.parentElement) {
        observer.observe(this.mainSwiper.nativeElement.parentElement, {
          childList: true,
          subtree: true
        });
      }

      // Desconectar observer após 5 segundos para evitar vazamentos
      setTimeout(() => observer.disconnect(), 5000);
    }

    // Estratégia 3: Retry com intervalos crescentes
    this.retryInitialization(0);
  }

  private retryInitialization(attempt: number): void {
    const maxAttempts = 10;
    const delay = Math.min(100 * Math.pow(1.5, attempt), 2000); // Delay crescente até 2s

    setTimeout(() => {
      if (this.attemptSwiperInitialization()) {
        console.log(`✅ SwiperGallery: Inicializado na tentativa ${attempt + 1}`);
        return;
      }

      if (attempt < maxAttempts) {
        console.log(`🔄 SwiperGallery: Tentativa ${attempt + 1}/${maxAttempts} - retry em ${delay}ms`);
        this.retryInitialization(attempt + 1);
      } else {
        console.warn('⚠️ SwiperGallery: Falha após todas as tentativas');
      }
    }, delay);
  }

  private attemptSwiperInitialization(): boolean {
    if (!this.mediasProcessed) {
      this.processMedias();
    }

    if (this.mainSwiper?.nativeElement) {
      const swiperEl = this.mainSwiper.nativeElement;

      // Verificar se o elemento está visível e tem dimensões
      const rect = swiperEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        console.log('✅ SwiperGallery: Elemento Swiper encontrado e visível');

        // Usar Intersection Observer para aguardar que o elemento esteja realmente visível
        if (typeof window !== 'undefined' && window.IntersectionObserver) {
          this.observeElementVisibility(swiperEl);
        } else {
          // Fallback se IntersectionObserver não estiver disponível
          this.configureSwiperEvents();
        }
        return true;
      } else {
        console.log('⏳ SwiperGallery: Elemento existe mas não tem dimensões ainda');
        return false;
      }
    }

    return false;
  }

  private observeElementVisibility(element: HTMLElement): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          console.log('👁️ SwiperGallery: Elemento está visível, inicializando...');

          // Aguardar um pouco mais para garantir que está completamente visível
          setTimeout(() => {
            this.configureSwiperEvents();
            observer.disconnect(); // Parar de observar
          }, 200);
        }
      });
    }, {
      threshold: 0.1, // Detectar quando pelo menos 10% está visível
      rootMargin: '50px' // Adicionar margem para detectar antes
    });

    observer.observe(element);

    // Desconectar após 10 segundos para evitar vazamentos
    setTimeout(() => {
      observer.disconnect();
    }, 10000);
  }

  private configureSwiperEvents(): void {
    if (this.mainSwiper?.nativeElement) {
      const swiperEl = this.mainSwiper.nativeElement;

      // Verificar se já está inicializado
      if (swiperEl.swiper) {
        console.log('✅ SwiperGallery: Swiper já estava inicializado');
        this.swiperLoaded = true;
        return;
      }

      // Aguardar inicialização com polling mais agressivo
      const checkSwiper = (attempts = 0) => {
        if (swiperEl.swiper) {
          console.log('✅ SwiperGallery: Swiper instance encontrada');
          this.swiperLoaded = true;
          return;
        }

        if (attempts < 50) { // 50 tentativas = 5 segundos
          setTimeout(() => checkSwiper(attempts + 1), 100);
        } else {
          console.warn('⚠️ SwiperGallery: Timeout aguardando Swiper instance');
          // Tentar forçar inicialização
          this.forceSwiperInitialization(swiperEl);
        }
      };

      checkSwiper();
    }
  }

  private forceSwiperInitialization(swiperEl: any): void {
    try {
      // Tentar inicializar manualmente se o Swiper não inicializou
      if (typeof swiperEl.initialize === 'function') {
        console.log('🔄 SwiperGallery: Forçando inicialização manual');
        swiperEl.initialize();
        this.swiperLoaded = true;
      } else {
        console.log('⚠️ SwiperGallery: Não foi possível forçar inicialização');
      }
    } catch (error) {
      console.error('❌ SwiperGallery: Erro ao forçar inicialização:', error);
    }
  }

  private retryCount = 0;

  private processMedias() {
    const originalMedias = this.medias ? [...this.medias.filter(m => !m.id.startsWith('test-'))] : [];

    const allMedias = [];

    for (const media of originalMedias) {
      allMedias.push(media);
    }

    this.medias = allMedias;
    this.mediasProcessed = true;
    ;
  }

  getMediaUrl(media: PackageMediaDetail): string {
    if (media.contentType) {
      if (media.contentType === '/' || media.contentType.trim() === '') {
        return '/assets/images/default-package-image.png';
      }

      if (media.contentType.includes('.') &&
        (media.contentType.includes('.png') ||
          media.contentType.includes('.jpg') ||
          media.contentType.includes('.jpeg') ||
          media.contentType.includes('.gif') ||
          media.contentType.includes('.webp') ||
          media.contentType.includes('.svg')) &&
        !media.contentType.includes(';base64,')) {

        const path = media.contentType.startsWith('/') ? media.contentType : `/${media.contentType}`;
        return path;
      }

      if (media.contentType.length > 1) {

        let mimeType = media.type;

        const mimeTypeMap: { [key: string]: string } = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
          'svg': 'image/svg+xml',
          'bmp': 'image/bmp',
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'ogg': 'video/ogg'
        };

        if (!mimeType.includes('/')) {
          mimeType = mimeTypeMap[mimeType.toLowerCase()] || `image/${mimeType}`;
        }

        return `data:${mimeType};base64,${media.contentType}`;
      }
    }

    return '/assets/images/default-package-image.png';
  }

  isImage(media: PackageMediaDetail): boolean {
    if (!media.type) return false;

    const imageTypes = ['image/', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    return imageTypes.some(type =>
      media.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  isVideo(media: PackageMediaDetail): boolean {
    if (!media.type) return false;

    const videoTypes = ['video/', 'mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv'];
    return videoTypes.some(type =>
      media.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  getDefaultImage(): string {
    return '/assets/images/default-package-image.png';
  }

  // Método para configurar autoplay condicionalmente
  getAutoplayConfig(): string | boolean {
    if (this.medias && this.medias.length > 1) {
      return JSON.stringify({
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      });
    }
    return false;
  }

  goToSlide(slideIndex: number): void {
    this.currentSlideIndex = slideIndex;

    setTimeout(() => {
      if (this.mainSwiper?.nativeElement) {
        const swiperElement = this.mainSwiper.nativeElement;

        if (swiperElement.swiper) {
          swiperElement.swiper.slideTo(slideIndex);
        } else if (swiperElement.slideTo) {
          swiperElement.slideTo(slideIndex);
        } else {
          console.warn('SwiperGallery: Não foi possível navegar para o slide');
        }
      }
    }, 100);
  }

  isActiveSlide(slideIndex: number): boolean {
    return this.currentSlideIndex === slideIndex;
  }

  onSlideChange(event: any): void {

    let newIndex = 0;

    if (event.detail && Array.isArray(event.detail) && event.detail[0]) {

      if (typeof event.detail[0].activeIndex === 'number') {
        newIndex = event.detail[0].activeIndex;
      } else if (typeof event.detail[0].realIndex === 'number') {
        newIndex = event.detail[0].realIndex;
      }
    } else if (event.target && event.target.swiper) {

      if (typeof event.target.swiper.activeIndex === 'number') {
        newIndex = event.target.swiper.activeIndex;
      } else if (typeof event.target.swiper.realIndex === 'number') {
        newIndex = event.target.swiper.realIndex;
      }
    }

    this.currentSlideIndex = newIndex;

  }

  onSwiperInit(event: any): void {
    console.log('✅ Swiper inicializado com sucesso!', event);
    this.swiperLoaded = true;
  }

  // Métodos para fallback manual
  nextSlide(): void {
    if (this.medias && this.medias.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.medias.length;
    }
  }

  previousSlide(): void {
    if (this.medias && this.medias.length > 0) {
      this.currentSlideIndex = this.currentSlideIndex === 0
        ? this.medias.length - 1
        : this.currentSlideIndex - 1;
    }
  }

  onImageError(event: Event): void {
    console.error('SwiperGallery: Erro ao carregar imagem:', event);
    const img = event.target as HTMLImageElement;
    console.error('SwiperGallery: URL que falhou:', img.src);
  }


}
