import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 シードデータを作成中...')

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash('password123', 10)

  // テストユーザー作成（顧客）
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: '田中 太郎',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  })

  // テストユーザー作成（農家1）
  const farmer1User = await prisma.user.upsert({
    where: { email: 'farmer1@example.com' },
    update: {},
    create: {
      email: 'farmer1@example.com',
      name: '山田農園',
      password: hashedPassword,
      role: 'FARMER',
    },
  })

  const farmer1 = await prisma.farmer.upsert({
    where: { userId: farmer1User.id },
    update: {},
    create: {
      userId: farmer1User.id,
      farmName: '山田農園',
      description: '有機野菜にこだわり、50年以上の歴史を持つ農園です。',
      phone: '090-1234-5678',
      address: '東京都練馬区石神井町1-1-1',
      latitude: 35.7368,
      longitude: 139.5967,
      isVerified: true,
    },
  })

  // テストユーザー作成（農家2）
  const farmer2User = await prisma.user.upsert({
    where: { email: 'farmer2@example.com' },
    update: {},
    create: {
      email: 'farmer2@example.com',
      name: '佐藤ファーム',
      password: hashedPassword,
      role: 'FARMER',
    },
  })

  const farmer2 = await prisma.farmer.upsert({
    where: { userId: farmer2User.id },
    update: {},
    create: {
      userId: farmer2User.id,
      farmName: '佐藤ファーム',
      description: '減農薬栽培で安心・安全な野菜をお届けします。',
      phone: '080-9876-5432',
      address: '千葉県柏市若柴1-1-1',
      latitude: 35.8919,
      longitude: 139.9397,
      isVerified: true,
    },
  })

  // 野菜データ作成
  const vegetables = [
    // 山田農園の商品
    {
      farmerId: farmer1.id,
      name: '完熟トマト',
      variety: '桃太郎ゴールド',
      category: '果菜類',
      description: '太陽の光をたっぷり浴びた甘みたっぷりの完熟トマト。糖度9度以上の極上品です。',
      price: 800,
      unit: 'kg',
      stock: 50,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
        'https://images.unsplash.com/photo-1546470427-227a4ce59da2?w=800'
      ]),
      isOrganic: true,
      isRare: true,
      harvestStart: new Date('2025-06-01'),
      harvestEnd: new Date('2025-09-30'),
    },
    {
      farmerId: farmer1.id,
      name: '朝採りキュウリ',
      variety: '夏すずみ',
      category: '果菜類',
      description: '朝5時に収穫したばかりの新鮮キュウリ。パリッとした食感が自慢です。',
      price: 400,
      unit: 'kg',
      stock: 30,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1589927986089-35812378d457?w=800',
        'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800'
      ]),
      isOrganic: true,
      harvestStart: new Date('2025-05-01'),
      harvestEnd: new Date('2025-08-31'),
    },
    {
      farmerId: farmer1.id,
      name: '無農薬ほうれん草',
      variety: '寒締めほうれん草',
      category: '葉菜類',
      description: '寒さで甘みが増した冬のほうれん草。栄養満点で柔らかい葉が特徴です。',
      price: 350,
      unit: '束',
      stock: 100,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800'
      ]),
      isOrganic: true,
      harvestStart: new Date('2025-03-01'),
      harvestEnd: new Date('2025-05-31'),
    },
    {
      farmerId: farmer1.id,
      name: '規格外トマト（訳あり）',
      variety: '桃太郎',
      category: '果菜類',
      description: '形は不揃いですが、味は正規品と同じ！お得な規格外商品です。料理用に最適。',
      price: 300,
      unit: 'kg',
      stock: 80,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800'
      ]),
      isOrganic: true,
      isIrregular: true,
      discountRate: 60,
      harvestStart: new Date('2025-06-01'),
      harvestEnd: new Date('2025-09-30'),
    },
    // 佐藤ファームの商品
    {
      farmerId: farmer2.id,
      name: 'ホクホク男爵いも',
      variety: '男爵',
      category: '根菜類',
      description: '北海道産の種芋から育てた男爵いも。ホクホクでコロッケに最適！',
      price: 450,
      unit: 'kg',
      stock: 120,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
        'https://images.unsplash.com/photo-1552316080-f4b2a84b28b0?w=800'
      ]),
      isOrganic: false,
      harvestStart: new Date('2025-06-01'),
      harvestEnd: new Date('2025-07-31'),
    },
    {
      farmerId: farmer2.id,
      name: '甘〜い雪下人参',
      variety: '雪下人参',
      category: '根菜類',
      description: '雪の下で熟成させた特別な人参。糖度が通常の2倍！生でも美味しい。',
      price: 600,
      unit: 'kg',
      stock: 60,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800',
        'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800'
      ]),
      isOrganic: false,
      isRare: true,
      harvestStart: new Date('2025-04-01'),
      harvestEnd: new Date('2025-11-30'),
    },
    {
      farmerId: farmer2.id,
      name: 'フリルレタス',
      variety: 'グリーンリーフ',
      category: '葉菜類',
      description: 'シャキシャキの新鮮レタス。サラダに最適です。',
      price: 280,
      unit: '個',
      stock: 40,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800'
      ]),
      isOrganic: false,
      harvestStart: new Date('2025-03-01'),
      harvestEnd: new Date('2025-06-30'),
    },
    {
      farmerId: farmer2.id,
      name: '農家の野菜詰め合わせ',
      variety: null,
      category: 'セット商品',
      description: '旬の野菜5〜7種類を詰め合わせたお得なセット。何が入るかはお楽しみ！',
      price: 1500,
      unit: 'セット',
      stock: 25,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'
      ]),
      isOrganic: false,
      isBundle: true,
      bundleContents: JSON.stringify(['人参', 'じゃがいも', 'レタス', 'トマト', 'キュウリ']),
      discountRate: 20,
      harvestStart: new Date('2025-03-01'),
      harvestEnd: new Date('2025-12-31'),
    },
    {
      farmerId: farmer2.id,
      name: '規格外野菜ミックス（訳あり）',
      variety: null,
      category: 'セット商品',
      description: '形は不揃いですが新鮮で美味しい野菜たち。料理用やジュース用に最適なお買い得品！',
      price: 800,
      unit: 'セット',
      stock: 40,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800'
      ]),
      isOrganic: false,
      isBundle: true,
      isIrregular: true,
      bundleContents: JSON.stringify(['人参', 'じゃがいも', 'トマト']),
      discountRate: 50,
      harvestStart: new Date('2025-03-01'),
      harvestEnd: new Date('2025-12-31'),
    },
  ]

  for (const veg of vegetables) {
    await prisma.vegetable.create({ data: veg })
  }

  console.log('✅ シードデータの作成が完了しました！')
  console.log('📧 テストアカウント:')
  console.log('   顧客: customer@example.com / password123')
  console.log('   農家1: farmer1@example.com / password123')
  console.log('   農家2: farmer2@example.com / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
