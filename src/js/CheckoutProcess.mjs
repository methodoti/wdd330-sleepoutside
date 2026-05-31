export default class CheckoutProcess {
  constructor(cartData) {
    this.cartData = cartData;
  }

  // Calculate the subtotal by summing the (FinalPrice * Quantity) for each item in the cart, then displaying it in the designated element.
  calculateSubtotalAndDisplay() {
    // Use the reduce method to calculate the subtotal by iterating through each item in the cart and summing the product of FinalPrice and Quantity for each item.
    const subtotal = this.cartData.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity,
      0,
    );

    // Select the element with the class 'subtotal' and update its text content to display the calculated subtotal.
    const subtotalElement = document.querySelector('.subtotal');
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    return;
  }

  // Calculate the tax, shipping, and total charges and display them to their respective elements. Tax and shipping rates were given in the assignment instructions.
  calculateTaxShippingAndTotalAndDisplay() {
    const taxRate = 0.06;
    // Use the reduce method to calculate the total tax charge by iterating through each item in the cart and summing the product of FinalPrice, Quantity, and taxRate for each item.
    const taxCharge = this.cartData.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity * taxRate,
      0,
    );

    // Select the element with the class 'tax' and update its text content to display the calculated tax charge.
    const taxChargeElement = document.querySelector('.tax');
    taxChargeElement.textContent = `Tax: $${taxCharge.toFixed(2)}`;

    // Calculate the total quantity of items in the cart by using the reduce method to sum the Quantity of each item.
    const totalQuantityOfItems = this.cartData.reduce(
      (total, item) => total + item.Quantity,
      0,
    );

    // Calculate the shipping charge based on the total quantity of items. If there is only one item, the shipping charge is $10. For each additional item, the shipping charge increases by $2.
    let shippingCharge;
    if (totalQuantityOfItems === 1) {
      shippingCharge = 10.0;
    } else {
      shippingCharge = 2 * (totalQuantityOfItems - 1) + 10.0;
    }

    // Select the element with the class 'shipping' and update its text content to display the calculated shipping charge.
    const shippingChargeElement = document.querySelector('.shipping');
    shippingChargeElement.textContent = `Shipping: $${shippingCharge.toFixed(2)}`;

    // Calculate the order total by summing the subtotal, tax charge, and shipping charge. The subtotal is calculated by using the reduce method to sum the (FinalPrice * Quantity) for each item in the cart.
    const orderTotal =
      this.cartData.reduce(
        (total, item) => total + item.FinalPrice * item.Quantity,
        0,
      ) +
      taxCharge +
      shippingCharge;

    // Select the element with the class 'total' and update its text content to display the calculated order total.
    const orderTotalElement = document.querySelector('.total');
    orderTotalElement.textContent = `Order Total: $${orderTotal.toFixed(2)}`;
  }

  // Runs the checkout process by calculating and displaying the subtotal, and setting up an event listener on the zip code input field to calculate and display the tax, shipping, and total charges when a valid zip code is entered.
  init() {
    // Only run the code if there is cart data.
    if (this.cartData && this.cartData.length > 0) {
        // Call the method to calculate and display the subtotal when the checkout process is initialized.
        this.calculateSubtotalAndDisplay();

        const zipInput = document.querySelector('#zip');

        // Add an event listener to the zip code input field that listens for the 'input' event. When the user inputs a zip code, check if it is 5 characters long. If it is, call the method to calculate and display the tax, shipping, and total charges.
        zipInput.addEventListener('input', () => {
            if (zipInput.value.length === 5) {
            this.calculateTaxShippingAndTotalAndDisplay();
      }
    });
    }
  }
}
