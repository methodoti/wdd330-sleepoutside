import { getLocalStorage } from './utils.mjs';

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
}

function cartItemTemplate(item) {
  // Build one cart card for each product from localStorage.
  const newItem =
    '<li class=\'cart-card divider\'>' +
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
