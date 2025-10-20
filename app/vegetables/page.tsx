import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { MapPin, Leaf, ArrowLeft } from "lucide-react";

export default async function VegetablesPage() {
  const vegetables = await prisma.vegetable.findMany({
    include: {
      farmer: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
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
          <h1 className="text-4xl font-bold mb-2">野菜一覧</h1>
          <p className="text-gray-600">新鮮な野菜を農家さんから直接購入できます</p>
        </div>

        {/* フィルター（今後実装予定） */}
        <div className="mb-8 p-4 bg-white rounded-lg border">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="野菜名で検索..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <Button variant="outline">カテゴリで絞り込み</Button>
            <Button variant="outline">有機栽培のみ</Button>
            <Button variant="outline">距離で並び替え</Button>
          </div>
        </div>

        {/* 野菜グリッド */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vegetables.map((vegetable) => (
            <Card key={vegetable.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 relative">
                {JSON.parse(vegetable.images)[0] && (
                  <img
                    src={JSON.parse(vegetable.images)[0]}
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
                {vegetable.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">売り切れ</span>
                  </div>
                )}
              </div>
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
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(vegetable.price)}
                    </div>
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
          ))}
        </div>

        {vegetables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">現在、登録されている野菜はありません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
