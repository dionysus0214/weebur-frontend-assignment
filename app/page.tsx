"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchProducts } from "@/api/products";
import type { ProductsResponse } from "@/types/product";
import ProductCard from "./components/products/ProductCard";
import ProductSearch from "./components/products/ProductSearch";
import { useViewType } from "@/hooks/useViewType";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const order = (searchParams.get("order") as "asc" | "desc") ?? "desc";

  const viewType = useViewType();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<
      ProductsResponse,
      Error,
      InfiniteData<ProductsResponse>,
      string[],
      number
    >({
      queryKey: ["products", search, sortBy, order],
      queryFn: ({ pageParam }) =>
        fetchProducts({
          skip: pageParam,
          limit: 20,
          search,
          sortBy,
          order,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.products.length < 20) return undefined;
        return lastPage.skip + lastPage.limit;
      },
    });

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductSearch isLoading={isLoading} />

      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          일치하는 결과가 없습니다.
        </div>
      ) : (
        <div
          className={`
          grid gap-6
          ${
            viewType === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          }
        `}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewType={viewType}
            />
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="h-10 mt-4">
        {isFetchingNextPage && (
          <div className="py-4 text-center">상품을 불러오는 중</div>
        )}
        {!hasNextPage && products.length > 0 && (
          <div className="py-4 text-center text-gray-500">
            더 이상 불러올 수 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
