import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// お気に入り一覧取得
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        vegetable: {
          include: {
            farmer: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('お気に入り取得エラー:', error);
    return NextResponse.json(
      { error: 'お気に入りの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// お気に入り追加
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vegetableId } = body;

    if (!userId || !vegetableId) {
      return NextResponse.json(
        { error: 'ユーザーIDと野菜IDが必要です' },
        { status: 400 }
      );
    }

    // 既存チェック
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        vegetableId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: '既にお気に入りに追加されています' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        vegetableId,
      },
      include: {
        vegetable: true,
      },
    });

    return NextResponse.json({
      message: 'お気に入りに追加しました',
      favorite,
    });
  } catch (error) {
    console.error('お気に入り追加エラー:', error);
    return NextResponse.json(
      { error: 'お気に入り追加に失敗しました' },
      { status: 500 }
    );
  }
}

// お気に入り削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vegetableId = searchParams.get('vegetableId');

    if (!userId || !vegetableId) {
      return NextResponse.json(
        { error: 'ユーザーIDと野菜IDが必要です' },
        { status: 400 }
      );
    }

    await prisma.favorite.deleteMany({
      where: {
        userId,
        vegetableId,
      },
    });

    return NextResponse.json({
      message: 'お気に入りから削除しました',
    });
  } catch (error) {
    console.error('お気に入り削除エラー:', error);
    return NextResponse.json(
      { error: 'お気に入り削除に失敗しました' },
      { status: 500 }
    );
  }
}
