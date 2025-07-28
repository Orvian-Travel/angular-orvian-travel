import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Package as PackageEntity } from '../../entities/package';
import { PagedResponse } from '../../entities/paged-response';

@Injectable({
  providedIn: 'root'
})
export class Package {
  constructor(private http: HttpClient) {
  }

  baseUrl: string = 'http://localhost:8080/api/v1/packages';

  public getAllPackages(pageNumber: number = 0, pageSize: number = 6): Observable<PackageEntity[]>{
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<PagedResponse>(url).pipe(
      map(response => response._embedded.packageSearchResultDTOList)
    );
  }

  public getAllPackagesWithPagination(pageNumber: number = 0, pageSize: number = 6): Observable<PagedResponse>{
    const url = `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<PagedResponse>(url);
  }

  public getPackageById(id: string): Observable<PackageEntity>{
    return this.http.get<PackageEntity>(`${this.baseUrl}/${id}`);
  }
}
