import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createListing } from '@/lib/mercadolivre';

export async function POST(request) {
  try {
    const mlToken = cookies().get('ml_token')?.value;
    
    if (!mlToken) {
      return NextResponse.json({ error: 'Não autorizado. Faça login no Mercado Livre.' }, { status: 401 });
    }

    const product = await request.json();

    // 1. Descobrir a melhor categoria no Mercado Livre usando o Preditor
    const predictorRes = await fetch(`https://api.mercadolibre.com/sites/MLB/category_predictor?title=${encodeURIComponent(product.title)}`);
    const predictorData = await predictorRes.json();
    
    const categoryId = predictorData.id || 'MLB1953'; // Default para 'Outros' se falhar

    // 2. Formatar os dados para a função createListing
    const listingData = {
      title: product.title.slice(0, 60), // ML restringe o título a 60 caracteres
      categoryId,
      price: product.sellingPrice || product.price,
      description: `Produto internacional de alta qualidade.\n\nVeja mais detalhes na nossa loja.`,
      images: product.image ? [product.image] : [],
      quantity: 10,
    };

    // 3. Publicar o anúncio
    const result = await createListing(mlToken, listingData);

    return NextResponse.json({ success: true, id: result.id, url: result.permalink });
  } catch (error) {
    console.error('Erro ao publicar:', error.response?.data || error.message);
    return NextResponse.json({ error: error.response?.data?.message || 'Erro ao comunicar com Mercado Livre' }, { status: 500 });
  }
}
