import { Component, OnInit } from '@angular/core';

// Interfaces
interface User {
  id: number;
  name: string;
  email: string;
  reservations: number;
  permission: string;
  phone?: string;
}

interface Package {
  id: number;
  title: string;
  destination: string;
  duration: number;
  maxPeople: number;
  price: number;
  description?: string;
}

// Declare Chart.js para TypeScript
declare var bootstrap: any;
declare var Chart: any;

@Component({
  selector: 'app-admin-tela',
  imports: [],
  templateUrl: './admin-tela.html',
  styleUrl: './admin-tela-new.css'
})
export class AdminTela implements OnInit {

  // Dados mock para demonstração
  private mockUsers: User[] = [
    { id: 1, name: "Kaio Oliveira", email: "kaiooliveira@avanade.com", reservations: 8, permission: "Usuário" },
    { id: 2, name: "Maria Silva", email: "maria.silva@avanade.com", reservations: 5, permission: "Usuário" },
    { id: 3, name: "João Santos", email: "joao.santos@avanade.com", reservations: 12, permission: "Admin" },
    { id: 4, name: "Ana Costa", email: "ana.costa@avanade.com", reservations: 3, permission: "Usuário" },
    { id: 5, name: "Pedro Oliveira", email: "pedro.oliveira@avanade.com", reservations: 7, permission: "Usuário" },
    { id: 6, name: "Carla Lima", email: "carla.lima@avanade.com", reservations: 9, permission: "Usuário" },
    { id: 7, name: "Rafael Souza", email: "rafael.souza@avanade.com", reservations: 4, permission: "Usuário" },
    { id: 8, name: "Luciana Pereira", email: "luciana.pereira@avanade.com", reservations: 6, permission: "Usuário" },
    { id: 9, name: "Bruno Ferreira", email: "bruno.ferreira@avanade.com", reservations: 11, permission: "Usuário" },
    { id: 10, name: "Gabriela Rodrigues", email: "gabriela.rodrigues@avanade.com", reservations: 2, permission: "Usuário" }
  ];

  private mockPackages: Package[] = [
    { id: 1, title: "Pacotes para Igaratá", destination: "Igaratá, SP", duration: 5, maxPeople: 21, price: 2700.00 }
  ];

  // Variáveis globais
  currentUsers: User[] = [];
  currentPackages: Package[] = [];
  editingUserId: number | null = null;
  editingPackageId: number | null = null;

  // Bootstrap modal instances
  userModal: any;
  packageModal: any;

  constructor() {}

  ngOnInit(): void {
    this.currentUsers = [...this.mockUsers];
    this.currentPackages = [...this.mockPackages];
    
    // Aguardar mais tempo para garantir que o DOM está completamente carregado
    setTimeout(() => {
      this.initializeNavigation();
      this.loadUsers();
      this.loadPackages();
      this.initializeBootstrapModals();
      this.initializeSearch();
    }, 100);

    // Múltiplas tentativas para inicializar o gráfico
    setTimeout(() => this.initializeChart(), 500);
    setTimeout(() => this.initializeChart(), 1000);
    setTimeout(() => this.initializeChart(), 2000);
  }

  // Método para navegação Angular-style
  setActiveSection(section: string, event: Event): void {
    event.preventDefault();
    
    // Remove active class from all nav links and sections
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(nav => nav.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));
    
    // Add active class to clicked nav link and corresponding section
    (event.target as HTMLElement).classList.add('active');
    const targetSection = document.getElementById(section);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  // Navegação entre seções
  initializeNavigation(): void {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = (link as HTMLElement).getAttribute('data-section');
        
        // Remove active class from all nav links and sections
        navLinks.forEach(nav => nav.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked nav link and corresponding section
        link.classList.add('active');
        if (targetSection) {
          const targetElement = document.getElementById(targetSection);
          if (targetElement) {
            targetElement.classList.add('active');
          }
        }
      });
    });
  }

  // Inicializar gráfico de vendas
  initializeChart(): void {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas salesChart não encontrado');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Contexto 2D não disponível');
      return;
    }

    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
      console.error('Chart.js não está carregado');
      // Carregar Chart.js dinamicamente
      this.loadChartJS().then(() => {
        this.createChart(ctx);
      });
      return;
    }

    this.createChart(ctx);
  }

  // Carregar Chart.js dinamicamente se não estiver disponível
  private loadChartJS(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof Chart !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Chart.js'));
      document.head.appendChild(script);
    });
  }

  // Criar o gráfico
  private createChart(ctx: CanvasRenderingContext2D): void {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Paraty, RJ',
          'Bonito, MS', 
          'Gramado, RS',
          'Fernando de Noronha, PE',
          'Jericoacoara, CE',
          'Lençóis, BA',
          'Ouro Preto, MG',
          'Alter do Chão, PA'
        ],
        datasets: [{
          data: [2, 2, 2, 2, 2, 2, 2, 5],
          backgroundColor: [
            '#E53E3E',  // Paraty, RJ - Vermelho
            '#3182CE',  // Bonito, MS - Azul
            '#38A169',  // Gramado, RS - Verde
            '#00B5D8',  // Fernando de Noronha, PE - Azul claro
            '#D69E2E',  // Jericoacoara, CE - Amarelo
            '#9F7AEA',  // Lençóis, BA - Roxo
            '#48BB78',  // Ouro Preto, MG - Verde claro
            '#4FD1C7'   // Alter do Chão, PA - Verde água
          ],
          borderWidth: 0,
          borderRadius: 5,
          spacing: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            cornerRadius: 6,
            displayColors: true
          }
        },
        cutout: '60%',
        elements: {
          arc: {
            borderWidth: 0
          }
        }
      }
    });
  }

  // Carregar usuários na tabela
  loadUsers(users: User[] = this.currentUsers): void {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge bg-info">${user.reservations}</span></td>
        <td><span class="badge ${user.permission === 'Admin' ? 'bg-warning' : 'bg-secondary'}">${user.permission}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary action-btn edit-btn" data-user-id="${user.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger action-btn delete-btn" data-user-id="${user.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      // Adicionar event listeners
      const editBtn = row.querySelector('.edit-btn');
      const deleteBtn = row.querySelector('.delete-btn');
      
      if (editBtn) {
        editBtn.addEventListener('click', () => this.editUser(user.id));
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteUser(user.id));
      }
      
      tableBody.appendChild(row);
    });
  }

  // Carregar pacotes na tabela
  loadPackages(packages: Package[] = this.currentPackages): void {
    const tableBody = document.getElementById('packagesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    packages.forEach(pkg => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="fw-semibold">${pkg.title}</td>
        <td>${pkg.destination}</td>
        <td><span class="badge bg-info">${pkg.duration} dias</span></td>
        <td><span class="badge bg-success">${pkg.maxPeople}</span></td>
        <td class="fw-bold text-success">R$ ${pkg.price.toFixed(2).replace('.', ',')}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary action-btn edit-btn" data-package-id="${pkg.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger action-btn delete-btn" data-package-id="${pkg.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      // Adicionar event listeners
      const editBtn = row.querySelector('.edit-btn');
      const deleteBtn = row.querySelector('.delete-btn');
      
      if (editBtn) {
        editBtn.addEventListener('click', () => this.editPackage(pkg.id));
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deletePackage(pkg.id));
      }
      
      tableBody.appendChild(row);
    });
  }

  // Funções de usuário
  editUser(userId: number): void {
    const user = this.currentUsers.find(u => u.id === userId);
    if (!user) return;

    this.editingUserId = userId;
    
    const userNameInput = document.getElementById('userName') as HTMLInputElement;
    const userEmailInput = document.getElementById('userEmail') as HTMLInputElement;
    const userPhoneInput = document.getElementById('userPhone') as HTMLInputElement;
    const userPermissionSelect = document.getElementById('userPermission') as HTMLSelectElement;
    
    if (userNameInput) userNameInput.value = user.name;
    if (userEmailInput) userEmailInput.value = user.email;
    if (userPhoneInput) userPhoneInput.value = user.phone || '';
    if (userPermissionSelect) userPermissionSelect.value = user.permission;
    
    if (this.userModal) {
      this.userModal.show();
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.currentUsers = this.currentUsers.filter(user => user.id !== userId);
      this.loadUsers();
      
      // Show success toast
      this.showToast('Usuário excluído com sucesso!', 'success');
    }
  }

  // Funções de pacote
  editPackage(packageId: number): void {
    const pkg = this.currentPackages.find(p => p.id === packageId);
    if (!pkg) return;

    this.editingPackageId = packageId;
    
    const modalLabel = document.getElementById('packageModalLabel');
    const titleInput = document.getElementById('packageTitle') as HTMLInputElement;
    const destinationInput = document.getElementById('packageDestination') as HTMLInputElement;
    const durationInput = document.getElementById('packageDuration') as HTMLInputElement;
    const priceInput = document.getElementById('packagePrice') as HTMLInputElement;
    const maxPeopleInput = document.getElementById('packageMaxPeople') as HTMLInputElement;
    const descriptionInput = document.getElementById('packageDescription') as HTMLTextAreaElement;
    
    if (modalLabel) modalLabel.textContent = 'Editar pacote';
    if (titleInput) titleInput.value = pkg.title;
    if (destinationInput) destinationInput.value = pkg.destination;
    if (durationInput) durationInput.value = pkg.duration.toString();
    if (priceInput) priceInput.value = pkg.price.toString();
    if (maxPeopleInput) maxPeopleInput.value = pkg.maxPeople.toString();
    if (descriptionInput) descriptionInput.value = pkg.description || '';
    
    if (this.packageModal) {
      this.packageModal.show();
    }
  }

  deletePackage(packageId: number): void {
    if (confirm('Tem certeza que deseja excluir este pacote?')) {
      this.currentPackages = this.currentPackages.filter(pkg => pkg.id !== packageId);
      this.loadPackages();
      
      // Show success toast
      this.showToast('Pacote excluído com sucesso!', 'success');
    }
  }

  createPackage(): void {
    this.editingPackageId = null;
    const modalLabel = document.getElementById('packageModalLabel');
    const packageForm = document.getElementById('packageForm') as HTMLFormElement;
    
    if (modalLabel) modalLabel.textContent = 'Criar pacote';
    if (packageForm) packageForm.reset();
    
    if (this.packageModal) {
      this.packageModal.show();
    }
  }

  // Inicializar modais do Bootstrap
  initializeBootstrapModals(): void {
    const userModalElement = document.getElementById('userModal');
    const packageModalElement = document.getElementById('packageModal');
    
    if (userModalElement) {
      this.userModal = new bootstrap.Modal(userModalElement);
    }
    
    if (packageModalElement) {
      this.packageModal = new bootstrap.Modal(packageModalElement);
    }

    // Botão criar pacote
    const createPackageBtn = document.getElementById('createPackageBtn');
    if (createPackageBtn) {
      createPackageBtn.addEventListener('click', () => this.createPackage());
    }

    // Upload de imagem
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('packageImage') as HTMLInputElement;

    if (uploadArea && fileInput) {
      uploadArea.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0] && uploadArea) {
          uploadArea.innerHTML = `
            <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
            <p class="text-success mb-0">Imagem selecionada: ${this.files[0].name}</p>
          `;
        }
      });
    }

    // Form submissions
    const userForm = document.getElementById('userForm') as HTMLFormElement;
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (this.editingUserId) {
          // Atualizar usuário existente
          const userIndex = this.currentUsers.findIndex(u => u.id === this.editingUserId);
          if (userIndex !== -1) {
            const userNameInput = document.getElementById('userName') as HTMLInputElement;
            const userEmailInput = document.getElementById('userEmail') as HTMLInputElement;
            const userPhoneInput = document.getElementById('userPhone') as HTMLInputElement;
            const userPermissionSelect = document.getElementById('userPermission') as HTMLSelectElement;
            
            this.currentUsers[userIndex] = {
              ...this.currentUsers[userIndex],
              name: userNameInput?.value || '',
              email: userEmailInput?.value || '',
              phone: userPhoneInput?.value || '',
              permission: userPermissionSelect?.value || ''
            };
            this.showToast('Usuário atualizado com sucesso!', 'success');
          }
        }
        
        this.loadUsers();
        if (this.userModal) {
          this.userModal.hide();
        }
        this.editingUserId = null;
      });
    }

    const packageForm = document.getElementById('packageForm') as HTMLFormElement;
    if (packageForm) {
      packageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titleInput = document.getElementById('packageTitle') as HTMLInputElement;
        const destinationInput = document.getElementById('packageDestination') as HTMLInputElement;
        const durationInput = document.getElementById('packageDuration') as HTMLInputElement;
        const priceInput = document.getElementById('packagePrice') as HTMLInputElement;
        const maxPeopleInput = document.getElementById('packageMaxPeople') as HTMLInputElement;
        const descriptionInput = document.getElementById('packageDescription') as HTMLTextAreaElement;
        
        const packageData: Partial<Package> = {
          title: titleInput?.value || '',
          destination: destinationInput?.value || '',
          duration: parseInt(durationInput?.value || '0'),
          price: parseFloat(priceInput?.value || '0'),
          maxPeople: parseInt(maxPeopleInput?.value || '0'),
          description: descriptionInput?.value || ''
        };

        if (this.editingPackageId) {
          // Atualizar pacote existente
          const packageIndex = this.currentPackages.findIndex(p => p.id === this.editingPackageId);
          if (packageIndex !== -1) {
            this.currentPackages[packageIndex] = {
              ...this.currentPackages[packageIndex],
              ...packageData
            } as Package;
            this.showToast('Pacote atualizado com sucesso!', 'success');
          }
        } else {
          // Criar novo pacote
          const newPackage: Package = {
            id: Math.max(...this.currentPackages.map(p => p.id)) + 1,
            ...packageData
          } as Package;
          this.currentPackages.push(newPackage);
          this.showToast('Pacote criado com sucesso!', 'success');
        }
        
        this.loadPackages();
        if (this.packageModal) {
          this.packageModal.hide();
        }
        this.editingPackageId = null;
      });
    }

    // Delete user button in modal
    const deleteUserBtn = document.getElementById('deleteUserBtn');
    if (deleteUserBtn) {
      deleteUserBtn.addEventListener('click', () => {
        if (this.editingUserId && confirm('Tem certeza que deseja excluir este usuário?')) {
          this.deleteUser(this.editingUserId);
          if (this.userModal) {
            this.userModal.hide();
          }
          this.editingUserId = null;
        }
      });
    }
  }

  // Inicializar funcionalidade de busca
  initializeSearch(): void {
    const searchInputs = document.querySelectorAll('.search-input') as NodeListOf<HTMLInputElement>;
    const searchButtons = document.querySelectorAll('.search-btn');

    searchButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const searchInput = searchInputs[index];
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (index === 0) {
          // Busca de usuários
          if (searchTerm) {
            const filteredUsers = this.mockUsers.filter(user =>
              user.name.toLowerCase().includes(searchTerm) ||
              user.email.toLowerCase().includes(searchTerm)
            );
            this.loadUsers(filteredUsers);
          } else {
            this.loadUsers(this.mockUsers);
          }
        } else {
          // Busca de pacotes
          if (searchTerm) {
            const filteredPackages = this.mockPackages.filter(pkg =>
              pkg.title.toLowerCase().includes(searchTerm) ||
              pkg.destination.toLowerCase().includes(searchTerm)
            );
            this.loadPackages(filteredPackages);
          } else {
            this.loadPackages(this.mockPackages);
          }
        }
      });
    });

    // Busca em tempo real
    searchInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        const searchTerm = input.value.toLowerCase().trim();
        
        if (index === 0) {
          // Busca de usuários
          if (searchTerm) {
            const filteredUsers = this.mockUsers.filter(user =>
              user.name.toLowerCase().includes(searchTerm) ||
              user.email.toLowerCase().includes(searchTerm)
            );
            this.loadUsers(filteredUsers);
          } else {
            this.loadUsers(this.mockUsers);
          }
        } else {
          // Busca de pacotes
          if (searchTerm) {
            const filteredPackages = this.mockPackages.filter(pkg =>
              pkg.title.toLowerCase().includes(searchTerm) ||
              pkg.destination.toLowerCase().includes(searchTerm)
            );
            this.loadPackages(filteredPackages);
          } else {
            this.loadPackages(this.mockPackages);
          }
        }
      });
    });
  }

  // Toast notifications
  showToast(message: string, type: string = 'info'): void {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'info-circle text-info'} me-2"></i>
          <strong class="me-auto">Ôrvian Admin</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
      });
      
      toast.show();

      // Remove toast element after it's hidden
      toastElement.addEventListener('hidden.bs.toast', function(this: HTMLElement) {
        this.remove();
      });
    }
  }

}
