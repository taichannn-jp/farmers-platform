'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface Vegetable {
  id: string;
  name: string;
  category: string;
  variety?: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  images: string;
  isOrganic: boolean;
  isRare: boolean;
  isIrregular: boolean;
  isBundle: boolean;
  bundleContents?: string;
  discountRate: number;
}

export default function VegetableManagePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '野菜',
    variety: '',
    price: 0,
    unit: 'kg',
    stock: 0,
    description: '',
    images: '["https://images.unsplash.com/photo-1546548970-71785318a17b?w=800"]',
    isOrganic: false,
    isRare: false,
    isIrregular: false,
    isBundle: false,
    bundleContents: '',
    discountRate: 0,
  });

  useEffect(() => {
    // ユーザーがロードされるまで待つ
    if (user === null) {
      return;
    }
    
    if (user.role !== 'FARMER') {
      alert('農家アカウントでログインしてください');
      router.push('/farmer/login?returnUrl=/farmer/vegetables');
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
            router.push('/farmer/login?returnUrl=/farmer/vegetables');
          }
        } catch (error) {
          console.error('農家ID取得エラー:', error);
          router.push('/farmer/login?returnUrl=/farmer/vegetables');
        }
      };
      fetchFarmerId();
      return;
    }
    
    fetchVegetables();
  }, [user, router]);

  const fetchVegetables = async () => {
    if (!user?.farmerId) return;
    
    try {
      const response = await fetch(`/api/vegetables?farmerId=${user.farmerId}`);
      const data = await response.json();
      setVegetables(data.vegetables || []);
    } catch (error) {
      console.error('商品取得エラー:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.farmerId) {
      alert('農家情報が見つかりません');
      return;
    }

    try {
      const url = editingId 
        ? '/api/vegetables/manage' 
        : '/api/vegetables/manage';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          farmerId: user.farmerId,
          ...(editingId && { id: editingId }),
        }),
      });

      if (!response.ok) {
        throw new Error('商品登録に失敗しました');
      }

      alert(editingId ? '商品を更新しました' : '商品を登録しました');
      resetForm();
      fetchVegetables();
    } catch (error) {
      alert('エラーが発生しました');
    }
  };

  const handleEdit = (vegetable: Vegetable) => {
    setFormData({
      name: vegetable.name,
      category: vegetable.category,
      variety: vegetable.variety || '',
      price: vegetable.price,
      unit: vegetable.unit,
      stock: vegetable.stock,
      description: vegetable.description,
      images: vegetable.images,
      isOrganic: vegetable.isOrganic,
      isRare: vegetable.isRare,
      isIrregular: vegetable.isIrregular,
      isBundle: vegetable.isBundle,
      bundleContents: vegetable.bundleContents || '',
      discountRate: vegetable.discountRate,
    });
    setEditingId(vegetable.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(`/api/vegetables/manage?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      alert('商品を削除しました');
      fetchVegetables();
    } catch (error) {
      alert('削除エラーが発生しました');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '野菜',
      variety: '',
      price: 0,
      unit: 'kg',
      stock: 0,
      description: '',
      images: '["https://images.unsplash.com/photo-1546548970-71785318a17b?w=800"]',
      isOrganic: false,
      isRare: false,
      isIrregular: false,
      isBundle: false,
      bundleContents: '',
      discountRate: 0,
    });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">商品管理</h1>
          <a href="/farmer/dashboard">
            <Button variant="outline">ダッシュボードへ</Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 商品登録フォーム */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingId ? '商品編集' : '新規商品登録'}
                  </h2>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="h-4 w-4 mr-1" />
                      キャンセル
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">商品名</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">カテゴリー</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option>野菜</option>
                        <option>果物</option>
                        <option>米・穀物</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="variety">品種</Label>
                      <Input
                        id="variety"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">価格</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">単位</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stock">在庫数</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">説明</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isOrganic}
                        onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">有機栽培</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isRare}
                        onChange={(e) => setFormData({ ...formData, isRare: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">希少品種</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isIrregular}
                        onChange={(e) => setFormData({ ...formData, isIrregular: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">規格外</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isBundle}
                        onChange={(e) => setFormData({ ...formData, isBundle: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">詰め合わせ</span>
                    </label>
                  </div>

                  {formData.isIrregular && (
                    <div>
                      <Label htmlFor="discountRate">割引率 (%)</Label>
                      <Input
                        id="discountRate"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discountRate}
                        onChange={(e) => setFormData({ ...formData, discountRate: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? '更新する' : '登録する'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 商品一覧 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">登録商品一覧</h2>
            <div className="space-y-4">
              {vegetables.map((vegetable) => {
                const images = JSON.parse(vegetable.images);
                return (
                  <Card key={vegetable.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={images[0]}
                          alt={vegetable.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{vegetable.name}</h3>
                          {vegetable.variety && (
                            <p className="text-sm text-gray-600">{vegetable.variety}</p>
                          )}
                          <p className="text-lg font-bold text-green-600 mt-1">
                            {formatPrice(vegetable.price)} / {vegetable.unit}
                          </p>
                          <p className="text-sm text-gray-600">在庫: {vegetable.stock}{vegetable.unit}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(vegetable)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vegetable.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
