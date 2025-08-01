import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserDetail } from '../../../services/entities/user.model';
import { UserService } from '../../../services/api/user/user-service';
import { PagedResponse } from '../../../services/entities/paged-response.model';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  users: UserDetail[] = [];
  loading = false;
  error: string | null = null;
  documentType: string = '';

  newUser: any = {
    name: '',
    email: '',
    password: '',
    phone: '',
    document: '',
    birthDate: ''
  };

  currentPage = 0;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;

  constructor(private userService: UserService){}
  
  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsersWithPagination(this.currentPage, this.pageSize).subscribe({
      next: (response: PagedResponse<UserDetail>) => {
        this.users = response._embedded.DTOList;
        this.totalUsers = response.page?.totalElements || 0;
        this.totalPages = response.page?.totalPages || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar usuários. Por favor, tente novamente mais tarde.';
        this.loading = false;
      }
    });
  }

  getRoleDisplayName(role: string): string {
    switch (role?.toUpperCase()) {
      case 'USER':
        return 'Usuário';
      case 'ADMIN':
        return 'Administrador';
      case 'ATENDENTE':
        return 'Atendente';
      default:
        return role || 'N/A';
    }
  }
  
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage() {
    if(this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  goToPage(page: number) {
    console.log('Mudando da página', this.currentPage, 'para a página', page);
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  getPageNumbers(): number[]{
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if(this.totalPages <= maxPagesToShow) {
      for(let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(0, this.currentPage - 2);
      const endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);
      for(let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  addUser(form: NgForm) {
    if (form.valid) {
      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          this.loadUsers();
          form.resetForm();
          this.newUser = { name: '', email: '', password: '', phone: '', document: '', birthDate: ''};

          const modal = document.getElementById('addUserModal');
          if (modal) {
            if(document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        },
        error: (err) => {
          alert('Erro ao adicionar usuário: ' + (err?.error?.message || 'Tente novamente.'));
        }
      });
    }
  }

  onDocumentTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.documentType = select.value;
    this.newUser.document = '';
    const documentInput = document.querySelector('#userDocument') as HTMLInputElement;
    if (documentInput) {
      documentInput.disabled = !select.value;
      documentInput.value = '';
      if (select.value === 'cpf') {
        documentInput.placeholder = '000.000.000-00';
        documentInput.maxLength = 14;
        documentInput.className = 'form-control form-control-custom document-number-input cpf-input';
      } else if (select.value === 'passport') {
        documentInput.placeholder = 'AB123456';
        documentInput.maxLength = 8;
        documentInput.className = 'form-control form-control-custom document-number-input passport-input';
      } else {
        documentInput.placeholder = 'Selecione o tipo de documento';
        documentInput.className = 'form-control form-control-custom document-number-input';
      }
    }
  }

  formatCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    input.value = value;
    this.newUser.document = value;
  }

  formatPassport(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    let formattedValue = '';
    let letterCount = 0;
    let numberCount = 0;
    for (let i = 0; i < value.length && formattedValue.length < 8; i++) {
      const char = value[i];
      if (letterCount < 2) {
        if (/[a-zA-Z]/.test(char)) {
          formattedValue += char.toUpperCase();
          letterCount++;
        }
      } else if (numberCount < 6) {
        if (/[0-9]/.test(char)) {
          formattedValue += char;
          numberCount++;
        }
      }
    }
    input.value = formattedValue;
    this.newUser.document = formattedValue;
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = value;
    this.newUser.phone = value;
  }


  /*
  editUser(user: User) {
    this.selectedUser = { ...user };
  }

  updateUser(form: NgForm) {
    if (form.valid && this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.selectedUser,
          name: form.value.name,
          email: form.value.email,
          phone: form.value.phone,
          role: form.value.role
        };
      }
      
      this.selectedUser = null;
      
      // Close modal programmatically
      const modal = document.getElementById('editUserModal');
      if (modal) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
  }

  deleteUser(userId: number) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.users = this.users.filter(user => user.id !== userId);
    }
  }
     */
}
