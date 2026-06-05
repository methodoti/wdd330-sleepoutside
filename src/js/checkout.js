import { getLocalStorage, loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load the header and footer of the page.
loadHeaderFooter();

// Create an instance of the CheckoutProcess class with the cart data and initialize it to calculate and display the order summary.
const newOrder = new CheckoutProcess(getLocalStorage('so-cart'));
newOrder.init();

// Adds a click event listener to the "Place Order" button that checks the form validity and processes the checkout if it is.
document.querySelector('#placeOrder').addEventListener('click', (event) => {
  // Prevent the default form submission behavior.
  event.preventDefault();
  // Get the form element and check its validity. Report any validation errors.
  const form = document.forms['checkout-form'];
  const validityCheck = form.checkValidity();
  form.reportValidity();
  // If the form is valid, proceed with the checkout process.
  if (validityCheck) {
    newOrder.checkout(form);
  }
});
