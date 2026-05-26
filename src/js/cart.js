import { getLocalStorage, setLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function renderCartContents() {
  // Always normalize localStorage data to an array.
  // If the key does not exist, getLocalStorage returns null.
  const cartItems = getLocalStorage('so-cart') || [];
  const productList = document.querySelector('.product-list');
  const cartSummary = document.querySelector('.cart-summary');

  // When the cart is empty, show a friendly message and stop rendering cards.
  if (cartItems.length === 0) {
    productList.innerHTML = '<li class=\'cart-empty\'>Your cart is empty.</li>';
    cartSummary.style.display = 'none';
    return;
  }

  // Convert each cart item object into HTML and inject into the page.
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join('');

  // Add event listener to the product list to handle remove button clicks.
  productList.addEventListener('click', (event) => {
    // Check if the clicked element is a remove button.
    if (event.target.closest('.cart-card__remove')) {
      // Get the product ID from the 'data-id' attribute of the clicked button.
      const productId = event.target.getAttribute('data-id');
      // Call the function to remove the item from the cart.
      removeItemFromCart(productId);
    }
  });
}

function cartItemTemplate(item) {
  // Build one cart card for each product from localStorage.
  const newItem =
    '<li class=\'cart-card divider\'>' +
    ' <button type=\'button\' class=\'cart-card__remove\' data-id=\'' +
    item.Id +
    '\' aria-label=\'Remove item from cart\'>' +
    ' &times;</button>' +
    '  <a href=\'#\' class=\'cart-card__image\'>' +
    '    <img src=\'' +
    item.Image +
    '\' alt=\'' +
    item.Name +
    '\' />' +
    '  </a>' +
    '  <a href=\'#\'>' +
    '    <h2 class=\'card__name\'>' +
    item.Name +
    '</h2>' +
    '  </a>' +
    '  <p class=\'cart-card__color\'>' +
    item.Colors[0].ColorName +
    '</p>' +
    '  <p class=\'cart-card__quantity\'>qty: 1</p>' +
    '  <p class=\'cart-card__price\'>$' +
    item.FinalPrice +
    '</p>' +
    '</li>';

  return newItem;
}

// Removes an item from the cart by creating a new cart array where the selected item has been removed. Then it sets the local storage to the new array and re-renders the cart contents and total price.
function removeItemFromCart(productId) {
  // Get current cart items.
  const cartItems = getLocalStorage('so-cart');
  // Filter out the item with the matching productId to create a new cart array.
  const updatedCart = cartItems.filter((item) => item.Id !== productId);
  // Update local storage with the new cart array.
  setLocalStorage('so-cart', updatedCart);

  // Re-render the cart contents and total after removal.
  renderCartContents();
  calculateCartTotal();
}

// Gets cart items from local storage and calculates and displays the total price, if there are items in the cart. If there are no items, the cart summary section remains hidden.
function calculateCartTotal() {
  // Use the same normalization rule to avoid null handling issues.
  const cartItems = getLocalStorage('so-cart') || [];
  const cartSummary = document.querySelector('.cart-summary');
  const cartTotal = document.querySelector('.cart-total');

  // If there are items, show summary and compute total.
  if (cartItems.length) {
    cartSummary.style.display = 'block';

    // Sum all FinalPrice values from cart items.
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    cartTotal.textContent = 'Total: $' + total.toFixed(2);
  }
}

renderCartContents();
calculateCartTotal();
