import { getLocalStorage, loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load the header and footer of the page.
loadHeaderFooter();

// Create an instance of the CheckoutProcess class with the cart data and initialize it to calculate and display the order summary.
const newOrder = new CheckoutProcess(getLocalStorage('so-cart'));
newOrder.init();

document.querySelector('#placeOrder').addEventListener('click', (event) => {
  event.preventDefault();

  const form = document.forms['checkout-form'];
  newOrder.checkout(form);
});
