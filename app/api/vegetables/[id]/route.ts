import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vegetable = await prisma.vegetable.findUnique({
      where: { id: params.id },
      include: {
        farmer: {
          include: {
            user: true,
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
      },
    });

    if (!vegetable) {
      return NextResponse.json(
        { error: '野菜が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ vegetable });
  } catch (error) {
    console.error('野菜詳細取得エラー:', error);
    return NextResponse.json(
      { error: '野菜情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
