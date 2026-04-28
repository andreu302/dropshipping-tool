import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      const redirectUrl = new URL('/dashboard', request.url);
      redirectUrl.searchParams.set('token', data.access_token);
      redirectUrl.searchParams.set('user_id', data.user_id);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
