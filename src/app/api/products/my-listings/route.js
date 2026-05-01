import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const mlToken = cookies().get('ml_token')?.value;
    const mlUserId = cookies().get('ml_user_id')?.value;
    
    if (!mlToken || !mlUserId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 1. Obter IDs dos itens do usuário
    const searchRes = await fetch(`https://api.mercadolibre.com/users/${mlUserId}/items/search?status=active`, {
      headers: { Authorization: `Bearer ${mlToken}` }
    });
    
    const searchData = await searchRes.json();
    
    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // 2. Obter detalhes dos itens (pegando apenas os primeiros 20 para simplificar)
    const itemIds = searchData.results.slice(0, 20).join(',');
    const itemsRes = await fetch(`https://api.mercadolibre.com/items?ids=${itemIds}`, {
      headers: { Authorization: `Bearer ${mlToken}` }
    });
    
    const itemsData = await itemsRes.json();

    // 3. Mapear os dados para o frontend
    const products = itemsData.map(item => ({
      id: item.body.id,
      title: item.body.title,
      price: item.body.price,
      image: item.body.secure_thumbnail || item.body.thumbnail,
      permalink: item.body.permalink,
      status: item.body.status,
      available_quantity: item.body.available_quantity
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    return NextResponse.json({ error: 'Erro ao buscar anúncios' }, { status: 500 });
  }
}
