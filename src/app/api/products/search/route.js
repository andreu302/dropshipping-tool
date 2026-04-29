import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
  }

  const url = `https://aliexpress-datahub.p.rapidapi.com/item_search_2?q=${encodeURIComponent(keyword)}&page=1&sort=default`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'aliexpress-datahub.p.rapidapi.com',
      'x-rapidapi-key': '7c4b5da524msha66d81f18a78ec5p1fa1ecjsneac39fd98c7e',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `RapidAPI error ${res.status}`, detail: text }, { status: res.status });
  }

  const data = await res.

