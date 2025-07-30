import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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
  startDate: string;
  endDate: string;
  availableReservations: number;
}

@Component({
  selector: 'app-admin-packages',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-packages.html',
  styleUrl: './admin-packages.css'
})
export class AdminPackages implements OnInit {
  packages: Package[] = [];
  selectedPackage: Package | null = null;
  selectedImageFile: File | null = null;
  currentStep = 1; // 1 = formulário, 2 = confirmação
  tempPackageData: any = {};
  currentEditStep = 1; // 1 = formulário, 2 = confirmação (para edição)
  tempEditPackageData: any = {};
  
  // Arrays para múltiplas datas
  packageDates: DateEntry[] = [];
  editPackageDates: DateEntry[] = [];

  ngOnInit() {
    this.loadPackages();
  }

  private loadPackages() {
    // Mock data - replace with actual API call
    this.packages = [
      {
        id: 1,
        destination: 'Paraty, RJ',
        price: 899.00,
        duration: '3 dias / 2 noites',
        status: 'Ativo',
        description: 'Pacote completo para Paraty com hospedagem e passeios inclusos.',
        image: ''
      },
      {
        id: 2,
        destination: 'Bonito, MS',
        price: 1299.00,
        duration: '5 dias / 4 noites',
        status: 'Ativo',
        description: 'Aventura em Bonito com mergulho nas águas cristalinas.',
        image: ''
      },
      {
        id: 3,
        destination: 'Gramado, RS',
        price: 1099.00,
        duration: '4 dias / 3 noites',
        status: 'Inativo',
        description: 'Charme europeu em Gramado com degustação de vinhos.',
        image: ''
      }
    ];
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.selectedPackage) {
          this.selectedPackage.image = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addPackage(form: NgForm) {
    // Esta função agora apenas avança para a próxima etapa
    if (form.valid) {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7); // 7 dias depois como padrão
      
      this.tempPackageData = {
        destination: form.value.destination,
        price: parseFloat(form.value.price),
        duration: form.value.duration,
        status: form.value.status,
        description: form.value.description,
        image: this.selectedImageFile ? URL.createObjectURL(this.selectedImageFile) : 'assets/images/generic-package-image.jpg'
      };
      
      // Inicializar com uma data padrão se não há datas ainda
      if (this.packageDates.length === 0) {
        this.packageDates = [{
          startDate: this.formatDateForInput(today),
          endDate: this.formatDateForInput(endDate),
          availableReservations: 10
        }];
      }
      
      this.currentStep = 2; // Avança para a tela de confirmação
    }
  }

  confirmAddPackage() {
    // Esta função realmente adiciona o pacote
    const newPackage: Package = {
      id: this.packages.length + 1,
      ...this.tempPackageData
    };
    
    this.packages.push(newPackage);
    this.resetModal();
    
    // Close modal programmatically
    const modal = document.getElementById('addPackageModal');
    if (modal) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  goBackToForm() {
    this.currentStep = 1;
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
    const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T12:00:00');
    
    // Formata especificamente no padrão brasileiro dd/mm/yyyy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  formatCurrencyBrazilian(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatNumberBrazilian(value: number): string {
    if (!value) return '0';
    return value.toLocaleString('pt-BR');
  }

  editPackage(packageItem: Package) {
    this.selectedPackage = { ...packageItem };
    this.currentEditStep = 1;
    // Preparar dados temporários para edição
    this.tempEditPackageData = {
      ...packageItem
    };
    
    // Inicializar com uma data padrão se não há datas ainda
    if (this.editPackageDates.length === 0) {
      this.editPackageDates = [{
        startDate: this.formatDateForInput(new Date()),
        endDate: this.formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        availableReservations: 10
      }];
    }
  }

  updatePackage(form: NgForm) {
    // Esta função agora apenas avança para a próxima etapa
    if (form.valid && this.selectedPackage) {
      this.tempEditPackageData = {
        ...this.tempEditPackageData,
        destination: form.value.destination,
        price: parseFloat(form.value.price),
        duration: form.value.duration,
        status: form.value.status,
        description: form.value.description,
        image: this.selectedImageFile ? URL.createObjectURL(this.selectedImageFile) : this.selectedPackage.image
      };
      
      this.currentEditStep = 2; // Avança para a tela de confirmação
    }
  }

  confirmUpdatePackage() {
    // Esta função realmente atualiza o pacote
    if (this.selectedPackage) {
      const index = this.packages.findIndex(p => p.id === this.selectedPackage!.id);
      if (index !== -1) {
        this.packages[index] = {
          id: this.selectedPackage.id,
          destination: this.tempEditPackageData.destination,
          price: this.tempEditPackageData.price,
          duration: this.tempEditPackageData.duration,
          status: this.tempEditPackageData.status,
          description: this.tempEditPackageData.description,
          image: this.tempEditPackageData.image
        };
      }
      
      this.resetEditModal();
      
      // Close modal programmatically
      const modal = document.getElementById('editPackageModal');
      if (modal) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
  }

  goBackToEditForm() {
    this.currentEditStep = 1;
  }

  resetEditModal() {
    this.currentEditStep = 1;
    this.tempEditPackageData = {};
    this.selectedPackage = null;
    this.selectedImageFile = null;
    this.editPackageDates = [];
  }

  deletePackage(packageId: number) {
    if (confirm('Tem certeza que deseja excluir este pacote?')) {
      this.packages = this.packages.filter(packageItem => packageItem.id !== packageId);
    }
  }

  // Métodos para gerenciar múltiplas datas - Modal Adicionar
  addNewDate() {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);
    
    this.packageDates.push({
      startDate: this.formatDateForInput(today),
      endDate: this.formatDateForInput(endDate),
      availableReservations: 10
    });
  }

  removeDateEntry(index: number) {
    if (this.packageDates.length > 1) {
      this.packageDates.splice(index, 1);
    }
  }

  // Métodos para gerenciar múltiplas datas - Modal Editar
  addNewEditDate() {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);
    
    this.editPackageDates.push({
      startDate: this.formatDateForInput(today),
      endDate: this.formatDateForInput(endDate),
      availableReservations: 10
    });
  }

  removeEditDateEntry(index: number) {
    if (this.editPackageDates.length > 1) {
      this.editPackageDates.splice(index, 1);
    }
  }
}
