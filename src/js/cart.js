import { getLocalStorage, setLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const CART_KEY = 'so-cart';

// Normalize persisted cart data into one entry per product with a valid Quantity.
function normalizeCartItems(items = []) {
  const groupedItems = new Map();

  // Support both old cart shape (duplicates) and new shape (Quantity field).
  items.forEach((item) => {
    const quantityFromItem = Number(item.Quantity);
    const itemQuantity =
      Number.isFinite(quantityFromItem) && quantityFromItem > 0
        ? Math.floor(quantityFromItem)
        : 1;

    if (!groupedItems.has(item.Id)) {
      groupedItems.set(item.Id, { ...item, Quantity: itemQuantity });
      return;
    }

    const existingItem = groupedItems.get(item.Id);
    existingItem.Quantity += itemQuantity;
  });

  return Array.from(groupedItems.values());
}

function getCartItems() {
  const cartItems = getLocalStorage(CART_KEY) || [];
  return normalizeCartItems(cartItems);
}

// Keep cart writes in one place so storage updates stay consistent.
function saveCartItems(items) {
  setLocalStorage(CART_KEY, items);
}

function renderCartContents() {
  const cartItems = getCartItems();
  const productList = document.querySelector('.product-list');
  const cartSummary = document.querySelector('.cart-summary');

  // When the cart is empty, show a friendly message and stop rendering cards.
  if (cartItems.length === 0) {
    productList.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
    cartSummary.style.display = 'none';
    return;
  }

  // Convert each cart item object into HTML and inject into the page.
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join('');
}

function handleCartInteraction(event) {
  const removeButton = event.target.closest('.cart-card__remove-inline');
  if (removeButton) {
    removeItemFromCart(removeButton.dataset.id);
    return;
  }

  const increaseButton = event.target.closest('.cart-card__qty-btn--plus');
  if (increaseButton) {
    const currentQuantity = Number(increaseButton.dataset.quantity) || 1;
    updateItemQuantity(increaseButton.dataset.id, currentQuantity + 1);
    return;
  }

  const decreaseButton = event.target.closest('.cart-card__qty-btn--minus');
  if (decreaseButton) {
    const currentQuantity = Number(decreaseButton.dataset.quantity) || 1;
    const nextQuantity = Math.max(1, currentQuantity - 1);
    updateItemQuantity(decreaseButton.dataset.id, nextQuantity);
  }
}

function cartItemTemplate(item) {
  // Build one cart card for each product from localStorage.
  const newItem = `<li class="cart-card divider">
      <a href="/product_pages/?product=${item.Id}" class="cart-card__image"><img src="${item.Image}" alt="${item.Name}" /></a>
      <a href="/product_pages/?product=${item.Id}"><h2 class="card__name">${item.Name}</h2></a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ''}</p>
      <div class="cart-card__controls" aria-label="Quantity controls for ${item.Name}">
        <button type="button" class="cart-card__qty-btn cart-card__qty-btn--minus" data-id="${item.Id}" data-quantity="${item.Quantity}" aria-label="Decrease quantity for ${item.Name}" >-</button>
        <span class="cart-card__quantity" aria-live="polite">${item.Quantity}</span>
        <button type="button" class="cart-card__qty-btn cart-card__qty-btn--plus" data-id="${item.Id}" data-quantity="${item.Quantity}" aria-label="Increase quantity for ${item.Name}" >+</button>
        <button type="button" class="cart-card__remove-inline" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart" title="Remove item" > <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"> <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h2v9H7V9Zm4 0h2v9h-2V9Zm4 0h2v9h-2V9Z" fill="currentColor"></path> </svg> </button>
      </div>
      <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
    </li>`;
  return newItem;
}

// Removes an item from the cart by creating a new cart array where the selected item has been removed. Then it sets the local storage to the new array and re-renders the cart contents and total price.
function removeItemFromCart(productId) {
  const cartItems = getCartItems();
  // Filter out the item with the matching productId to create a new cart array.
  const updatedCart = cartItems.filter((item) => item.Id !== productId);
  // Update local storage with the new cart array.
  saveCartItems(updatedCart);

  // Re-render the cart contents and total after removal.
  renderCartContents();
  calculateCartTotal();
}

function updateItemQuantity(productId, quantity) {
  const cartItems = getCartItems();
  // Replace only the edited item quantity and preserve the rest.
  const updatedCart = cartItems.map((item) =>
    item.Id === productId ? { ...item, Quantity: quantity } : item,
  );

  saveCartItems(updatedCart);
  renderCartContents();
  calculateCartTotal();
}

// Gets cart items from local storage and calculates and displays the total price, if there are items in the cart. If there are no items, the cart summary section remains hidden.
function calculateCartTotal() {
  const cartItems = getCartItems();
  const cartSummary = document.querySelector('.cart-summary');
  const cartTotal = document.querySelector('.cart-total');

  // If there are items, show summary and compute total.
  if (cartItems.length) {
    cartSummary.style.display = 'block';

    // Total is unit price multiplied by selected quantity per item.
    const total = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * item.Quantity,
      0,
    );
    cartTotal.textContent = 'Total: $' + total.toFixed(2);
    return;
  }

  cartSummary.style.display = 'none';
}

function initCartEvents() {
  const productList = document.querySelector('.product-list');
  // Event delegation keeps listeners stable even after cart re-render.
  productList.addEventListener('click', handleCartInteraction);
}

initCartEvents();
renderCartContents();
calculateCartTotal();
