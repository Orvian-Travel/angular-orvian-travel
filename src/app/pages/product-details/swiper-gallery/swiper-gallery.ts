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
    if (!this.mediasProcessed) {
      this.processMedias();
    }
  }

  private processMedias() {
    if (this.medias && this.medias.length > 0) {
      this.medias = this.medias.filter(m => !m.id.startsWith('test-'));
    } else {
      this.medias = [];
    }
    
    this.mediasProcessed = true;
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

  onImageError(event: Event): void {
    console.error('SwiperGallery: Erro ao carregar imagem:', event);
    const img = event.target as HTMLImageElement;
    console.error('SwiperGallery: URL que falhou:', img.src);
  }


}
