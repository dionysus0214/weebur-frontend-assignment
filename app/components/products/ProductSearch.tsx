'use client';

import { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const sortOptions = [
  { value: '', label: '기본 정렬' },
  { value: 'rating', label: '별점 높은 순' }
];

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search')?.toString() || '';
    const sort = formData.get('sort')?.toString() || '';
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="flex gap-4">
        <Input
          name="search"
          placeholder="상품 검색"
          defaultValue={searchParams.get('search') ?? ''}
          className="flex-1"
        />
        <Select
          name="sort"
          options={sortOptions}
          defaultValue={searchParams.get('sort') ?? ''}
          className="w-40"
        />
        <Button type="submit" variant="primary">
          검색
        </Button>
      </div>
    </form>
  );
}
