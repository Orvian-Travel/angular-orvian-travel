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
    const roleMap: { [key: string]: string } = {
      'USER': 'Usuário',
      'ADMIN': 'Administrador',
      'ATENDENTE': 'Atendente'
    };
    return roleMap[role?.toUpperCase()] || role || 'N/A';
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

  

  /*
  addUser(form: NgForm) {
    if (form.valid) {
      const newUser: User = {
        id: this.users.length + 1,
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        role: form.value.role,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      
      this.users.push(newUser);
      form.resetForm();
      
      // Close modal programmatically
      const modal = document.getElementById('addUserModal');
      if (modal) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
  }

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
