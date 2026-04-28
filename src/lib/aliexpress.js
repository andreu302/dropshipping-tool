const axios = require("axios");
const cheerio = require("cheerio");

async function searchProducts(keyword, maxPrice = null) {
  const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}&shipCountry=br&isFreeShip=y`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });

  const $ = cheerio.load(response.data);
  const products = [];

  $("[class*=product-card]").each((i, el) => {
    const title = $(el).find("[class*=title]").text().trim();
    const priceText = $(el).find("[class*=price]").first().text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
    const image = $(el).find("img").attr("src") || $(el).find("img").attr("data-src");
    const link = $(el).find("a").attr("href");

    if (title && price) {
      if (!maxPrice || price <= maxPrice) {
        products.push({
          title,
          price,
          image: image?.startsWith("//") ? `https:${image}` : image,
          url: link?.startsWith("//") ? `https:${link}` : link,
        });
      }
    }
  });

  return products;
}

function calculateSellingPrice(costPrice, marginPercent = 40, mlFeePercent = 14) {
  const totalFee = mlFeePercent / 100;
  const margin = marginPercent / 100;
  const sellingPrice = costPrice / (1 - margin - totalFee);
  return Math.ceil(sellingPrice * 100) / 100;
}

module.exports = {
  searchProducts,
  calculateSellingPrice,
};
