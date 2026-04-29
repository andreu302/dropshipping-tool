import { NextResponse } from 'next/server';

export async function GET(request) {
  const key = process.env.RAPIDAPI_KEY;
  return NextResponse.json({ 
    keyExists: !!key, 
    keyLength: key?.length || 0,
    keyPreview: key ? key.substring(0, 8) + '...' : 'undefined'
  });
}
