'use client';

import { FormEvent, ChangeEvent } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useSearchParamsHelper } from '@/hooks/useSearchParams';
import { SORT_OPTIONS } from '@/constant/options';

interface ProductSearchProps {
  isLoading?: boolean;
}

export default function ProductSearch({ isLoading = false }: ProductSearchProps) {
  const { updateSearch, updateSort, getCurrentSort, getSearchValue } = useSearchParamsHelper();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search')?.toString() || '';
    updateSearch(search);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateSort(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <Input
            name="search"
            placeholder="상품 검색"
            defaultValue={getSearchValue()}
            className="w-sm"
          />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            검색
          </Button>
        </div>
        <Select
          name="sort"
          options={SORT_OPTIONS}
          defaultValue={getCurrentSort()}
          onChange={handleSortChange}
          className="w-40"
        />
      </div>
    </form>
  );
}
