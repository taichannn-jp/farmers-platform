'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface FavoriteItem {
  id: string;
  vegetableId: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmName: string;
  stock: number;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/favorites');
      return;
    }
    
    // ユーザー固有のお気に入りを取得
    const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [user, router]);

  const removeFavorite = (id: string) => {
    if (!user) return;
    const newFavorites = favorites.filter(item => item.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  const addToCart = (item: FavoriteItem) => {
    if (!user) {
      alert('ログインが必要です');
      router.push('/login?returnUrl=/favorites');
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
    const existingItem = cart.find((i: any) => i.vegetableId === item.vegetableId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    alert('カートに追加しました！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-green-600">
            🌾 農家さんプラットフォーム
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold">お気に入り</h1>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">お気に入りはまだありません</p>
              <a href="/vegetables">
                <Button className="bg-green-600 hover:bg-green-700">
                  野菜を探す
                </Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(item => (
              <Card key={item.id} className="relative">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.farmName}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-sm text-gray-600">/ {item.unit}</span>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/vegetables/${item.vegetableId}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          詳細
                        </Button>
                      </a>
                      <Button
                        onClick={() => addToCart(item)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={item.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        追加
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
