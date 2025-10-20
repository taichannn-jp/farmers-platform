import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const farmerSchema = z.object({
  userId: z.string(),
  farmName: z.string().min(1, '農園名は必須です'),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().optional(),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // userIdが指定されている場合は、そのユーザーの農家情報のみ取得
    if (userId) {
      const farmer = await prisma.farmer.findUnique({
        where: { userId },
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

      if (!farmer) {
        return NextResponse.json({ farmers: [] });
      }

      const avgRating = farmer.reviews.length > 0
        ? farmer.reviews.reduce((sum, review) => sum + review.rating, 0) / farmer.reviews.length
        : 0;

      return NextResponse.json({ farmers: [{ ...farmer, avgRating }] });
    }

    // 通常の農家一覧取得
    const farmers = await prisma.farmer.findMany({
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
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 平均評価を計算
    const farmersWithRating = farmers.map(farmer => {
      const avgRating = farmer.reviews.length > 0
        ? farmer.reviews.reduce((sum, review) => sum + review.rating, 0) / farmer.reviews.length
        : 0;
      return { ...farmer, avgRating };
    });

    return NextResponse.json({ farmers: farmersWithRating });
  } catch (error) {
    console.error('農家取得エラー:', error);
    return NextResponse.json(
      { error: '農家の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = farmerSchema.parse(body);
    
    // 既存の農家プロフィールチェック
    const existingFarmer = await prisma.farmer.findUnique({
      where: { userId: validatedData.userId },
    });

    if (existingFarmer) {
      return NextResponse.json(
        { error: 'このユーザーは既に農家として登録されています' },
        { status: 400 }
      );
    }

    // 農家プロフィール作成
    const farmer = await prisma.farmer.create({
      data: {
        userId: validatedData.userId,
        farmName: validatedData.farmName,
        address: validatedData.address,
        phone: validatedData.phone,
        description: validatedData.description,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        isVerified: false, // デフォルトは未認証
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: '農家プロフィールが作成されました',
        farmer,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('農家プロフィール作成エラー:', error);
    return NextResponse.json(
      { error: '農家プロフィール作成に失敗しました' },
      { status: 500 }
    );
  }
}
