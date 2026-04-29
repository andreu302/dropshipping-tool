import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
  }

  try {
    const response = await axios.get('https://aliexpress-datahub.p.rapidapi.com/item_search_2', {
      params: { q: keyword, page: '1', sort: 'default' },
      headers: {
        'x-rapidapi-host': 'aliexpress-datahub.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      },
    });

    const items = response.data?.result?.resultList || [];

    const products = items.slice(0, 12).map((item) => {
      const costPrice = parseFloat(item.item?.sku?.def?.promotionPrice || item.item?.sku?.def?.price || 0);
      const sellingPrice = Math.ceil((costPrice / (1 - 0.40 - 0.14)) * 100) / 100;
      return {
        title: item.item?.title || '',
        price: costPrice,
        sellingPrice,
        image: item.item?.image || '',
        url: `https://www.aliexpress.com/item/${item.item?.itemId}.html`,
      };
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
