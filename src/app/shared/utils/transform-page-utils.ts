import { PagedResponse } from "../../services/entities/paged-response.model";

export function transformPagedResponse<T>(apiResponse: any, dtoKey: string): PagedResponse<T> {
  return {
    _embedded: {
      DTOList: apiResponse._embedded[dtoKey] || []
    },
    _links: apiResponse._links,
    page: apiResponse.page
  };
}
