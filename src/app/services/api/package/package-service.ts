import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../entities/paged-response.model';
import {
  PackageDetail,
  SavePackageRequest,
  SavePackageResponse,
  UpdatePackageRequest
} from '../../entities/package.model';
import { IPackageService } from './package-service.interface';
import { transformPagedResponse } from '../../../shared/utils/transform-page-utils';
import { ConfigService } from '../../config.service';


@Injectable({
  providedIn: 'root'
})
export class PackageService implements IPackageService {
  constructor(private http: HttpClient, private configService: ConfigService) { }

  private get baseUrl() { return `${this.configService.getApiUrl()}/packages`; }

  public getAllPackages(pageNumber: number = 0, pageSize: number = 6): Observable<PackageDetail[]> {
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(
      map(response => transformPagedResponse<PackageDetail>(response, 'packageSearchResultDTOList')),
      map(pagedResponse => pagedResponse._embedded.DTOList)
    );
  }

  public getAllPackagesWithPagination(pageNumber: number = 0, pageSize: number = 6): Observable<PagedResponse<PackageDetail>> {
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(
      map(response => transformPagedResponse<PackageDetail>(response, 'packageSearchResultDTOList'))
    );
  }

  public getAllPackagesWithTitleAndPagination(pageNumber: number, pageSize: number, title: string): Observable<PagedResponse<PackageDetail>> {
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&title=${title}`;
    return this.http.get<any>(url).pipe(
      map(response => transformPagedResponse<PackageDetail>(response, 'packageSearchResultDTOList'))
    );
  }

  getAllPackagesBySearchPagination(
    pageNumber: number = 0,
    pageSize: number = 10,
    title: string,
    startDate: string = new Date().toISOString().split('T')[0],
    maxPeople: number
  ): Observable<PagedResponse<PackageDetail>> {
    const url = `${this.baseUrl}/search?pageNumber=${pageNumber}&pageSize=${pageSize}&title=${title}&startDate=${startDate}&maxPeople=${maxPeople}`;
    console.log('URL for search:', url);
    return this.http.get<any>(url).pipe(
      map(response => transformPagedResponse<PackageDetail>(response, 'packageSearchResultDTOList'))
    )
  }

  public getPackageById(id: string): Observable<PackageDetail> {
    return this.http.get<PackageDetail>(`${this.baseUrl}/${id}`);
  }

  createPackage(savePackageRequest: SavePackageRequest): Observable<SavePackageResponse> {
    return this.http.post<SavePackageResponse>(this.baseUrl, savePackageRequest);
  }

  updatePackage(id: string, UpdatePackageRequest: UpdatePackageRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, UpdatePackageRequest);
  }

  deletePackage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
