'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { MapPin, Leaf, ArrowLeft, Package } from "lucide-react";

interface Vegetable {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  isOrganic: boolean;
  imageUrl?: string;
  farmer: {
    id: string;
    farmName: string;
    address: string;
    user: {
      name: string;
    };
  };
}

export default function VegetablesPage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVegetables() {
      try {
        const res = await fetch('/api/vegetables');
        const data = await res.json();
        setVegetables(data);
      } catch (error) {
        console.error('野菜取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVegetables();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 sm:gap-2">
              <Leaf className="h-5 w-5 sm:h-8 sm:w-8 text-green-600" />
              <span className="text-base sm:text-2xl font-bold text-green-600">野菜</span>
            </Link>
            <Button asChild variant="outline" size="sm" className="text-xs sm:text-base">
              <Link href="/">
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                戻る
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">野菜一覧</h1>
          <p className="text-gray-600">
            農家さんから直接お届けする新鮮な野菜
          </p>
        </div>

        {vegetables.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">野菜が見つかりませんでした</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vegetables.map((vegetable) => (
              <Card key={vegetable.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {vegetable.imageUrl && (
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={vegetable.imageUrl}
                      alt={vegetable.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{vegetable.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {vegetable.category}
                        </span>
                        {vegetable.isOrganic && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            有機栽培
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(vegetable.price)}
                      </div>
                      <div className="text-xs text-gray-500">/{vegetable.unit}</div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {vegetable.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="h-4 w-4" />
                      <span>在庫: {vegetable.stock}{vegetable.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Leaf className="h-4 w-4" />
                      <span>{vegetable.farmer.farmName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vegetable.farmer.address}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/vegetables/${vegetable.id}`}>
                      詳細を見る
                    </Link>
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={vegetable.stock === 0}
                  >
                    {vegetable.stock === 0 ? '在庫なし' : 'カートに追加'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
