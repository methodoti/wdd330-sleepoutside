import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

// // create the data source (JSON connectio)
// const dataSource = new ProductData('tents');
// // render the product list (output target)
// const listElement = document.querySelector('.product-list');
// // new instance of ProductList
// const productList = new ProductList('tents', dataSource, listElement);

// // initialize the work! data fill and render on the page.
// productList.init();

// load header and footer
loadHeaderFooter();

const category = getParam('category');
// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const listElement = document.querySelector('.product-list');
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();
