import { PackageDetail } from './package.model';

export interface PagedResponse {
  _embedded: {
    packageSearchResultDTOList: PackageDetail[];
  };
  _links?: {
    first?: { href: string };
    self?: { href: string };
    next?: { href: string };
    last?: { href: string };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
