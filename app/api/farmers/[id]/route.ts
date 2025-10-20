import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farmer = await prisma.farmer.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        vegetables: {
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
        },
        _count: {
          select: {
            vegetables: true,
            reviews: true,
          },
        },
      },
    });

    if (!farmer) {
      return NextResponse.json(
        { error: '農家が見つかりません' },
        { status: 404 }
      );
    }

    // 平均評価を計算
    const avgRating = farmer.reviews.length > 0
      ? farmer.reviews.reduce((sum, review) => sum + review.rating, 0) / farmer.reviews.length
      : 0;

    return NextResponse.json({ farmer: { ...farmer, avgRating } });
  } catch (error) {
    console.error('農家詳細取得エラー:', error);
    return NextResponse.json(
      { error: '農家情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const farmerId = params.id; // Stringのまま
    
    const { farmName, address, phone, description, latitude, longitude } = body;

    // 農家プロフィール更新
    const farmer = await prisma.farmer.update({
      where: { id: farmerId },
      data: {
        ...(farmName && { farmName }),
        ...(address && { address }),
        ...(phone !== undefined && { phone }),
        ...(description !== undefined && { description }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
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

    return NextResponse.json({
      message: '農家プロフィールを更新しました',
      farmer,
    });
  } catch (error) {
    console.error('農家プロフィール更新エラー:', error);
    return NextResponse.json(
      { error: '農家プロフィールの更新に失敗しました' },
      { status: 500 }
    );
  }
}
