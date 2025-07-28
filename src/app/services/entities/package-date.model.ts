export interface PackageDateDetail {
  id: string;
  startDate: Date;
  endDate: Date;
  qtd_available: number;
  travelPackageId: string;
}

export interface SavePackageDateRequest {
  startDate: Date;
  endDate: Date;
  qtd_available: number;
  travelPackageId: string;
}

export interface SavePackageDateResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  qtd_available: number;
  travelPackageId: string;
}

export interface UpdatePackageDateRequest {
  startDate: Date;
  endDate: Date;
  qtd_available: number;
  travelPackageId: string;
}

// export interface UpdatePackageDateResponse {
//   id: string;
//   startDate: Date;
//   endDate: Date;
//   qtd_available: number;
//   travelPackageId: string;
// }
