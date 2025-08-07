import { Dashboard } from "@services/entities/dashboard.model";
import { Observable } from "rxjs";

export interface IAdminService {
  getDashboardWeekReview(): Observable<Dashboard>;
  exportReservationsPDF(): Observable<Blob>;
  exportReservationsExcel(): Observable<Blob>;
}
