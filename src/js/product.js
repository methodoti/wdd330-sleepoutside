import { setLocalStorage, getLocalStorage, getParam } from './utils.mjs'; // add getLocalStorage to retrieve existing items on the cart
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  let cartItems = getLocalStorage('so-cart'); // create cartItems variable to hold the array of products on the cart
  if (cartItems === null) {
    // first time you run, cartItems is null so...
    cartItems = []; // ...it creates an Array to hold new products, it stops overwriting existing one on the cart
  }
  cartItems.push(product); // add the current product to the end of the array

  setLocalStorage('so-cart', cartItems); // saves the array to local storage
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
