import { getParam } from './utils.mjs'; // add getLocalStorage to retrieve existing items on the cart
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ProductData('tents');

const product = new ProductDetails(productId, dataSource);
product.init();
