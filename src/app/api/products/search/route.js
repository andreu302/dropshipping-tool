import { NextResponse } from 'next/server';
import { searchProducts, calculateSellingPrice } from '@/lib/aliexpress';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
  }

  try {
    const products = await searchProducts(keyword);

    const productsWithPrice = products.slice(0, 12).map((p) => ({
      ...p,
      sellingPrice: calculateSellingPrice(p.price),
    }));

    return NextResponse.json({ products: productsWithPrice });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
