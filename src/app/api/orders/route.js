import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getNewOrders } from '@/lib/mercadolivre';

export async function GET() {
  try {
    const mlToken = cookies().get('ml_token')?.value;
    const mlUserId = cookies().get('ml_user_id')?.value;
    
    if (!mlToken || !mlUserId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const orders = await getNewOrders(mlToken, mlUserId);
    
    // Map data for frontend to avoid exposing all ML raw data
    const formattedOrders = (orders || []).map(order => ({
      id: order.id,
      date: order.date_created,
      status: order.status,
      total_amount: order.total_amount,
      buyer: {
        nickname: order.buyer.nickname,
      },
      items: order.order_items.map(item => ({
        title: item.item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 });
  }
}
