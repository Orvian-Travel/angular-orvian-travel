import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Developer {
  name: string;
  role: string;
  image: string;
  linkedinUrl: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    FooterComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent {
  developers: Developer[] = [
    {
      name: 'Silas Henrique Silva',
      role: 'Fullstack Developer',
      image: 'assets/images/Silas.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/silas-henrique-silva/',
      description: 'Desenvolvedor Spring Boot e Angular.'
    },
    {
      name: 'Dalton Joaquim Soares Guimarães',
      role: 'Fullstack Developer',
      image: 'assets/images/Dalton.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/dalton-joaquim-soares-guimar%C3%A3es-13a897231/',
      description: 'Desenvolvedor Spring Boot e Angular.'
    },
    {
      name: 'Leonardo Lima Ferreira',
      role: 'Fullstack Developer',
      image: 'assets/images/Leonardo.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/leolimaferreira/',
      description: 'Desenvolvedor Spring Boot e Angular, Azure DevOps Engineer.'
    },
    {
      name: 'Vitor D\'Angelo do Prado',
      role: 'Fullstack Developer',
      image: 'assets/images/Vito D\'Angelo.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/vitor-dangelo-do-prado/',
      description: 'Desenvolvedor Spring Boot e Angular.'
    },
    {
      name: 'Vitor Rodrigues Souza',
      role: 'Frontend Developer',
      image: 'assets/images/Vitor Rodrigues.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/vitor-souza-a694b726a/',
      description: 'Desenvolvedor Spring Boot e Angular.'
    },
    {
      name: 'Diego de Mello',
      role: 'Fullstack Developer',
      image: 'assets/images/Diego.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/diego-de-mello/',
      description: 'Desenvolvedor Spring Boot e Angular, UI Designer.'
    }
  ];

  openLinkedin(url: string): void {
    window.open(url, '_blank');
  }
}
