import { Injectable } from '@angular/core';
import { PackageService } from '../../services/api/package/package-service';
import { UserService } from '../../services/api/user/user-service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotDataService {
  
  constructor(
    private packageService: PackageService,
    private userService: UserService
  ) {}

  async getPackagesByDestination(destination: string) {
    try {
      // Buscar pacotes que contenham o destino
      const response = await this.packageService.getAllPackagesWithPagination(0, 20).toPromise();
      const packages = response?._embedded?.DTOList || [];
      
      return packages.filter(pkg => 
        pkg.destination?.toLowerCase().includes(destination.toLowerCase()) ||
        pkg.title?.toLowerCase().includes(destination.toLowerCase())
      );
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
      return [];
    }
  }

  async getAllDestinations() {
    try {
      const response = await this.packageService.getAllPackagesWithPagination(0, 100).toPromise();
      const packages = response?._embedded?.DTOList || [];
      
      // Extrair destinos únicos
      const destinations = [...new Set(packages.map(pkg => pkg.destination))];
      return destinations.filter(dest => dest && dest.trim() !== '');
    } catch (error) {
      console.error('Erro ao buscar destinos:', error);
      return [];
    }
  }

  formatPackageInfo(packages: any[]) {
    if (packages.length === 0) {
      return "Não encontrei pacotes específicos para esse destino, mas temos muitas outras opções incríveis! 🌎";
    }

    let response = `Encontrei ${packages.length} pacote(s) para você! ✈️\n\n`;
    
    packages.slice(0, 3).forEach((pkg, index) => {
      response += `${index + 1}. **${pkg.title}**\n`;
      response += `   📍 Destino: ${pkg.destination}\n`;
      response += `   💰 A partir de: R$ ${pkg.price?.toLocaleString('pt-BR')}\n`;
      response += `   ⏱️ Duração: ${pkg.duration} dias\n`;
      if (pkg.description) {
        response += `   📝 ${pkg.description.substring(0, 100)}...\n`;
      }
      response += `\n`;
    });

    if (packages.length > 3) {
      response += `E mais ${packages.length - 3} opções disponíveis! 🎉\n\n`;
    }

    response += "Gostaria de mais detalhes sobre algum desses pacotes? 😊";
    return response;
  }

  async getPackageRecommendations(userPreferences: string) {
    try {
      const response = await this.packageService.getAllPackagesWithPagination(0, 10).toPromise();
      const packages = response?._embedded?.DTOList || [];
      
      // Ordenar por preço ou alguma lógica de recomendação
      return packages.sort((a, b) => (a.price || 0) - (b.price || 0)).slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
      return [];
    }
  }

  async getPopularDestinations() {
    try {
      const destinations = await this.getAllDestinations();
      // Retornar alguns destinos populares (pode ser baseado em dados reais)
      return destinations.slice(0, 5);
    } catch (error) {
      console.error('Erro ao buscar destinos populares:', error);
      return ['Nordeste', 'Europa', 'Caribe', 'Ásia', 'América do Sul'];
    }
  }
}
