import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Phone, Mail, Award, Leaf, Package, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default async function FarmerPage({ params }: { params: { id: string } }) {
  const farmer = await prisma.farmer.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      vegetables: {
        where: {
          stock: {
            gt: 0,
          },
        },
        orderBy: {
          createdAt: 'desc',
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
        take: 10,
      },
    },
  });

  if (!farmer) {
    notFound();
  }

  const avgRating = farmer.reviews.length > 0
    ? farmer.reviews.reduce((sum: number, review) => sum + review.rating, 0) / farmer.reviews.length
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
        {/* 農家ヘッダー */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={farmer.user.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400'}
                alt={farmer.farmName}
                className="w-48 h-48 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{farmer.farmName}</h1>
                    <p className="text-lg text-gray-600">{farmer.user.name}</p>
                  </div>
                  {farmer.isVerified && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      認証済み
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-500">({farmer.reviews.length}件のレビュー)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 mt-0.5 text-green-600" />
                    <span>{farmer.address}</span>
                  </div>
                  {farmer.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span>{farmer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span>{farmer.user.email}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    メッセージを送る
                  </Button>
                </div>
              </div>
            </div>

            {farmer.description && (
              <div className="mt-6 pt-6 border-t">
                <h2 className="font-semibold text-lg mb-3">農園について</h2>
                <p className="text-gray-700 whitespace-pre-line">{farmer.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 取り扱い商品 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">取り扱い商品 ({farmer.vegetables.length})</h2>
            {farmer.vegetables.length > 0 && (
              <Button asChild variant="outline">
                <Link href={`/farmers/${farmer.id}/vegetables`}>すべて見る</Link>
              </Button>
            )}
          </div>
          {farmer.vegetables.length === 0 ? (
            <p className="text-gray-500">現在販売中の商品はありません。</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {farmer.vegetables.map((vegetable) => {
                const images = JSON.parse(vegetable.images);
                return (
                  <a key={vegetable.id} href={`/vegetables/${vegetable.id}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-0">
                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                          <img
                            src={images[0]}
                            alt={vegetable.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {vegetable.isOrganic && (
                              <span className="px-2 py-1 bg-green-600/90 text-white rounded text-xs font-medium flex items-center gap-1">
                                <Leaf className="h-3 w-3" />
                                有機
                              </span>
                            )}
                            {vegetable.isRare && (
                              <span className="px-2 py-1 bg-purple-600/90 text-white rounded text-xs font-medium flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                希少
                              </span>
                            )}
                            {vegetable.isIrregular && (
                              <span className="px-2 py-1 bg-orange-600/90 text-white rounded text-xs font-medium flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" />
                                規格外
                              </span>
                            )}
                            {vegetable.isBundle && (
                              <span className="px-2 py-1 bg-blue-600/90 text-white rounded text-xs font-medium flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                セット
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{vegetable.name}</h3>
                          {vegetable.variety && (
                            <p className="text-sm text-gray-600 mb-2">{vegetable.variety}</p>
                          )}
                          <div className="flex items-baseline gap-2">
                            {vegetable.discountRate > 0 ? (
                              <>
                                <span className="text-lg font-bold text-green-600">
                                  {formatPrice(vegetable.price * (1 - vegetable.discountRate / 100))}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(vegetable.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(vegetable.price)}
                              </span>
                            )}
                            <span className="text-sm text-gray-600">/ {vegetable.unit}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* レビュー */}
        <div>
          <h2 className="text-2xl font-bold mb-6">カスタマーレビュー</h2>
          {farmer.reviews.length === 0 ? (
            <p className="text-gray-500">まだレビューはありません。</p>
          ) : (
            <div className="space-y-4">
              {farmer.reviews.map((review) => (
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
