const { getNewOrders, getShippingInfo } = require("../src/lib/mercadolivre");

async function processOrders() {
  console.log("Verificando pedidos novos...");

  const orders = await getNewOrders(
    process.env.ML_ACCESS_TOKEN,
    process.env.ML_SELLER_ID
  );

  if (orders.length === 0) {
    console.log("Nenhum pedido novo encontrado.");
    return;
  }

  for (const order of orders) {
    const info = await getShippingInfo(process.env.ML_ACCESS_TOKEN, order.id);
    const buyer = info.buyer;
    const item = info.order_items[0];

    console.log("=== NOVO PEDIDO ===");
    console.log(`Pedido ID: ${order.id}`);
    console.log(`Comprador: ${buyer.nickname}`);
    console.log(`Produto: ${item.item.title}`);
    console.log(`Quantidade: ${item.quantity}`);
    console.log(`Total: R$ ${order.total_amount}`);
    console.log("==================");
  }
}

processOrders();
