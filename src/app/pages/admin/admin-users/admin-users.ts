import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    // Mock data - replace with actual API call
    this.users = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        role: 'Administrador',
        createdAt: '15/01/2024'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(21) 97654-3210',
        role: 'Usuário',
        createdAt: '10/01/2024'
      },
      {
        id: 3,
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '(31) 96543-2109',
        role: 'Usuário',
        createdAt: '05/01/2024'
      }
    ];
  }

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
}
