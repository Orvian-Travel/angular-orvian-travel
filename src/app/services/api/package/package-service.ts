import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../entities/paged-response.model';
import { environment } from '../../../../environments/environment';
import { PackageDetail, SavePackageRequest, SavePackageResponse, UpdatePackageRequest } from '../../entities/package.model';
import { IPackageService } from './package-service.interface';


@Injectable({
  providedIn: 'root'
})
export class PackageService implements IPackageService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/packages`;

  public getAllPackages(pageNumber: number = 0, pageSize: number = 6): Observable<PackageDetail[]> {
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<PagedResponse>(url).pipe(
      map(response => response._embedded.packageSearchResultDTOList)
    );
  }

  public getAllPackagesWithPagination(pageNumber: number = 0, pageSize: number = 6): Observable<PagedResponse> {
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<PagedResponse>(url);
  }

  public getPackageById(id: string): Observable<PackageDetail> {
    return this.http.get<PackageDetail>(`${this.baseUrl}/${id}`);
  }

  createPackage(savePackageRequest: SavePackageRequest): Observable<SavePackageResponse> {
    throw new Error('Method not implemented.');
  }

  updatePackage(id: string, UpdatePackageRequest: UpdatePackageRequest): Observable<void> {
    throw new Error('Method not implemented.');
  }

  deletePackage(id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
