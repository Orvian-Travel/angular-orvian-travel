import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { AdminUsers } from '../admin-users/admin-users';
import { AdminPackages } from '../admin-packages/admin-packages';

@Component({
  selector: 'app-admin-tela',
  imports: [CommonModule, AdminDashboard, AdminUsers, AdminPackages],
  templateUrl: './admin-tela.html',
  styleUrl: './admin-tela-new.css'
})
export class AdminTela implements OnInit {
  activeSection = 'dashboard';

  ngOnInit() {
    this.activeSection = 'dashboard';
  }

  setActiveSection(section: string, event: Event) {
    event.preventDefault();
    this.activeSection = section;
    
    // Update navigation active states
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    (event.target as HTMLElement).classList.add('active');
  }
}
