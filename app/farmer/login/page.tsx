'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Tractor } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function FarmerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('農家ログイン試行:', formData.email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('農家ログインレスポンス:', data);

      if (!response.ok) {
        throw new Error(data.error || 'ログインに失敗しました');
      }

      if (data.user.role !== 'FARMER') {
        throw new Error('農家アカウントでログインしてください');
      }

      // farmerIdがAPIレスポンスに含まれているはず
      // 念のため、含まれていない場合は取得
      if (!data.user.farmerId) {
        console.log('farmerIdが含まれていないため取得します');
        const farmerResponse = await fetch(`/api/farmers?userId=${data.user.id}`);
        const farmerData = await farmerResponse.json();
        
        if (farmerData.farmers && farmerData.farmers.length > 0) {
          data.user.farmerId = farmerData.farmers[0].id;
        }
      }

      console.log('最終ユーザー情報:', data.user);

      // ユーザー情報を保存
      login(data.user);
      
      // URLから戻り先を取得、なければダッシュボードへ
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl') || '/farmer/dashboard';
      
      alert('ログインに成功しました！');
      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Tractor className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">農家ログイン</h1>
            <p className="text-gray-600">農家アカウントでログイン</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                メールアドレス
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="farmer@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              農家アカウントをお持ちでない方は
              <a href="/farmer/signup" className="text-green-600 hover:text-green-700 font-medium ml-1">
                新規登録
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-gray-600 mb-3">
              お客様としてログイン
            </p>
            <a href="/login">
              <Button variant="outline" className="w-full">
                お客様ログイン
              </Button>
            </a>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">テストアカウント</p>
            <p className="text-xs text-gray-600 mb-1">
              farmer1@example.com / password123
            </p>
            <p className="text-xs text-gray-600">
              farmer2@example.com / password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
