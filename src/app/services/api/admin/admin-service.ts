import { Injectable } from '@angular/core';
import { IAdminService } from './admin-service.interface';
import { Dashboard } from '@services/entities/dashboard.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements IAdminService {
  constructor(private http: HttpClient, private configService: ConfigService) { }

  private get baseUrl() { return `${this.configService.getApiUrl()}/admin`; }

  getDashboardWeekReview(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/dashboard-week`);
  }

  exportReservationsPDF(): Observable<Blob> {
    return this.http.get(`${this.configService.getApiUrl()}/reservations/export-pdf`, {
      responseType: 'blob'
    });
  }

  exportReservationsExcel(): Observable<Blob> {
    return this.http.get(`${this.configService.getApiUrl()}/reservations/export-sheet`, {
      responseType: 'blob'
    });
  }


}
