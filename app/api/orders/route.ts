import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 注文一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerIdParam = searchParams.get('farmerId');
    const userId = searchParams.get('userId');

    let orders;

    if (farmerIdParam) {
      // 農家の注文一覧（自分の野菜が含まれる注文のみ）
      const farmerId = farmerIdParam; // Stringのまま
      
      orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              vegetable: {
                farmerId: farmerId,
              },
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            where: {
              vegetable: {
                farmerId: farmerId, // この農家の商品のみ
              },
            },
            include: {
              vegetable: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (userId) {
      // ユーザーの注文一覧
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'ユーザーIDまたは農家IDが必要です' },
        { status: 400 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('注文取得エラー:', error);
    return NextResponse.json(
      { error: '注文の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 注文ステータス更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: '注文IDとステータスが必要です' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            vegetable: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'ステータスを更新しました',
      order,
    });
  } catch (error) {
    console.error('ステータス更新エラー:', error);
    return NextResponse.json(
      { error: 'ステータス更新に失敗しました' },
      { status: 500 }
    );
  }
}
