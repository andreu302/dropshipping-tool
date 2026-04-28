import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
  }

  try {
    const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}&shipCountry=br&isFreeShip=y`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });

    const html = await response.text();
    const products = [];

    const regex = /"title":"([^"]{10,100})","productId":"\d+","tradeDesc":"[^"]*","price":(\d+\.?\d*)/g;
    let match;

    while ((match = regex.exec(html)) !== null && products.length < 12) {
      const costPrice = parseFloat(match[2]);
      const sellingPrice = Math.ceil((costPrice / (1 - 0.40 - 0.14)) * 100) / 100;

      const imgRegex = new RegExp(`"${match[1].replace(/[.*+?^${}()|[$|\$|/g, '\\$&')}"[^}]*?"imageUrl":"([^"]+)"`);
      const imgMatch = imgRegex.exec(html);

      products.push({
        title: match[1],
        price: costPrice,
        sellingPrice,
        image: imgMatch ? `https:${imgMatch[1]}` : null,
      });
    }

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
