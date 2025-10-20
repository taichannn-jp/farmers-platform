import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { MapPin, Star, Leaf, ShoppingCart } from "lucide-react";
import { AuthNav } from "@/components/auth-nav";
import { VegetableCard } from "@/components/vegetable-card";

export default async function HomePage() {
  // 野菜データを取得
  const vegetables = await prisma.vegetable.findMany({
    include: {
      farmer: {
        include: {
          user: true,
        },
      },
    },
    take: 6,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 農家データを取得
  const farmers = await prisma.farmer.findMany({
    include: {
      user: true,
      _count: {
        select: { vegetables: true },
      },
    },
    take: 3,
    where: {
      isVerified: true,
    },
  });

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-2xl font-bold text-green-600">🌾 農家さん</h1>
            <nav className="flex items-center gap-1 sm:gap-4 text-xs sm:text-base">
              <a href="/vegetables" className="text-gray-700 hover:text-green-600 px-1 sm:px-2">
                野菜
              </a>
              <a href="/farmers" className="text-gray-700 hover:text-green-600 px-1 sm:px-2">
                農家
              </a>
              <a href="/nearby" className="text-gray-700 hover:text-green-600 px-1 sm:px-2 hidden sm:inline">
                近く
              </a>
              <a href="/favorites" className="text-gray-700 hover:text-green-600 px-1 sm:px-2">
                ♥
              </a>
              <a href="/cart" className="text-gray-700 hover:text-green-600 px-1 sm:px-2">
                🛒
              </a>
              <AuthNav />
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-b from-green-50 to-white py-20 overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600"
            alt="新鮮な野菜"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              新鮮な野菜を<br />農家さんから直接お届け
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              あなたの近くの農家さんを見つけて、採れたて野菜を購入できます。<br />
              農家さんの想いが詰まった、安心・安全な野菜をお楽しみください。
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/vegetables">
                  <ShoppingCart className="mr-2" />
                  野菜を探す
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/nearby">
                  <MapPin className="mr-2" />
                  近くの農家さんを探す
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">プラットフォームの特徴</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">近くの農家さんを発見</h3>
              <p className="text-gray-600">
                位置情報を使って、あなたの近くで野菜を育てている農家さんを簡単に見つけられます。
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">新鮮で安心な野菜</h3>
              <p className="text-gray-600">
                採れたての新鮮な野菜を、生産者から直接購入できます。有機栽培の情報も確認できます。
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">お気に入り登録</h3>
              <p className="text-gray-600">
                お気に入りの野菜や農家さんを登録して、旬の時期にすぐにアクセスできます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 野菜一覧セクション */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">新着の野菜</h2>
            <Button asChild variant="outline">
              <Link href="/vegetables">すべて見る</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {vegetables.map((vegetable: any) => (
              <VegetableCard key={vegetable.id} vegetable={vegetable} />
            ))}
          </div>
        </div>
      </section>

      {/* 農家さん紹介セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">登録農家さん</h2>
            <Button asChild variant="outline">
              <Link href="/farmers">すべて見る</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {farmers.map((farmer: any) => (
              <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{farmer.farmName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {farmer.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {farmer.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    登録野菜: {farmer._count.vegetables}種類
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/farmers/${farmer.id}`}>農家さんを見る</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6" />
                <span className="text-lg font-bold">農家プラットフォーム</span>
              </div>
              <p className="text-gray-400 text-sm">
                農家さんと消費者をつなぐプラットフォーム
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">サービス</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/vegetables" className="hover:text-white">野菜を探す</Link></li>
                <li><Link href="/farmers" className="hover:text-white">農家さんを探す</Link></li>
                <li><Link href="/about" className="hover:text-white">使い方</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">農家さん向け</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/farmer/register" className="hover:text-white">農家登録</Link></li>
                <li><Link href="/farmer/dashboard" className="hover:text-white">ダッシュボード</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">ヘルプ</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">よくある質問</Link></li>
                <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
                <li><Link href="/terms" className="hover:text-white">利用規約</Link></li>
                <li><Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 農家プラットフォーム. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
