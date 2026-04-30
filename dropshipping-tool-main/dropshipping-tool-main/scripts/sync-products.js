const { searchProducts, calculateSellingPrice } = require("../src/lib/aliexpress");
const { createListing } = require("../src/lib/mercadolivre");

const KEYWORDS = ["fone de ouvido", "suporte celular", "led strip"];
const ML_CATEGORY = "MLB1051";

async function syncProducts() {
  console.log("Iniciando sincronizacao de produtos...");

  for (const keyword of KEYWORDS) {
    console.log(`Buscando: ${keyword}`);
    const products = await searchProducts(keyword, 50);

    for (const product of products.slice(0, 3)) {
      const sellingPrice = calculateSellingPrice(product.price);

      const listing = {
        title: product.title.substring(0, 60),
        categoryId: ML_CATEGORY,
        price: sellingPrice,
        quantity: 10,
        description: `Produto importado. ${product.title}`,
        images: [product.image].filter(Boolean),
      };

      try {
        const result = await createListing(process.env.ML_ACCESS_TOKEN, listing);
        console.log(`Anuncio criado: ${result.id} - ${listing.title}`);
      } catch (err) {
        console.error(`Erro ao criar anuncio: ${err.message}`);
      }
    }
  }

  console.log("Sincronizacao finalizada.");
}

syncProducts();
