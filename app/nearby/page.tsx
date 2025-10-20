'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, MapPin, Navigation, Star } from "lucide-react";

interface Farmer {
  id: string;
  farmName: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  distance: number;
  vegetableCount: number;
  avgRating?: number;
}

export default function NearbyFarmersPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('お使いのブラウザは位置情報に対応していません');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        // ここで実際のAPIを呼び出す（今はダミーデータ）
        loadNearbyFarmers(latitude, longitude);
      },
      (error) => {
        setError('位置情報の取得に失敗しました。設定を確認してください。');
        setLoading(false);
      }
    );
  };

  const loadNearbyFarmers = async (lat: number, lng: number) => {
    try {
      // APIから近くの農家を取得
      const response = await fetch(`/api/farmers/nearby?latitude=${lat}&longitude=${lng}&radius=50`);
      const data = await response.json();
      
      if (data.farmers) {
        setFarmers(data.farmers);
      }
      setLoading(false);
    } catch (error) {
      console.error('農家データ取得エラー:', error);
      setError('農家データの取得に失敗しました');
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 小数点1桁まで
  };

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
              <Link href="/">トップへ戻る</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📍 近くの農家さんを探す</h1>
          <p className="text-gray-600">位置情報を使って、あなたの近くの農家さんを見つけましょう</p>
        </div>

        {/* 位置情報取得ボタン */}
        {!location && (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">位置情報を取得</h2>
                <p className="text-gray-600 mb-6">
                  現在地から近い農家さんを表示します。<br />
                  ブラウザの位置情報許可が必要です。
                </p>
                <Button
                  onClick={getCurrentLocation}
                  size="lg"
                  disabled={loading}
                  className="gap-2"
                >
                  <Navigation className="h-5 w-5" />
                  {loading ? '取得中...' : '現在地から近くの農家さんを探す'}
                </Button>
                {error && (
                  <p className="text-red-500 mt-4 text-sm">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 現在地表示 */}
        {location && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">現在地を取得しました</p>
                  <p className="text-sm text-green-700">
                    緯度: {location.lat.toFixed(4)}, 経度: {location.lng.toFixed(4)}
                  </p>
                </div>
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  再取得
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 農家さん一覧 */}
        {farmers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">近くの農家さん（距離順）</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {farmers.map((farmer) => (
                <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{farmer.farmName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {farmer.address}
                        </CardDescription>
                        {farmer.avgRating !== undefined && farmer.avgRating > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{farmer.avgRating}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        📍 {farmer.distance}km
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {farmer.description || '新鮮な野菜をお届けします。'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        登録野菜: {farmer.vegetableCount}種類
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/farmers/${farmer.id}`}>詳細</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/farmers/${farmer.id}/vegetables`}>野菜を見る</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 使い方ガイド */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 使い方</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">1</span>
              <div>
                <p className="font-semibold">位置情報を許可</p>
                <p className="text-gray-600">ブラウザの位置情報許可ダイアログで「許可」を選択してください</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">2</span>
              <div>
                <p className="font-semibold">近くの農家さんを確認</p>
                <p className="text-gray-600">距離順に農家さんが表示されます</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">3</span>
              <div>
                <p className="font-semibold">野菜を購入</p>
                <p className="text-gray-600">気になる農家さんの野菜一覧から購入できます</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
