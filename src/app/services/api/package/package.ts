import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Package as PackageEntity } from '../../entities/package';

@Injectable({
  providedIn: 'root'
})
export class Package {
  constructor(private http: HttpClient) {
  }

  baseUrl: string = 'http://localhost:8080/api/v1/packages';

  public getAllPackages(): Observable<PackageEntity[]>{
    return this.http.get<PackageEntity[]>(this.baseUrl);
  }
}
