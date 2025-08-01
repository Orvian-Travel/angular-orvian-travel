export interface PackageDateDetail {
  id: string;
  startDate: Date;
  endDate: Date;
  qtd_available: number;
  travelPackageId: string;
  packageTitle: string;
  packageDestination: string;
  packageDuration: number;
}

export interface SavePackageDateRequest {
  startDate: Date;
  endDate: Date;
  qtd_available: number;
}

export interface SavePackageDateResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  qtd_available: number;
  travelPackageId: string;
}

export interface UpdatePackageDateRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  qtd_available: number;
}

// export interface UpdatePackageDateResponse {
//   id: string;
//   startDate: Date;
//   endDate: Date;
//   qtd_available: number;
//   travelPackageId: string;
// }
