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
  createdAt: Date;
  updatedAt: Date;
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
