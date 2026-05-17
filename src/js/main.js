import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// create a new ProductData instance for the tents category, select the product list element from the DOM, and create a new ProductList instance
const productData = new ProductData('tents');
const listElement = document.querySelector('.product-list');
const productList = new ProductList('tents', productData, listElement);

productList.init();
