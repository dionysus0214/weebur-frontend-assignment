import axios, { AxiosError } from 'axios';
import { ProductsResponse } from '@/types/product';
import { API } from '@/constant/api';

interface FetchProductsParams {
  skip?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export class ProductApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ProductApiError';
  }
}

export async function fetchProducts({
  skip = 0,
  limit = API.DEFAULT_LIMIT,
  search = '',
  sortBy = '',
  order = 'desc',
}: FetchProductsParams): Promise<ProductsResponse> {
  try {
    const endpoint = search
      ? API.ENDPOINTS.PRODUCT_SEARCH
      : API.ENDPOINTS.PRODUCTS;

    const response = await axios.get<ProductsResponse>(`${API.BASE_URL}${endpoint}`, {
      params: {
        skip,
        limit,
        q: search,
        ...(sortBy && { 
          sortBy,
          order 
        }),
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ProductApiError(
        error.response?.data?.message || '상품 데이터를 가져오는데 실패했습니다.',
        error.response?.status
      );
    }
    throw new ProductApiError('알 수 없는 에러가 발생했습니다.');
  }
}
