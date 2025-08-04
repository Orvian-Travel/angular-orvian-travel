import { PackageDateDetail, SavePackageDateRequest, SavePackageDateResponse } from "./package-date.model";


export interface PackageDetail {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxPeople: number;
  packageDates: PackageDateDetail[];
  medias: PackageMediaDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageMediaDetail {
  id: string;
  type: string;
  contentType?: string;
}

export interface SavePackageRequest {
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxPeople: number;
  packageDates: SavePackageDateRequest[];
}

export interface SavePackageResponse {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxPeople: number;
  packageDates: SavePackageDateResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePackageRequest {
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxPeople: number;
}

export interface SumTotalByPackage {
  destination: string;
  name: string;                        // mudança aqui
  reservationYear: number;
  reservationWeek: number;
  confirmedReservationsCount: number;  // mudança aqui
  approvedPaymentsSum: number;         // mudança aqui
}

// export interface UpdatePackageResponse {
//   id: string;
//   title: string;
//   description: string;
//   destination: string;
//   duration: number;
//   price: number;
//   maxPeople: number;
//   packageDates: UpdatePackageDateResponse[];
//   createdAt: Date;
//   updatedAt: Date;
// }
