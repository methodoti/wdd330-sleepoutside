// import ExternalServices from './ExternalServices.mjs';
// import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';
import Alert from './Alert.js';

// create the alert system
const alerts = new Alert();

// initialize the alert system
alerts.init();

// // create the data source (JSON connectio)
// const dataSource = new ExternalServices('tents');
// // render the product list (output target)
// const listElement = document.querySelector('.product-list');
// // new instance of ProductList
// const productList = new ProductList('tents', dataSource, listElement);

// // initialize the work! data fill and render on the page.
// productList.init();

// load header and footer
loadHeaderFooter();
