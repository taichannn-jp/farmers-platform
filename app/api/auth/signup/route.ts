import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上必要です'),
  role: z.enum(['CUSTOMER', 'FARMER']).default('CUSTOMER'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = signupSchema.parse(body);
    
    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // ユーザー作成（農家の場合はFarmerプロファイルも自動作成）
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 農家アカウントの場合、Farmerプロファイルを自動作成
    let farmerId = null;
    if (validatedData.role === 'FARMER') {
      const farmer = await prisma.farmer.create({
        data: {
          farmName: `${validatedData.name}の農園`,
          userId: user.id,
          address: '住所未設定',
          description: 'プロフィール未設定',
          latitude: 35.6812, // デフォルト位置（東京）
          longitude: 139.7671,
        },
      });
      farmerId = farmer.id;
    }

    return NextResponse.json(
      { 
        message: 'アカウントが作成されました',
        user: {
          ...user,
          farmerId,
        },
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

    console.error('アカウント作成エラー:', error);
    return NextResponse.json(
      { error: 'アカウント作成に失敗しました' },
      { status: 500 }
    );
  }
}
