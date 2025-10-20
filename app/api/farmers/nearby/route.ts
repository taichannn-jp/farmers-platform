import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50');

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: '位置情報が必要です' },
        { status: 400 }
      );
    }

    // すべての農家を取得
    const allFarmers = await prisma.farmer.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: true,
        _count: {
          select: {
            vegetables: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // 距離を計算して範囲内の農家をフィルタリング
    const farmersWithDistance = allFarmers
      .map(farmer => {
        const distance = calculateDistance(
          latitude,
          longitude,
          farmer.latitude,
          farmer.longitude
        );
        const avgRating = farmer.reviews.length > 0
          ? farmer.reviews.reduce((sum, review) => sum + review.rating, 0) / farmer.reviews.length
          : 0;
        
        return {
          id: farmer.id,
          farmName: farmer.farmName,
          address: farmer.address,
          latitude: farmer.latitude,
          longitude: farmer.longitude,
          description: farmer.description,
          distance: Math.round(distance * 10) / 10, // 小数点1桁
          vegetableCount: farmer._count.vegetables,
          avgRating: Math.round(avgRating * 10) / 10,
        };
      })
      .filter(farmer => farmer.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ farmers: farmersWithDistance });
  } catch (error) {
    console.error('近くの農家検索エラー:', error);
    return NextResponse.json(
      { error: '農家の検索に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, radius = 50 } = body; // radius in km

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: '位置情報が必要です' },
        { status: 400 }
      );
    }

    // すべての農家を取得
    const allFarmers = await prisma.farmer.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: true,
        _count: {
          select: {
            vegetables: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // 距離を計算して範囲内の農家をフィルタリング
    const farmersWithDistance = allFarmers
      .map(farmer => {
        const distance = calculateDistance(
          latitude,
          longitude,
          farmer.latitude,
          farmer.longitude
        );
        const avgRating = farmer.reviews.length > 0
          ? farmer.reviews.reduce((sum, review) => sum + review.rating, 0) / farmer.reviews.length
          : 0;
        
        return {
          ...farmer,
          distance,
          avgRating,
        };
      })
      .filter(farmer => farmer.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ farmers: farmersWithDistance });
  } catch (error) {
    console.error('近くの農家検索エラー:', error);
    return NextResponse.json(
      { error: '農家の検索に失敗しました' },
      { status: 500 }
    );
  }
}
