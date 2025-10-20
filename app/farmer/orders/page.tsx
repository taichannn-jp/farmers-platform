'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    vegetable: {
      name: string;
      unit: string;
    };
  }>;
}

export default function OrdersManagePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    // ユーザーがロードされるまで待つ
    if (user === null) {
      return;
    }
    
    if (user.role !== 'FARMER') {
      alert('農家アカウントでログインしてください');
      router.push('/farmer/login?returnUrl=/farmer/orders');
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
            router.push('/farmer/login?returnUrl=/farmer/orders');
          }
        } catch (error) {
          console.error('農家ID取得エラー:', error);
          router.push('/farmer/login?returnUrl=/farmer/orders');
        }
      };
      fetchFarmerId();
      return;
    }
    
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    if (!user?.farmerId) return;
    
    try {
      const response = await fetch(`/api/orders?farmerId=${user.farmerId}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('注文取得エラー:', error);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error('ステータス更新に失敗しました');
      }

      alert('ステータスを更新しました');
      fetchOrders();
    } catch (error) {
      alert('エラーが発生しました');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'PROCESSING':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      PENDING: '保留中',
      PROCESSING: '準備中',
      SHIPPED: '配送中',
      DELIVERED: '配送完了',
      CANCELLED: 'キャンセル',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PROCESSING: 'bg-blue-100 text-blue-700',
      SHIPPED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">注文管理</h1>
          <a href="/farmer/dashboard">
            <Button variant="outline">ダッシュボードへ</Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* フィルター */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            onClick={() => setFilter('ALL')}
            className={filter === 'ALL' ? 'bg-green-600' : ''}
          >
            すべて
          </Button>
          <Button
            variant={filter === 'PENDING' ? 'default' : 'outline'}
            onClick={() => setFilter('PENDING')}
            className={filter === 'PENDING' ? 'bg-yellow-600' : ''}
          >
            保留中
          </Button>
          <Button
            variant={filter === 'PROCESSING' ? 'default' : 'outline'}
            onClick={() => setFilter('PROCESSING')}
            className={filter === 'PROCESSING' ? 'bg-blue-600' : ''}
          >
            準備中
          </Button>
          <Button
            variant={filter === 'SHIPPED' ? 'default' : 'outline'}
            onClick={() => setFilter('SHIPPED')}
            className={filter === 'SHIPPED' ? 'bg-purple-600' : ''}
          >
            配送中
          </Button>
          <Button
            variant={filter === 'DELIVERED' ? 'default' : 'outline'}
            onClick={() => setFilter('DELIVERED')}
            className={filter === 'DELIVERED' ? 'bg-green-600' : ''}
          >
            完了
          </Button>
        </div>

        {/* 注文一覧 */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">該当する注文はありません</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <h3 className="font-semibold text-lg">注文 #{order.id.slice(-8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.user.name} ({order.user.email})
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold mb-2">注文内容</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.vegetable.name} × {item.quantity}{item.vegetable.unit}
                          </span>
                          <span className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold mb-2">配送先</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {order.shippingAddress}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <Button
                        onClick={() => updateStatus(order.id, 'PROCESSING')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        準備開始
                      </Button>
                    )}
                    {order.status === 'PROCESSING' && (
                      <Button
                        onClick={() => updateStatus(order.id, 'SHIPPED')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        発送完了
                      </Button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <Button
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        配送完了
                      </Button>
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="text-red-600 hover:text-red-700"
                      >
                        キャンセル
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
