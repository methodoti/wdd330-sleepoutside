// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// get query string parameter from url
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  // If need to clear, clean the parent HTML first
  if (clear) {
    parentElement.innerHTML = '';
  }
  // pass the list template, using map
  const htmlStrings = list.map(templateFn);
  // insert on DOM in the choosed position
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  // If need to clear, clean the parent HTML first
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export function getCartItemCount(key = 'so-cart') {
  const cartItems = getLocalStorage(key) || [];

  return cartItems.reduce((total, item) => {
    const quantity = Number(item?.Quantity);
    const safeQuantity =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
    return total + safeQuantity;
  }, 0);
}

export function updateCartCountBadge() {
  const badgeElement = document.querySelector('.cart-count');
  if (!badgeElement) {
    return;
  }

  const itemCount = getCartItemCount();
  badgeElement.textContent = itemCount;
  badgeElement.classList.toggle('is-hidden', itemCount === 0);
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const headerElement = document.getElementById('main-header');
  renderWithTemplate(headerTemplate, headerElement);
  updateCartCountBadge();

  const footerTemplate = await loadTemplate('/partials/footer.html');
  const footerElement = document.getElementById('main-footer');
  renderWithTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll = true) {
  // create the main variable to target the insertion
  const main = document.querySelector('main');
  // create the alert variable to hold the div element to store the alerts
  const alert = document.createElement('div');

  // add the class alert for styling
  alert.classList.add('alert');
  // create the alert message element
  alert.innerHTML = `${message} <span>X</span>`;

  // add the click event listener on the element
  alert.addEventListener('click', function (e) {
    // if the clicked element is a X
    if (e.target.innerText === 'X') {
      // remove the element
      main.removeChild(this);
    }
  });

  // include the alert before everithing on main.
  main.prepend(alert);
  // scroll to the top of the page if true
  if (scroll) {
    window.scrollTo(0, 0);
  }
}
