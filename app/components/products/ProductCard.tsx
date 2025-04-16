import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  viewType: 'grid' | 'list';
}

export default function ProductCard({ product, viewType }: ProductCardProps) {
  const isGrid = viewType === 'grid';

  return (
    <div className={`
      border rounded-lg overflow-hidden shadow-sm
      ${isGrid ? 'h-full' : 'flex gap-4'}
    `}>
      <div className={`
        ${isGrid ? 'w-full aspect-square' : 'w-48 h-48'}
        relative
      `}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes={isGrid ? "100vw" : "12rem"}
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-yellow-500">★ {product.rating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({product.reviews.length} reviews)</span>
        </div>
      </div>
    </div>
  );
}
