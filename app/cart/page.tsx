'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  vegetableId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  farmName: string;
  stock: number;
}

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/cart');
      return;
    }
    
    // ユーザー固有のカートを取得
    const savedCart = localStorage.getItem(`cart_${user.id}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [user, router]);

  const updateCart = (newItems: CartItem[]) => {
    if (!user) return;
    setCartItems(newItems);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(newItems));
  };

  const updateQuantity = (id: string, delta: number) => {
    const newItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id);
    updateCart(newItems);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('ログインが必要です');
      router.push('/login');
      return;
    }

    if (!shippingAddress) {
      alert('配送先住所を入力してください');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems.map(item => ({
            vegetableId: item.vegetableId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          totalAmount: getTotalAmount(),
        }),
      });

      if (!response.ok) {
        throw new Error('注文に失敗しました');
      }

      alert('注文が完了しました！');
      updateCart([]);
      setShippingAddress('');
    } catch (error) {
      alert('注文処理でエラーが発生しました');
    }
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
          <ShoppingCart className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">ショッピングカート</h1>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">カートは空です</p>
              <a href="/vegetables">
                <Button className="bg-green-600 hover:bg-green-700">
                  野菜を探す
                </Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* カートアイテム一覧 */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.farmName}</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(item.price)} / {item.unit}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 注文サマリー */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">注文サマリー</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">小計</span>
                      <span className="font-semibold">{formatPrice(getTotalAmount())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">配送料</span>
                      <span className="font-semibold">¥500</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg">
                      <span className="font-bold">合計</span>
                      <span className="font-bold text-green-600">
                        {formatPrice(getTotalAmount() + 500)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      配送先住所
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="〒123-4567&#10;東京都○○区○○ 1-2-3&#10;マンション名 101号室"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!shippingAddress}
                  >
                    注文を確定する
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
