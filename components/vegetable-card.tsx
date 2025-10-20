'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { FavoriteButton } from '@/components/favorite-button';

interface VegetableCardProps {
  id: string;
  name: string;
  variety?: string | null;
  price: number;
  unit: string;
  stock: number;
  description: string;
  images: string;
  isOrganic: boolean;
  isRare: boolean;
  isIrregular: boolean;
  isBundle: boolean;
  discountRate: number;
  farmer: {
    farmName: string;
  };
}

export function VegetableCard({ vegetable }: { vegetable: VegetableCardProps }) {
  const images = JSON.parse(vegetable.images);
  const finalPrice = vegetable.discountRate > 0 
    ? vegetable.price * (1 - vegetable.discountRate / 100) 
    : vegetable.price;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      <Link href={`/vegetables/${vegetable.id}`}>
        <div className="aspect-square bg-gray-200 relative">
          {images[0] && (
            <img
              src={images[0]}
              alt={vegetable.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {vegetable.isOrganic && (
              <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                有機栽培
              </div>
            )}
            {vegetable.isRare && (
              <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                珍しい品種
              </div>
            )}
            {vegetable.isIrregular && (
              <div className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                訳あり {vegetable.discountRate}%OFF
              </div>
            )}
            {vegetable.isBundle && (
              <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                詰め合わせ
              </div>
            )}
          </div>
          {/* お気に入りボタン */}
          <div className="absolute top-2 left-2 z-10">
            <FavoriteButton
              vegetableId={vegetable.id}
              vegetableName={vegetable.name}
              price={finalPrice}
              unit={vegetable.unit}
              image={images[0]}
              farmName={vegetable.farmer.farmName}
              stock={vegetable.stock}
              size="sm"
            />
          </div>
          {vegetable.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">売り切れ</span>
            </div>
          )}
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {vegetable.name}
          {vegetable.variety && (
            <span className="text-sm font-normal text-gray-500">({vegetable.variety})</span>
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {vegetable.farmer.farmName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {vegetable.description}
        </p>
        <div className="text-sm text-gray-500">
          在庫: {vegetable.stock > 0 ? `${vegetable.stock}${vegetable.unit}` : '売り切れ'}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <div>
            {vegetable.discountRate > 0 ? (
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(finalPrice)}
                </div>
                <div className="text-sm text-gray-400 line-through">
                  {formatPrice(vegetable.price)}
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(vegetable.price)}
              </div>
            )}
            <div className="text-sm text-gray-500">/ {vegetable.unit}</div>
          </div>
        </div>
        <Button asChild className="w-full" disabled={vegetable.stock === 0}>
          <Link href={`/vegetables/${vegetable.id}`}>
            {vegetable.stock > 0 ? '詳細を見る' : '売り切れ'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
