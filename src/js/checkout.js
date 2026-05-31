import { getLocalStorage, loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load the header and footer of the page.
loadHeaderFooter();

// Create an instance of the CheckoutProcess class with the cart data and initialize it to calculate and display the order summary.
const checkoutProcess = new CheckoutProcess(getLocalStorage('so-cart'));
checkoutProcess.init();
