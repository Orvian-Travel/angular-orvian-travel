import { Component, Inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  PackageDetail,
  SavePackageRequest,
  SavePackageResponse,
} from '@services/entities/package.model';
import { SERVICES_TOKEN } from '@services/services-token';
import { IPackageService } from '@services/api/package/package-service.interface';
import { PagedResponse } from '@services/entities/paged-response.model';
import { PackageService } from '@services/api/package/package-service';
import { SavePackageDateRequest } from '@services/entities/package-date.model';
import Swal from 'sweetalert2';

interface Package {
  id: number;
  destination: string;
  price: number;
  duration: string;
  status: string;
  description: string;
  image: string;
}

interface DateEntry {
  id?: string;
  startDate: string;
  endDate: string;
  availableReservations: number;
}

interface MediaItem {
  content64: string;
  type: string;
}

interface CreatePackageRequest extends SavePackageRequest {
  medias: MediaItem[];
}

@Component({
  selector: 'app-admin-packages',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-packages.html',
  styleUrl: './admin-packages.css',
  providers: [
    {
      provide: SERVICES_TOKEN.HTTP.PACKAGE,
      useClass: PackageService,
    },
  ],
})
export class AdminPackages implements OnInit {
  @ViewChild('addPackageForm') addPackageForm!: NgForm;
  @ViewChild('addPackageModal') addPackageModalTemplate!: TemplateRef<any>;
  @ViewChild('editPackageModal') editPackageModalTemplate!: TemplateRef<any>;

  // Referencias dos modais ng-bootstrap
  private addModalRef?: NgbModalRef;
  private editModalRef?: NgbModalRef;

  packages: PackageDetail[] = [];
  selectedPackage: PackageDetail | null = null;
  selectedImageFile: File | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  currentStep = 1;
  tempPackageData: any = {};
  currentEditStep = 1;
  tempEditPackageData: any = {};

  packageDates: DateEntry[] = [];
  editPackageDates: DateEntry[] = [];

  // Propriedades para formulário de adicionar pacote
  additionalImages: File[] = [];
  previewImages: string[] = [];
  mainImagePreview: string = '';

  mainImageFile: File | null = null;
  additionalImageFiles: File[] = [];

  editPackageData: Partial<PackageDetail> = {};
  selectedPackageId: string | null = null;

  prepareEditModal(pkg: PackageDetail): void {
    this.selectedPackageId = pkg.id;
    this.editPackageData = {
      ...pkg,
      packageDates: pkg.packageDates
        ? pkg.packageDates.map((date) => ({ ...date }))
        : [],
    };
  }

  removeEditDateEntry(index: number): void {
    if (
      this.editPackageData.packageDates &&
      this.editPackageData.packageDates.length > 1
    ) {
      this.editPackageData.packageDates.splice(index, 1);
    }
  }



  onEditPackageSubmit(): void {
    if (!this.selectedPackageId) return;

    const updateData = {
      title: this.editPackageData.title ?? '',
      description: this.editPackageData.description ?? '',
      destination: this.editPackageData.destination ?? '',
      duration: Number(this.editPackageData.duration ?? 1),
      price: Number(this.editPackageData.price ?? 0),
      maxPeople: Number(this.editPackageData.maxPeople ?? 1),
      packageDates: (this.editPackageData.packageDates ?? []).map((date) => {
        const obj: any = {
          startDate: this.formatDateToYMD(date.startDate),
          endDate: this.formatDateToYMD(date.endDate),
          qtd_available: Number(date.qtd_available ?? 1),
        };
        if (date.id && date.id !== '') obj.id = date.id;
        return obj;
      }),
    };
    console.log('Enviando updateData:', updateData);

    if (
      !updateData.packageDates.length ||
      updateData.packageDates.some(
        (d) => !d.startDate || !d.endDate || !d.qtd_available
      )
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Preencha todas as datas',
        text: 'Todas as datas devem ter check-in, check-out e reservas disponíveis.',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.packageService
      .updatePackage(this.selectedPackageId, updateData)
      .subscribe({
        next: () => {
          this.loadPackages();
          const modal = document.getElementById('editPackageModal');
          if (modal) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(
              modal
            );
            if (bootstrapModal) {
              bootstrapModal.hide();
            }
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar pacote',
            text: 'Ocorreu um erro ao atualizar o pacote. Por favor, tente novamente.',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  formatDateToYMD(date: string | Date): string {
    if (!date) return '';
    if (typeof date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      return new Date(date).toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  }

  addEditDateEntry(): void {
    if (!this.editPackageData.packageDates)
      this.editPackageData.packageDates = [];
    this.editPackageData.packageDates.push({
      id: '', // ou null
      startDate: new Date(),
      endDate: new Date(),
      qtd_available: 1
      // NÃO adicione outros campos!
    } as any); // use 'as any' se o TypeScript reclamar
  }

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE)
    private readonly packageService: IPackageService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadPackages();
  }

  private loadPackages() {
    this.packageService
      .getAllPackagesWithPagination(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PagedResponse<PackageDetail>) => {
          this.packages = response._embedded.DTOList;
          this.totalPages = response.page?.totalElements!;
          this.totalPages = response.page?.totalPages!;
        },
        error: (error) => {
          console.error('Erro ao carregar pacotes:', error);
          alert(
            'Erro ao carregar pacotes. Por favor, tente novamente mais tarde.'
          );
        },
      });
  }

  // Métodos para controle dos modais ng-bootstrap
  openAddModal(): void {
    this.prepareAddModal();
    this.addModalRef = this.modalService.open(this.addPackageModalTemplate, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  openEditModal(pkg: PackageDetail): void {
    this.prepareEditModal(pkg);
    this.editModalRef = this.modalService.open(this.editPackageModalTemplate, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  closeAddModal(): void {
    if (this.addModalRef) {
      this.addModalRef.close();
      this.addModalRef = undefined;
    }
  }

  closeEditModal(): void {
    if (this.editModalRef) {
      this.editModalRef.close();
      this.editModalRef = undefined;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPackages();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPackages();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPackages();
    }
  }

  getPageNumbers(): number[] {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(0, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goBackToForm() {
    this.currentStep = 1;
  }

  prepareAddModal(): void {
    this.currentStep = 1;
    this.tempPackageData = {
      title: '',
      description: '',
      destination: '',
      duration: 1,
      price: 0,
      maxPeople: 1
    };
    this.selectedImageFile = null;
    this.packageDates = [{
      startDate: '',
      endDate: '',
      availableReservations: 1
    }];
    this.mainImageFile = null;
    this.additionalImageFiles = [];
  }

  resetModal() {
    this.currentStep = 1;
    this.tempPackageData = {};
    this.selectedImageFile = null;
    this.packageDates = [];
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('pt-BR');
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatDateBrazilian(dateString: string): string {
    if (!dateString) return '';

    // Se for no formato ISO (yyyy-mm-dd), adiciona horário para evitar problemas de timezone
    const date = dateString.includes('T')
      ? new Date(dateString)
      : new Date(dateString + 'T12:00:00');

    // Formata especificamente no padrão brasileiro dd/mm/yyyy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  formatCurrencyBrazilian(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatNumberBrazilian(value: number): string {
    if (!value) return '0';
    return value.toLocaleString('pt-BR');
  }

  addAdditionalImage(): void {
    this.additionalImageFiles.push(new File([], ''));
  }

  removeAdditionalImage(index: number): void {
    this.additionalImageFiles.splice(index, 1);
    this.previewImages.splice(index + 1, 1);
  }

  onAdditionalImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      console.log(`Arquivo selecionado para imagem adicional ${index + 1}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!this.isValidImageType(file)) {
        const acceptedTypes = this.getAcceptedFileTypes()
          .join(', ')
          .toUpperCase();
        alert(`Tipo de arquivo não suportado. Use apenas: ${acceptedTypes}`);
        event.target.value = '';
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        alert('Arquivo muito grande. O tamanho máximo é 5MB.');
        event.target.value = '';
        return;
      }

      while (this.additionalImageFiles.length <= index) {
        this.additionalImageFiles.push(new File([], ''));
      }

      this.additionalImageFiles[index] = file;

      this.convertFileToBase64(file).then((base64) => {
        this.previewImages[index + 1] = `data:${file.type};base64,${base64}`;
      });
    }
  }

  onMainImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Arquivo selecionado para imagem principal:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!this.isValidImageType(file)) {
        const acceptedTypes = this.getAcceptedFileTypes()
          .join(', ')
          .toUpperCase();
        alert(`Tipo de arquivo não suportado. Use apenas: ${acceptedTypes}`);
        event.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. O tamanho máximo é 5MB.');
        event.target.value = '';
        return;
      }

      this.mainImageFile = file;
      this.convertFileToBase64(file).then((base64) => {
        this.mainImagePreview = `data:${file.type};base64,${base64}`;
        this.previewImages[0] = this.mainImagePreview;
      });
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getFileType(file: File): string {
    const mimeType = file.type || 'image/jpeg';

    const typeMapping: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',

      'video/mp4': 'mp4',

      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'doc',

      'image/webp': 'jpg',
      'image/bmp': 'jpg',
      'image/x-ms-bmp': 'jpg',
      'image/tiff': 'jpg',
      'image/svg+xml': 'jpg',
    };

    const mappedType = typeMapping[mimeType.toLowerCase()];

    const finalType = mappedType || 'jpg';

    console.log(
      `Mapeamento de tipo: ${file.name} | MIME: "${mimeType}" | DB Type: "${finalType}"`
    );

    return finalType;
  }

  private isValidImageType(file: File): boolean {
    const validMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',

      'image/webp',
      'image/bmp',
      'image/x-ms-bmp',
      'video/mp4'
    ];

    const isValid = validMimeTypes.includes(file.type.toLowerCase());

    console.log(
      `Validação de tipo: ${file.name} | MIME: "${file.type}" | Válido: ${isValid}`
    );

    return isValid;
  }

  private getAcceptedFileTypes(): string[] {
    return ['jpg', 'png', 'gif', 'mp4'];
  }

  resetPackageForm(): void {
    this.additionalImageFiles = [];
    this.previewImages = [];
    this.mainImagePreview = '';
    this.mainImageFile = null;

    this.currentStep = 1;
    this.tempPackageData = {};
    this.packageDates = [];

    if (this.addPackageForm) {
      this.addPackageForm.resetForm();
    }

    const mainImageInput = document.getElementById(
      'packageMainImage'
    ) as HTMLInputElement;
    if (mainImageInput) {
      mainImageInput.value = '';
    }

    setTimeout(() => {
      const additionalInputs = document.querySelectorAll(
        '[id^="additionalImage"]'
      );
      additionalInputs.forEach((input) => {
        (input as HTMLInputElement).value = '';
      });
    }, 100);
  }

  // Novos métodos para gerenciar steps e datas
  advanceToStep2(form?: NgForm): void {
    // Se não recebeu o form como parâmetro, usa o ViewChild
    const currentForm = form || this.addPackageForm;

    if (!currentForm) {
      alert('Erro interno: formulário não encontrado.');
      return;
    }

    if (!currentForm.valid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      // Marcar todos os campos como touched para mostrar os erros
      Object.keys(currentForm.controls).forEach((key) => {
        currentForm.controls[key].markAsTouched();
      });
      return;
    }

    const formData = currentForm.value;

    // Validar se tem imagem principal
    const mainImageInput = document.getElementById(
      'packageMainImage'
    ) as HTMLInputElement;
    if (
      !mainImageInput ||
      !mainImageInput.files ||
      mainImageInput.files.length === 0
    ) {
      alert('Por favor, selecione uma imagem principal para o pacote.');
      return;
    }

    // Salvar dados temporários
    this.tempPackageData = { ...formData };

    console.log('Avançando para Step 2 com dados:', this.tempPackageData);

    // Inicializar com uma data padrão se não tiver nenhuma
    if (this.packageDates.length === 0) {
      this.addNewDateEntry();
    }

    // Avançar para step 2
    this.currentStep = 2;

    console.log('Step atual:', this.currentStep);
  }

  goBackToStep1(): void {
    console.log('Voltando para Step 1...');
    this.currentStep = 1;
    console.log('Step atual:', this.currentStep);
  }

  addNewDateEntry(): void {
    const newDate: DateEntry = {
      startDate: this.getMinDate(),
      endDate: this.calculateEndDate(
        this.getMinDate(),
        this.tempPackageData.duration || 1
      ),
      availableReservations: 10,
    };
    this.packageDates.push(newDate);
  }

  removeDateEntry(index: number): void {
    if (this.packageDates.length > 1) {
      this.packageDates.splice(index, 1);
    }
  }

  onCheckinChange(index: number): void {
    const dateEntry = this.packageDates[index];
    if (dateEntry.startDate && this.tempPackageData.duration) {
      dateEntry.endDate = this.calculateEndDate(
        dateEntry.startDate,
        this.tempPackageData.duration
      );
    }
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  calculateEndDate(startDate: string, duration: number): string {
    if (!startDate || !duration) return '';

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(duration.toString()));

    return end.toISOString().split('T')[0];
  }

  async concludePackageCreation(): Promise<void> {
    const invalidDates = this.packageDates.filter(
      (date) =>
        !date.startDate ||
        !date.endDate ||
        !date.availableReservations ||
        date.availableReservations < 1
    );

    if (invalidDates.length > 0) {
      alert('Por favor, preencha todas as informações das datas disponíveis.');
      return;
    }

    for (let i = 0; i < this.packageDates.length; i++) {
      for (let j = i + 1; j < this.packageDates.length; j++) {
        if (this.datesOverlap(this.packageDates[i], this.packageDates[j])) {
          alert(
            `Conflito entre as datas ${i + 1} e ${j + 1
            }. As datas não podem se sobrepor.`
          );
          return;
        }
      }
    }

    if (!this.mainImageFile) {
      alert('Por favor, selecione uma imagem principal para o pacote.');
      return;
    }

    try {
      const medias: MediaItem[] = [];

      const mainImageBase64 = await this.convertFileToBase64(
        this.mainImageFile
      );
      medias.push({
        content64: mainImageBase64,
        type: this.getFileType(this.mainImageFile),
      });

      for (const file of this.additionalImageFiles) {
        if (file.size > 0) {
          const base64 = await this.convertFileToBase64(file);
          medias.push({
            content64: base64,
            type: this.getFileType(file),
          });
        }
      }

      const packageDates: SavePackageDateRequest[] = this.packageDates.map(
        (date) => {
          const obj: any = {
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            qtd_available: date.availableReservations,
          };
          if (date.id && date.id !== '') obj.id = date.id;
          return obj;
        }
      );

      const createPackageRequest: CreatePackageRequest = {
        title: this.tempPackageData.title,
        description: this.tempPackageData.description,
        destination: this.tempPackageData.destination,
        duration: parseInt(this.tempPackageData.duration),
        price: parseFloat(this.tempPackageData.price),
        maxPeople: parseInt(this.tempPackageData.maxPeople),
        packageDates: packageDates,
        medias: medias,
      };

      console.log('Enviando pacote:', createPackageRequest);

      this.packageService.createPackage(createPackageRequest).subscribe({
        next: () => {
          console.log('Pacote criado com sucesso.');
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: `O pacote para ${this.tempPackageData.destination} foi criado com sucesso!`,
            confirmButtonText: 'OK',
          });

          this.loadPackages();

          this.resetPackageForm();
          const modal = document.getElementById('addPackageModal');
          if (modal) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
              const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
              bootstrapModal.hide();
            }
          }
        },
        error: (error) => {
          console.error('Erro ao criar pacote:', error);
          alert('Erro ao criar pacote. Por favor, tente novamente.');
        },
      });
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      alert('Erro ao processar as imagens. Por favor, tente novamente.');
    }
  }

  private datesOverlap(date1: DateEntry, date2: DateEntry): boolean {
    const start1 = new Date(date1.startDate);
    const end1 = new Date(date1.endDate);
    const start2 = new Date(date2.startDate);
    const end2 = new Date(date2.endDate);

    return start1 <= end2 && start2 <= end1;
  }

  deletePackage(packageToDelete: PackageDetail): void {
    // Usar SweetAlert2 para confirmação
    Swal.fire({
      title: 'Confirmar Exclusão',
      html: `
        <div class="text-start">
          <p><strong>Tem certeza que deseja excluir este pacote?</strong></p>
          <div class="alert alert-warning">
            <strong>Pacote:</strong> ${packageToDelete.title}<br>
            <strong>Destino:</strong> ${packageToDelete.destination}<br>
            <strong>ID:</strong> ${packageToDelete.id}
          </div>
          <p class="text-danger"><small><i class="fas fa-exclamation-triangle me-1"></i>Esta ação não pode ser desfeita!</small></p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fas fa-trash me-2"></i>Sim, Excluir',
      cancelButtonText: '<i class="fas fa-times me-2"></i>Cancelar',
      focusCancel: true,
      customClass: {
        popup: 'swal-delete-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.executePackageDelection(packageToDelete);
      }
    });
  }

  private executePackageDelection(packageToDelete: PackageDetail): void {
    Swal.fire({
      title: 'Excluindo...',
      text: 'Por favor, aguarde...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.packageService.deletePackage(packageToDelete.id).subscribe({
      next: () => {
        console.log(`Pacote ${packageToDelete.id} excluído com sucesso`);

        Swal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: `O pacote "${packageToDelete.title}" foi excluído com sucesso.`,
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
        });

        this.loadPackages();
      },
      error: (error) => {
        console.error('Erro ao excluir pacote:', error);

        let errorMessage = 'Erro desconhecido ao excluir o pacote.';

        if (error.status === 404) {
          errorMessage =
            'Pacote não encontrado. Pode ter sido excluído anteriormente.';
        } else if (error.status === 409) {
          errorMessage =
            'Não é possível excluir este pacote pois possui reservas associadas.';
        } else if (error.status === 403) {
          errorMessage = 'Você não tem permissão para excluir este pacote.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro ao Excluir',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      },
    });
  }

  onEditDateChange(index: number, field: 'startDate' | 'endDate', value: string) {
    if (this.editPackageData.packageDates && value) {
      // Força o tipo para string (yyyy-MM-dd)
      (this.editPackageData.packageDates[index] as any)[field] = value;
      if (field === 'startDate') {
        const duration = Number(this.editPackageData.duration) || 1;
        (this.editPackageData.packageDates[index] as any).endDate = this.calculateEndDate(value, duration);
      }
    }
  }
}
