import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json(
        { error: '農家IDが必要です' },
        { status: 400 }
      );
    }

    // 今月の開始日
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 野菜数と販売中の野菜数
    const vegetables = await prisma.vegetable.findMany({
      where: { farmerId: farmerId },
      select: {
        id: true,
        stock: true,
      },
    });

    const vegetableCount = vegetables.length;
    const activeVegetableCount = vegetables.filter((v: any) => v.stock > 0).length;

    // 今月の注文
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            vegetable: {
              farmerId: farmerId,
            },
          },
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
      include: {
        items: {
          where: {
            vegetable: {
              farmerId: farmerId,
            },
          },
          include: {
            vegetable: true,
          },
        },
      },
    });

    // 総売上を計算
    const totalSales = orders.reduce((sum: any, order: any) => {
      const farmerItemsTotal = order.items.reduce((itemSum: any, item: any) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
      return sum + farmerItemsTotal;
    }, 0);

    const orderCount = orders.length;

    // 最近の注文（最新5件）
    const recentOrders = await prisma.order.findMany({
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
        items: {
          where: {
            vegetable: {
              farmerId: farmerId,
            },
          },
          include: {
            vegetable: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // レビュー情報（野菜のレビューから計算）
    const vegetablesWithReviews = await prisma.vegetable.findMany({
      where: { farmerId: farmerId },
      include: {
        reviews: true,
      },
    });

    const allReviews = vegetablesWithReviews.flatMap((v: any) => v.reviews);
    const reviewCount = allReviews.length;
    const avgRating = reviewCount > 0 
      ? allReviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviewCount
      : 0;

    return NextResponse.json({
      stats: {
        totalSales,
        orderCount,
        vegetableCount,
        activeVegetableCount,
        avgRating,
        reviewCount,
      },
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0),
        createdAt: order.createdAt,
        items: order.items.map((item: any) => ({
          vegetable: {
            name: item.vegetable.name,
          },
          quantity: item.quantity,
        })),
      })),
    });
  } catch (error) {
    console.error('ダッシュボードデータ取得エラー:', error);
    return NextResponse.json(
      { error: 'ダッシュボードデータの取得に失敗しました' },
      { status: 500 }
    );
  }
}
