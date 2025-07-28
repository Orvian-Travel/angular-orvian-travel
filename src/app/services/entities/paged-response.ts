import { Package } from './package';

export interface PagedResponse {
  _embedded: {
    packageSearchResultDTOList: Package[];
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