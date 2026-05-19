import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

function cartItemTemplate(item) {
  const newItem = `<li class='cart-card divider'>
  <a href='#' class='cart-card__image'>
    <img
      src='${item.Image}'
      alt='${item.Name}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: 1</p>
  <p class='cart-card__price'>$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// Gets cart items from local storage and calculates and displays the total price, if there are items in the cart. If there are no items, the cart summary section remains hidden.
function calculateCartTotal() {
  const cartItems = getLocalStorage('so-cart');

  if (cartItems?.length) {
    document.querySelector('.cart-summary').style.display = 'block';

    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector('.cart-total').textContent =
      `Total: $${total.toFixed(2)}`;
  }
}

renderCartContents();
calculateCartTotal();
