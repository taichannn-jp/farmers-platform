import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// カート取得
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    // 仮のカートデータ（後でセッション管理と統合）
    const cartItems = [
      // クライアント側で管理
    ];

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error('カート取得エラー:', error);
    return NextResponse.json(
      { error: 'カートの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 注文作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, shippingAddress, totalAmount } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // トランザクションで注文を作成
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        shippingAddress,
        items: {
          create: items.map((item: any) => ({
            vegetableId: item.vegetableId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            vegetable: true,
          },
        },
      },
    });

    // 在庫を更新
    for (const item of items) {
      await prisma.vegetable.update({
        where: { id: item.vegetableId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({
      message: '注文が完了しました',
      order,
    });
  } catch (error) {
    console.error('注文作成エラー:', error);
    return NextResponse.json(
      { error: '注文処理に失敗しました' },
      { status: 500 }
    );
  }
}
