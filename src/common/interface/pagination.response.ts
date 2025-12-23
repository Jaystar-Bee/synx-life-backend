export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    numberOfPages: number;
  };
}
