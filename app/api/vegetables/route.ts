import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const farmerId = searchParams.get('farmerId');
    const category = searchParams.get('category');
    const isOrganic = searchParams.get('organic') === 'true';
    const isRare = searchParams.get('rare') === 'true';
    const isIrregular = searchParams.get('irregular') === 'true';
    const isBundle = searchParams.get('bundle') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};

    if (farmerId) where.farmerId = farmerId; // Stringとして扱う
    if (category) where.category = category;
    if (isOrganic) where.isOrganic = true;
    if (isRare) where.isRare = true;
    if (isIrregular) where.isIrregular = true;
    if (isBundle) where.isBundle = true;

    const vegetables = await prisma.vegetable.findMany({
      where,
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
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ vegetables });
  } catch (error) {
    console.error('野菜取得エラー:', error);
    return NextResponse.json(
      { error: '野菜の取得に失敗しました' },
      { status: 500 }
    );
  }
}
