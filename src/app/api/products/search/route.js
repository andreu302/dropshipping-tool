import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
  }

  try {
    const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}&shipCountry=br&isFreeShip=y`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });

    const $ = cheerio.load(response.data);
    const products = [];

    $('[class*=product-card]').each((i, el) => {
      if (products.length >= 12) return false;

      const title = $(el).find('[class*=title]').text().trim();
      const priceText = $(el).find('[class*=price]').first().text().trim();
      const costPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const link = $(el).find('a').attr('href');

      if (title && costPrice) {
        const sellingPrice = Math.ceil((costPrice / (1 - 0.40 - 0.14)) * 100) / 100;
        products.push({
          title,
          price: costPrice,
          sellingPrice,
          image: image?.startsWith('//') ? `https:${image}` : image,
          url: link?.startsWith('//') ? `https:${link}` : link,
        });
      }
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
