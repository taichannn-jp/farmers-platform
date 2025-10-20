import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const vegetableSchema = z.object({
  name: z.string().min(1, '商品名は必須です'),
  category: z.string(),
  variety: z.string().optional(),
  price: z.number().min(0),
  unit: z.string(),
  stock: z.number().min(0),
  description: z.string(),
  images: z.string(),
  isOrganic: z.boolean().default(false),
  isRare: z.boolean().default(false),
  isIrregular: z.boolean().default(false),
  isBundle: z.boolean().default(false),
  bundleContents: z.string().optional(),
  discountRate: z.number().min(0).max(100).default(0),
  farmerId: z.string(),
});

// 野菜作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = vegetableSchema.parse(body);

    const vegetable = await prisma.vegetable.create({
      data: validatedData,
    });

    return NextResponse.json({
      message: '商品を登録しました',
      vegetable,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('商品登録エラー:', error);
    return NextResponse.json(
      { error: '商品登録に失敗しました' },
      { status: 500 }
    );
  }
}

// 野菜更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: '商品IDが必要です' },
        { status: 400 }
      );
    }

    const vegetable = await prisma.vegetable.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: '商品を更新しました',
      vegetable,
    });
  } catch (error) {
    console.error('商品更新エラー:', error);
    return NextResponse.json(
      { error: '商品更新に失敗しました' },
      { status: 500 }
    );
  }
}

// 野菜削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '商品IDが必要です' },
        { status: 400 }
      );
    }

    await prisma.vegetable.delete({
      where: { id },
    });

    return NextResponse.json({
      message: '商品を削除しました',
    });
  } catch (error) {
    console.error('商品削除エラー:', error);
    return NextResponse.json(
      { error: '商品削除に失敗しました' },
      { status: 500 }
    );
  }
}
