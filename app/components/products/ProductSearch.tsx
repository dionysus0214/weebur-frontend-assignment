'use client';

import { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
        <input
          name="search"
          placeholder="상품 검색"
          defaultValue={searchParams.get('search') ?? ''}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          name="sort"
          defaultValue={searchParams.get('sort') ?? ''}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">기본 정렬</option>
          <option value="rating">별점 높은 순</option>
        </select>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          검색
        </button>
      </div>
    </form>
  );
}
