export interface PagedResponse<T> {
  _embedded: {
    DTOList: T[];
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
