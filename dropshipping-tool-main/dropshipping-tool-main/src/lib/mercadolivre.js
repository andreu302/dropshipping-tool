const axios = require("axios");

const ML_BASE_URL = "https://api.mercadolibre.com";

async function getAccessToken(code) {
  const response = await axios.post(`${ML_BASE_URL}/oauth/token`, {
    grant_type: "authorization_code",
    client_id: process.env.ML_CLIENT_ID,
    client_secret: process.env.ML_CLIENT_SECRET,
    code,
    redirect_uri: process.env.ML_REDIRECT_URI,
  });
  return response.data;
}

async function refreshToken(refresh_token) {
  const response = await axios.post(`${ML_BASE_URL}/oauth/token`, {
    grant_type: "refresh_token",
    client_id: process.env.ML_CLIENT_ID,
    client_secret: process.env.ML_CLIENT_SECRET,
    refresh_token,
  });
  return response.data;
}

async function createListing(accessToken, product) {
  const listing = {
    title: product.title,
    category_id: product.categoryId,
    price: product.price,
    currency_id: "BRL",
    available_quantity: product.quantity || 10,
    buying_mode: "buy_it_now",
    condition: "new",
    listing_type_id: "gold_special",
    description: {
      plain_text: product.description,
    },
    pictures: product.images.map((url) => ({ source: url })),
    shipping: {
      mode: "me2",
      free_shipping: false,
    },
  };

  const response = await axios.post(`${ML_BASE_URL}/items`, listing, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data;
}

async function getNewOrders(accessToken, sellerId) {
  const response = await axios.get(
    `${ML_BASE_URL}/orders/search?seller=${sellerId}&order.status=paid`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data.results;
}

async function getShippingInfo(accessToken, orderId) {
  const response = await axios.get(`${ML_BASE_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

module.exports = {
  getAccessToken,
  refreshToken,
  createListing,
  getNewOrders,
  getShippingInfo,
};
