import { Observable } from "rxjs";
import {
  PackageDetail,
  SavePackageRequest,
  SavePackageResponse,
  UpdatePackageRequest,
} from "../../entities/package.model";
import { PagedResponse } from "../../entities/paged-response.model";

export interface IPackageService {

  getAllPackages(pageNumber: number, pageSize: number): Observable<PackageDetail[]>;

  getAllPackagesWithPagination(pageNumber: number, pageSize: number): Observable<PagedResponse<PackageDetail>>;

  getAllPackagesWithTitleAndPagination(pageNumber: number, pageSize: number, title: string): Observable<PagedResponse<PackageDetail>>;

  getAllPackagesBySearchPagination(pageNumber: number, pageSize: number, title: string, startDate: string, maxPeople: number): Observable<PagedResponse<PackageDetail>>;

  getPackageById(id: string): Observable<PackageDetail>;

  createPackage(savePackageRequest: SavePackageRequest): Observable<SavePackageResponse>;

  updatePackage(id: string, UpdatePackageRequest: UpdatePackageRequest): Observable<void>;

  deletePackage(id: string): Observable<void>;
}
