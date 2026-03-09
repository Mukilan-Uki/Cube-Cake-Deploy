import express from 'express'
import { sizePrices, baseAdditional, frostingAdditional, toppingAdditional, EXTRA_LAYER_PRICE, DELIVERY_FEE } from '../utils/constants.js';

const designingCakeDataRoutes = express.Router();

designingCakeDataRoutes.get('/', (req, res) => {
  const transform = (obj) => Object.values(obj).map(item => ({
    ...item,
    priceLKR: item.price
  }));

  res.json({
    sizes: transform(sizePrices),
    bases: transform(baseAdditional),
    frostings: transform(frostingAdditional),
    toppings: transform(toppingAdditional),
    extraLayerPrice: EXTRA_LAYER_PRICE,
    deliveryFee: DELIVERY_FEE
  });
});

export default designingCakeDataRoutes;