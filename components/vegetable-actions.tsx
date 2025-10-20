'use client';

import { FavoriteButton } from '@/components/favorite-button';
import { AddToCartButton } from '@/components/add-to-cart-button';

interface VegetableActionsProps {
  vegetableId: string;
  vegetableName: string;
  price: number;
  unit: string;
  image: string;
  farmName: string;
  stock: number;
  discountRate: number;
}

export function VegetableActions({
  vegetableId,
  vegetableName,
  price,
  unit,
  image,
  farmName,
  stock,
  discountRate,
}: VegetableActionsProps) {
  const finalPrice = discountRate > 0 ? price * (1 - discountRate / 100) : price;

  return (
    <div className="flex gap-3">
      <AddToCartButton
        vegetableId={vegetableId}
        vegetableName={vegetableName}
        price={finalPrice}
        unit={unit}
        image={image}
        farmName={farmName}
        stock={stock}
        disabled={stock === 0}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      />
      <FavoriteButton
        vegetableId={vegetableId}
        vegetableName={vegetableName}
        price={finalPrice}
        unit={unit}
        image={image}
        farmName={farmName}
        stock={stock}
        size="lg"
      />
    </div>
  );
}
