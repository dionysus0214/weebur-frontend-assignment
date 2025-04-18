import { useRouter, useSearchParams } from 'next/navigation';

interface UseSearchParamsReturn {
  searchParams: URLSearchParams;
  updateSearch: (search: string) => void;
  updateSort: (sortValue: string) => void;
  getCurrentSort: () => string;
  getSearchValue: () => string;
}

export function useSearchParamsHelper(): UseSearchParamsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (params: URLSearchParams) => {
    router.push(`/?${params.toString()}`);
  };

  const updateSearch = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    updateParams(params);
  };

  const updateSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      const [sortBy, order] = sortValue.split('_');
      params.set('sortBy', sortBy);
      params.set('order', order);
    } else {
      params.delete('sortBy');
      params.delete('order');
    }
    updateParams(params);
  };

  const getCurrentSort = () => {
    return searchParams.get('sortBy') && searchParams.get('order')
      ? `${searchParams.get('sortBy')}_${searchParams.get('order')}`
      : '';
  };

  const getSearchValue = () => {
    return searchParams.get('search') ?? '';
  };

  return {
    searchParams: new URLSearchParams(searchParams.toString()),
    updateSearch,
    updateSort,
    getCurrentSort,
    getSearchValue,
  };
}
