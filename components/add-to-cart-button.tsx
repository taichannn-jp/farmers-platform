'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  vegetableId: string;
  vegetableName: string;
  price: number;
  unit: string;
  image: string;
  farmName: string;
  stock: number;
  quantity?: number;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  vegetableId,
  vegetableName,
  price,
  unit,
  image,
  farmName,
  stock,
  quantity = 1,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  children,
}: AddToCartButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('ログインが必要です');
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsAdding(true);

    try {
      const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
      const existingItem = cart.find((item: any) => item.vegetableId === vegetableId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > stock) {
          alert(`在庫は${stock}${unit}までです`);
          return;
        }
        existingItem.quantity = newQuantity;
      } else {
        if (quantity > stock) {
          alert(`在庫は${stock}${unit}までです`);
          return;
        }
        cart.push({
          id: `cart-${vegetableId}-${Date.now()}`,
          vegetableId,
          name: vegetableName,
          price,
          quantity,
          unit,
          image,
          farmName,
          stock,
        });
      }

      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      alert('カートに追加しました！');
    } catch (error) {
      alert('エラーが発生しました');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={addToCart}
      disabled={disabled || isAdding || stock === 0}
    >
      {children || (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isAdding ? 'カートに追加中...' : 'カートに追加'}
        </>
      )}
    </Button>
  );
}
