export default class CheckoutProcess {
  constructor(cartData) {
    this.cartData = cartData;
  }

  // Calculate the subtotal by summing the (price * quantity) for each item in the cart, then displaying it in the designated element.
  calculateSubtotalAndDisplay() {
    const subtotal = this.cartData.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity,
      0,
    );
    const subtotalElement = document.querySelector('.subtotal');
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    return;
  }

  calculateTaxShippingAndTotalAndDisplay() {
    const taxRate = 0.06;
    const taxCharge = this.cartData.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity * taxRate,
      0,
    );
    const taxChargeElement = document.querySelector('.tax');
    taxChargeElement.textContent = `Tax: $${taxCharge.toFixed(2)}`;

    const totalQuantityOfItems = this.cartData.reduce(
      (total, item) => total + item.Quantity,
      0,
    );

    let shippingCharge;
    if (totalQuantityOfItems === 1) {
      shippingCharge = 10.0;
    } else {
      shippingCharge = 2 * (totalQuantityOfItems - 1) + 10.0;
    }

    const shippingChargeElement = document.querySelector('.shipping');
    shippingChargeElement.textContent = `Shipping: $${shippingCharge.toFixed(2)}`;

    const orderTotal =
      this.cartData.reduce(
        (total, item) => total + item.FinalPrice * item.Quantity,
        0,
      ) +
      taxCharge +
      shippingCharge;
    const orderTotalElement = document.querySelector('.total');
    orderTotalElement.textContent = `Order Total: $${orderTotal.toFixed(2)}`;
  }

  init() {
    this.calculateSubtotalAndDisplay();

    const zipInput = document.querySelector('#zip');

    zipInput.addEventListener('input', () => {
      if (zipInput.value.length === 5) {
        this.calculateTaxShippingAndTotalAndDisplay();
      }
    });
  }
}
