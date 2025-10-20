import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, MapPin, Star, Leaf, Award, Package, TrendingDown } from 'lucide-react';
import { VegetableActions } from '@/components/vegetable-actions';

export default async function VegetablePage({ params }: { params: { id: string } }) {
  const vegetable = await prisma.vegetable.findUnique({
    where: { id: params.id },
    include: {
      farmer: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!vegetable) {
    notFound();
  }

  const images = JSON.parse(vegetable.images);
  const avgRating = vegetable.reviews.length > 0
    ? vegetable.reviews.reduce((sum: number, review) => sum + review.rating, 0) / vegetable.reviews.length
    : 0;

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
        <div className="grid md:grid-cols-2 gap-8">
          {/* 画像エリア */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={images[0]}
                alt={vegetable.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded overflow-hidden bg-gray-100">
                    <img src={img} alt={`${vegetable.name} ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 商品情報エリア */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {vegetable.isOrganic && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    有機栽培
                  </span>
                )}
                {vegetable.isRare && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    希少品種
                  </span>
                )}
                {vegetable.isIrregular && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    規格外
                  </span>
                )}
                {vegetable.isBundle && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    詰め合わせ
                  </span>
                )}
              </div>
              
              {/* 農家名を目立つように表示 */}
              <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-700 font-medium">生産者</span>
                  <a 
                    href={`/farmers/${vegetable.farmer.id}`}
                    className="text-xl font-bold text-green-600 hover:text-green-700 hover:underline"
                  >
                    {vegetable.farmer.farmName}
                  </a>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vegetable.name}</h1>
              {vegetable.variety && (
                <p className="text-lg text-gray-600 mb-4">品種: {vegetable.variety}</p>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-500">({vegetable.reviews.length}件)</span>
                </div>
              </div>
            </div>

            {/* 価格 */}
            <div className="border-t border-b py-4">
              <div className="flex items-baseline gap-3">
                {vegetable.discountRate > 0 ? (
                  <>
                    <span className="text-4xl font-bold text-green-600">
                      {formatPrice(vegetable.price * (1 - vegetable.discountRate / 100))}
                    </span>
                    <span className="text-2xl text-gray-400 line-through">
                      {formatPrice(vegetable.price)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-bold">
                      {vegetable.discountRate}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-green-600">
                    {formatPrice(vegetable.price)}
                  </span>
                )}
                <span className="text-gray-600">/ {vegetable.unit}</span>
              </div>
            </div>

            {/* 在庫 */}
            <div>
              <p className="text-sm text-gray-600">
                在庫: {vegetable.stock > 0 ? `${vegetable.stock}${vegetable.unit}` : '在庫切れ'}
              </p>
            </div>

            {/* アクションボタン */}
            <VegetableActions
              vegetableId={vegetable.id}
              vegetableName={vegetable.name}
              price={vegetable.price}
              unit={vegetable.unit}
              image={JSON.parse(vegetable.images)[0]}
              farmName={vegetable.farmer.farmName}
              stock={vegetable.stock}
              discountRate={vegetable.discountRate}
            />

            {/* 農家情報 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">生産者情報</h3>
                <a href={`/farmers/${vegetable.farmer.id}`} className="flex items-start gap-4 hover:bg-gray-50 -m-2 p-2 rounded">
                  <img
                    src={vegetable.farmer.user.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100'}
                    alt={vegetable.farmer.farmName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{vegetable.farmer.farmName}</p>
                    <p className="text-sm text-gray-600">{vegetable.farmer.user.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {vegetable.farmer.address}
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* 詳細説明 */}
            <div>
              <h3 className="font-semibold text-lg mb-2">商品説明</h3>
              <p className="text-gray-700 whitespace-pre-line">{vegetable.description}</p>
            </div>

            {vegetable.isBundle && vegetable.bundleContents && (
              <div>
                <h3 className="font-semibold text-lg mb-2">セット内容</h3>
                <p className="text-gray-700 whitespace-pre-line">{vegetable.bundleContents}</p>
              </div>
            )}
          </div>
        </div>

        {/* レビュー */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">カスタマーレビュー</h2>
          {vegetable.reviews.length === 0 ? (
            <p className="text-gray-500">まだレビューはありません。</p>
          ) : (
            <div className="space-y-4">
              {vegetable.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={review.user.name || '匿名'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{review.user.name || '匿名'}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
