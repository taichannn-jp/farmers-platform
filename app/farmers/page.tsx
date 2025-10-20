import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Leaf, ArrowLeft, Phone, Mail } from "lucide-react";

export default async function FarmersPage() {
  const farmers = await prisma.farmer.findMany({
    include: {
      user: true,
      _count: {
        select: { 
          vegetables: true,
          reviews: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    where: {
      isVerified: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 平均評価を計算
  const farmersWithRating = farmers.map(farmer => {
    const avgRating = farmer.reviews.length > 0
      ? farmer.reviews.reduce((sum, review) => sum + review.rating, 0) / farmer.reviews.length
      : 0;
    return { ...farmer, avgRating };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">農家プラットフォーム</span>
            </Link>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                トップへ戻る
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">農家さん一覧</h1>
          <p className="text-gray-600">こだわりの野菜を作る農家さんをご紹介します</p>
        </div>

        {/* フィルター */}
        <div className="mb-8 p-4 bg-white rounded-lg border">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="農家名・地域で検索..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <Button variant="outline">距離で並び替え</Button>
            <Button variant="outline">評価が高い順</Button>
          </div>
        </div>

        {/* 農家グリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmersWithRating.map((farmer) => (
            <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
              {farmer.coverImage && (
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img
                    src={farmer.coverImage}
                    alt={farmer.farmName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{farmer.farmName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {farmer.address}
                    </CardDescription>
                  </div>
                  {farmer.isVerified && (
                    <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                      認証済み
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {farmer.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">登録野菜:</span>
                    <span className="font-semibold ml-1">{farmer._count.vegetables}種類</span>
                  </div>
                  <div>
                    <span className="text-gray-500">評価:</span>
                    <span className="font-semibold ml-1">
                      {farmer.avgRating > 0 ? `★ ${farmer.avgRating.toFixed(1)}` : '未評価'}
                    </span>
                  </div>
                </div>
                {farmer.phone && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {farmer.phone}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/farmers/${farmer.id}`}>詳細を見る</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/farmers/${farmer.id}/vegetables`}>野菜一覧</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {farmers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">現在、登録されている農家さんはありません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
