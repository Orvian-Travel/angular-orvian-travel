import { PagedResponse } from "../../services/entities/paged-response.model";

export function transformPagedResponse<T>(apiResponse: any, dtoKey: string): PagedResponse<T> {
  if (!apiResponse || !apiResponse._embedded) {
    return {
      _embedded: {
        DTOList: []
      },
      _links: apiResponse?._links || {},
      page: apiResponse?.page || { size: 0, totalElements: 0, totalPages: 0, number: 0 }
    };
  }

  return {
    _embedded: {
      DTOList: apiResponse._embedded[dtoKey] || []
    },
    _links: apiResponse._links,
    page: apiResponse.page
  };
}
