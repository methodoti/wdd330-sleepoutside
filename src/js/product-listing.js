import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

// get the category from the URL query string
const category = getParam('category');
// create the data source.
const dataSource = new ProductData();
// render the product list (output target)
const listElement = document.querySelector('.product-list');
// new instance of ProductList where we pass the category we want to show, the data source, and the element to render in.
const productList = new ProductList(category, dataSource, listElement);

// initialize the work! data fill and render on the page.
productList.init();

// load header and footer
loadHeaderFooter();
