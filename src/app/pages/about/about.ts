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
      role: 'Full Stack Developer & Tech Lead',
      image: 'assets/images/Silas.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/silas-henrique-silva/',
      description: 'Especialista em desenvolvimento web com foco em Angular e Node.js'
    },
    {
      name: 'Dalton Joaquim Soares Guimarães',
      role: 'Backend Developer',
      image: 'assets/images/Dalton.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/dalton-joaquim-soares-guimar%C3%A3es-13a897231/',
      description: 'Desenvolvedor backend especializado em APIs e arquitetura de sistemas'
    },
    {
      name: 'Leonardo Lima Ferreira',
      role: 'Frontend Developer',
      image: 'assets/images/Leonardo.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/leolimaferreira/',
      description: 'Desenvolvedor frontend com expertise em React e Angular'
    },
    {
      name: 'Vitor D\'Angelo do Prado',
      role: 'Full Stack Developer',
      image: 'assets/images/Vito D\'Angelo.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/vitor-dangelo-do-prado/',
      description: 'Desenvolvedor full stack com experiência em tecnologias modernas'
    },
    {
      name: 'Vitor Rodrigues Souza',
      role: 'Frontend Developer',
      image: 'assets/images/Vitor Rodrigues.jpeg',
      linkedinUrl: 'https://www.linkedin.com/in/vitor-souza-a694b726a/',
      description: 'Especialista em desenvolvimento frontend e experiência do usuário'
    },
    {
      name: 'Diego de Mello',
      role: 'Backend Developer',
      image: 'assets/images/Diego.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/diego-de-mello/',
      description: 'Desenvolvedor backend com foco em performance e escalabilidade'
    }
  ];

  openLinkedin(url: string): void {
    window.open(url, '_blank');
  }
}
