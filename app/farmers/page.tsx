'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Leaf, ArrowLeft, Phone, Mail, Star } from "lucide-react";

interface Farmer {
  id: string;
  farmName: string;
  description: string;
  address: string;
  phone?: string;
  user: {
    email: string;
  };
  _count: {
    vegetables: number;
    reviews: number;
  };
  avgRating?: number;
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarmers() {
      try {
        const res = await fetch('/api/farmers');
        const data = await res.json();
        setFarmers(data);
      } catch (error) {
        console.error('農家取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFarmers();
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
              <span className="text-base sm:text-2xl font-bold text-green-600">農家</span>
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
          <h1 className="text-3xl font-bold mb-2">農家さん一覧</h1>
          <p className="text-gray-600">
            新鮮な野菜を提供する農家さんをご紹介します
          </p>
        </div>

        {farmers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">農家さんが見つかりませんでした</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((farmer) => (
              <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1">{farmer.farmName}</CardTitle>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">
                          {farmer.avgRating ? farmer.avgRating.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ({farmer._count.reviews}件)
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {farmer.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{farmer.address}</span>
                    </div>
                    {farmer.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{farmer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{farmer.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Leaf className="h-4 w-4" />
                      <span>{farmer._count.vegetables}種類の野菜を出品中</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/farmers/${farmer.id}`}>
                      詳細を見る
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href={`/farmers/${farmer.id}/vegetables`}>
                      野菜を見る
                    </Link>
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
