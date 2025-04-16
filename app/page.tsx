'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { storage } from '@/utils/storage';
import { fetchProducts } from '@/api/products';
import type { ViewType, ProductsResponse } from '@/types/product';
import ProductCard from './components/products/ProductCard';
import ProductSearch from './components/products/ProductSearch';

export default function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '';
  
  const [viewType, setViewType] = useState<ViewType>('grid');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedView = storage.getViewType();
    const savedTime = storage.getViewTypeTimestamp();
    
    const shouldResetView = () => {
      if (!savedTime) return true;
      const timeDiff = Date.now() - savedTime;
      return timeDiff > 24 * 60 * 60 * 1000;
    };

    if (!savedView || shouldResetView()) {
      const newView = Math.random() < 0.5 ? 'grid' : 'list';
      storage.setViewType(newView);
      setViewType(newView as ViewType);
    } else {
      setViewType(savedView as ViewType);
    }
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<ProductsResponse, Error, InfiniteData<ProductsResponse>, string[], number>({
    queryKey: ['products', search, sort],
    queryFn: ({ pageParam }) => 
      fetchProducts({ 
        skip: pageParam, 
        limit: 20, 
        search, 
        sort 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.products.length < 20) return undefined;
      return lastPage.skip + lastPage.limit;
    },
  });

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const products = data?.pages.flatMap(page => page.products) ?? [];

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductSearch />
      
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">일치하는 결과가 없습니다.</div>
      ) : (
        <div className={`
          grid gap-6
          ${viewType === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1'
          }
        `}>
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              viewType={viewType}
            />
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="h-10 mt-4">
        {isFetchingNextPage && <div className="text-center">Loading more...</div>}
        {!hasNextPage && products.length > 0 && (
          <div className="text-center text-gray-500">더 이상 불러올 수 없습니다.</div>
        )}
      </div>
    </main>
  );
}
