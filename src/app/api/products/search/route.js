import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  if (!keyword) return NextResponse.json({ error: 'Keyword required' }, { status: 400 });

  const res = await fetch(
    `https://aliexpress-datahub.p.rapidapi.com/item_search_2?q=${encodeURIComponent(keyword)}&page=1&sort=default`,
    {
      headers: {
        'x-rapidapi-host': 'aliexpress-datahub.p.rapidapi.com',
        'x-rapidapi-key': '7c4b5da524msha66d81f18a78ec5p1fa1ecjsneac39fd98c7e',
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: res.status, detail: text }, { status: res.status });
  }

  const data = await res.json();
  const items = data?.result?.resultList || [];

  const products = items.slice(0, 12).map((item) => {
    const costPrice = parseFloat(item.item?.sku?.def?.promotionPrice || item.item?.sku?.def?.price || 0);
    const sellingPrice = Math.ceil((costPrice / (1 - 0.54)) * 100) / 100;
    return {
      title: item.item?.title || '',
      price: costPrice,
      sellingPrice,
      image: item.item?.image || '',
      url: `https://www.aliexpress.com/item/${item.item?.itemId}.html`,
    };
  });

  return NextResponse.json({ products });
}
