import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
  }

  const mockProducts = Array.from({ length: 8 }, (_, i) => ({
    title: `${keyword} - Produto ${i + 1} importado do AliExpress`,
    price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    sellingPrice: parseFloat((Math.random() * 150 + 80).toFixed(2)),
    image: `https://picsum.photos/seed/${keyword}${i}/400/300`,
    url: `https://aliexpress.com`,
  }));

  return NextResponse.json({ products: mockProducts });
}
