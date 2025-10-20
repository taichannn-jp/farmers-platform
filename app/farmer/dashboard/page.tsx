'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Package, ShoppingCart, Users, Plus, TrendingUp, Calendar, Star } from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  orderCount: number;
  vegetableCount: number;
  activeVegetableCount: number;
  avgRating: number;
  reviewCount: number;
}

interface RecentOrder {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    vegetable: {
      name: string;
    };
    quantity: number;
  }[];
}

export default function FarmerDashboardPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    orderCount: 0,
    vegetableCount: 0,
    activeVegetableCount: 0,
    avgRating: 0,
    reviewCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ユーザーがロードされるまで待つ
    if (user === null) {
      return;
    }
    
    if (user.role !== 'FARMER') {
      alert('農家アカウントでログインしてください');
      router.push('/farmer/login?returnUrl=/farmer/dashboard');
      return;
    }
    
    if (!user.farmerId) {
      // farmerIdがない場合、取得を試みる
      const fetchFarmerId = async () => {
        try {
          const farmerResponse = await fetch(`/api/farmers?userId=${user.id}`);
          const farmerData = await farmerResponse.json();
          
          if (farmerData.farmers && farmerData.farmers.length > 0) {
            const updatedUser = { ...user, farmerId: farmerData.farmers[0].id };
            login(updatedUser);
          } else {
            alert('農家情報が見つかりません');
            router.push('/farmer/login?returnUrl=/farmer/dashboard');
          }
        } catch (error) {
          console.error('農家ID取得エラー:', error);
          router.push('/farmer/login?returnUrl=/farmer/dashboard');
        }
      };
      fetchFarmerId();
    } else {
      // ダッシュボードデータを取得
      fetchDashboardData();
    }
  }, [user, router, login]);

  const fetchDashboardData = async () => {
    if (!user?.farmerId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/farmer/dashboard?farmerId=${user.farmerId}`);
      const data = await response.json();
      
      if (data.stats) {
        setStats(data.stats);
      }
      if (data.recentOrders) {
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      console.error('ダッシュボードデータ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'FARMER') {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">🌾 農家ダッシュボード</h1>
          <div className="flex items-center gap-4">
            <a href="/">
              <Button variant="outline">トップページへ</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* ウェルカムメッセージ */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">おかえりなさい！</h2>
          <p className="text-gray-600">今日も良い一日を。</p>
        </div>

        {/* 統計カード */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : `¥${stats.totalSales.toLocaleString()}`}
              </p>
              <p className="text-xs text-green-600 mt-2">今月の売上</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">注文数</p>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.orderCount}
              </p>
              <p className="text-xs text-blue-600 mt-2">今月</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">登録商品</p>
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.vegetableCount}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                販売中: {stats.activeVegetableCount}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">平均評価</p>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                {stats.reviewCount}件のレビュー
              </p>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">クイックアクション</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/farmer/vegetables">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">商品管理</h4>
                    <p className="text-sm text-gray-600">野菜の登録・編集</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="/farmer/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">注文管理</h4>
                    <p className="text-sm text-gray-600">注文を確認</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">売上分析</h4>
                  <p className="text-sm text-gray-600">レポートを見る</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 最近の注文 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">最近の注文</h3>
            <a href="/farmer/orders">
              <Button variant="outline">すべて見る</Button>
            </a>
          </div>
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <p className="text-center text-gray-500">読み込み中...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-center text-gray-500">注文はまだありません</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold">注文 #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.map(item => 
                              `${item.vegetable.name} ${item.quantity}kg`
                            ).join(', ')} - ¥{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'DELIVERED' ? '配送済み' :
                           order.status === 'SHIPPED' ? '配送中' :
                           order.status === 'CONFIRMED' ? '準備中' : '新規'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 今後の実装予定 */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">🚀 今後の機能追加予定</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                商品の在庫管理・編集機能
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                注文の詳細管理・ステータス更新
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                売上グラフ・分析レポート
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                お客様とのメッセージング
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                収穫スケジュール管理
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
