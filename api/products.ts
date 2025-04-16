import axios from 'axios';
import { ProductsResponse } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

interface FetchProductsParams {
  skip?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export async function fetchProducts({
  skip = 0,
  limit = 20,
  search = '',
  sort = '',
}: FetchProductsParams): Promise<ProductsResponse> {
  const endpoint = search
    ? `${BASE_URL}/products/search`
    : `${BASE_URL}/products`;

  const response = await axios.get(endpoint, {
    params: {
      skip,
      limit,
      q: search,
      ...(sort === 'rating' && { sort: 'rating', order: 'desc' }),
    },
  });

  return response.data;
}
