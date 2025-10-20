import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Leaf, Award, Package, TrendingDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VegetableCard } from '@/components/vegetable-card';

export default async function FarmerVegetablesPage({ params }: { params: { id: string } }) {
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
    },
  });

  if (!farmer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-600">
              🌾 農家さんプラットフォーム
            </Link>
            <Button asChild variant="outline">
              <Link href={`/farmers/${farmer.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                農家詳細に戻る
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 農家情報ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={farmer.user.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=100'}
              alt={farmer.farmName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{farmer.farmName}の野菜</h1>
              <p className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                {farmer.address}
              </p>
            </div>
          </div>
          
          {farmer.description && (
            <p className="text-gray-600 bg-white rounded-lg p-4 shadow-sm">
              {farmer.description}
            </p>
          )}
        </div>

        {/* 野菜一覧 */}
        {farmer.vegetables.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                出品中の野菜 ({farmer.vegetables.length}種類)
              </h2>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {farmer.vegetables.map((vegetable: any) => (
                <VegetableCard key={vegetable.id} vegetable={{ ...vegetable, farmer }} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mb-4">
              <Package className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              現在、出品中の野菜はありません
            </h3>
            <p className="text-gray-600 mb-6">
              {farmer.farmName}からの野菜が入荷次第、こちらに表示されます。
            </p>
            <Button asChild>
              <Link href="/vegetables">他の野菜を見る</Link>
            </Button>
          </div>
        )}

        {/* 他の農家さんも見る */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/farmers">他の農家さんも見る</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
