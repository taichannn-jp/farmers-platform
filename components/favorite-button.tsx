'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  vegetableId: string;
  vegetableName: string;
  price: number;
  unit: string;
  image: string;
  farmName: string;
  stock: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function FavoriteButton({
  vegetableId,
  vegetableName,
  price,
  unit,
  image,
  farmName,
  stock,
  size = 'md',
  showText = false,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    const exists = favorites.some((fav: any) => fav.vegetableId === vegetableId);
    setIsFavorite(exists);
  }, [user, vegetableId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('ログインが必要です');
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    
    if (isFavorite) {
      // お気に入りから削除
      const newFavorites = favorites.filter((fav: any) => fav.vegetableId !== vegetableId);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      // お気に入りに追加
      const newFavorite = {
        id: `fav-${vegetableId}-${Date.now()}`,
        vegetableId,
        name: vegetableName,
        price,
        unit,
        image,
        farmName,
        stock,
      };
      favorites.push(newFavorite);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      size={showText ? 'default' : 'icon'}
      className={`${!showText && sizeClasses[size]} ${
        isFavorite
          ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
          : 'hover:bg-red-50 hover:border-red-300'
      }`}
      onClick={toggleFavorite}
    >
      <Heart
        className={`${iconSizes[size]} ${isFavorite ? 'fill-current' : ''} ${
          showText ? 'mr-2' : ''
        }`}
      />
      {showText && (isFavorite ? 'お気に入り登録済み' : 'お気に入りに追加')}
    </Button>
  );
}
