import ExternalServices from './ExternalServices.mjs';
import { alertMessage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(cartData) {
    this.cartData = cartData;
    this.subtotal = 0;
    this.taxCharge = 0;
    this.shippingCharge = 0;
    this.finalOrderTotal = 0;
  }

  // Calculate the subtotal by summing the (FinalPrice * Quantity) for each item in the cart, then displaying it in the designated element.
  calculateSubtotalAndDisplay() {
    // Use the reduce method to calculate the subtotal by iterating through each item in the cart and summing the (FinalPrice * Quantity) for each item.
    this.subtotal = this.cartData.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity,
      0,
    );
    // Select the element with the class 'subtotal' and update its text content to display the calculated subtotal.
    const subtotalElement = document.querySelector('.subtotal');
    subtotalElement.textContent = `Subtotal: $${this.subtotal.toFixed(2)}`;
    return;
  }

  // Calculate the tax, shipping, and total charges and display them to their respective elements. Tax and shipping rates were given in the assignment instructions.
  calculateTaxShippingAndTotalAndDisplay() {
    const taxRate = 0.06;
    // Calculate the tax charge by multiplying the subtotal by the tax rate.
    this.taxCharge = this.subtotal * taxRate;
    // Select the element with the class 'tax' and update its text content to display the calculated tax charge.
    const taxChargeElement = document.querySelector('.tax');
    taxChargeElement.textContent = `Tax: $${this.taxCharge.toFixed(2)}`;

    // Calculate the total quantity of items in the cart by using the reduce method to sum the Quantity of each item.
    const totalQuantityOfItems = this.cartData.reduce(
      (total, item) => total + item.Quantity,
      0,
    );
    // Calculate the shipping charge based on the total quantity of items. If there is only one item, the shipping charge is $10. For each additional item, the shipping charge increases by $2.
    if (totalQuantityOfItems === 1) {
      this.shippingCharge = 10.0;
    } else {
      this.shippingCharge = 2 * (totalQuantityOfItems - 1) + 10.0;
    }
    // Select the element with the class 'shipping' and update its text content to display the calculated shipping charge.
    const shippingChargeElement = document.querySelector('.shipping');
    shippingChargeElement.textContent = `Shipping: $${this.shippingCharge.toFixed(2)}`;

    // Calculate the order total by summing the subtotal, tax charge, and shipping charge.
    this.finalOrderTotal = this.subtotal + this.taxCharge + this.shippingCharge;
    // Select the element with the class 'orderTotal' and update its text content to display the calculated order total.
    const orderTotalElement = document.querySelector('.orderTotal');
    orderTotalElement.textContent = `Order Total: $${this.finalOrderTotal.toFixed(2)}`;
  }

  // Process an order from the form data and cart data, then send it to the server.
  async checkout(form) {
    // Convert the form data into a JSON object using the formDataToJSON function.
    const orderObject = formDataToJSON(form);

    // Add additional properties to the order object including the order date, order total, tax, shipping, and the items being purchased.
    orderObject.orderDate = new Date().toISOString();
    orderObject.orderTotal = this.finalOrderTotal;
    orderObject.tax = this.taxCharge;
    orderObject.shipping = this.shippingCharge;
    orderObject.items = packageItems(this.cartData);

    // Create an instance of the ExternalServices class and call the checkout method, passing in the order object.
    const externalServices = new ExternalServices();
    // call the checkout method
    try {
      const response = await externalServices.checkout(orderObject);
      // clear out the cart contents in localStorage
      localStorage.removeItem('so-cart');
      // redirect the user to the success page
      window.location.href = 'success.html';

      // if not possible, log the caught error to the console
    } catch (error) {
      // console.log("Error caught:", error.message); // just a test to see the error.message object
      // clear existing alerts from the DOM
      const existingAlerts = document.querySelectorAll('.alert');
      existingAlerts.forEach((alert) => alert.remove());

      // Extract error messages from the object
      const errorMessages = Object.values(error.message);
      // Iterate through error messages and call the alertMessage function on each error.
      errorMessages.forEach((msg) => {
        alertMessage(msg);
      });
    }
  }

  // Runs the checkout process by calculating and displaying the subtotal, and setting up an event listener on the zip code input field to calculate and display the tax, shipping, and finalorder total when a valid zip code is entered.
  init() {
    if (this.cartData && this.cartData.length > 0) {
      // Call the method to calculate and display the subtotal when the checkout process is initialized.
      this.calculateSubtotalAndDisplay();

      // Add an event listener to the zip code input field that listens for the 'input' event. When the user inputs a zip code that is 5 characters long it calls the method to calculate and display the tax, shipping, and final order total.
      const zipInput = document.querySelector('#zip');
      zipInput.addEventListener('input', () => {
        if (zipInput.value.length === 5) {
          this.calculateTaxShippingAndTotalAndDisplay();
        }
      });
    }
  }
}

// A function that takes the cart items and creates, and returns, a new array with only the parts needed (Id, Name, FinalPrice, Quantity) for the checkout process.
function packageItems(items) {
  // Iterate through the cart items and create a new array that only includes the Id, Name, FinalPrice, and Quantity for each item.
  const packagedItems = items.map((item) => {
    return {
      Id: item.Id,
      Name: item.Name,
      FinalPrice: item.FinalPrice,
      Quantity: item.Quantity,
    };
  });
  // Return the new array.
  return packagedItems;
}

// A function that converts form data from a given form element into JSON.
function formDataToJSON(formElement) {
  // Create a new FormData object and JSON object to hold the converted data.
  const formData = new FormData(formElement);
  const convertedJSON = {};

  // Iterate through each key-value pair in the FormData object and add it to the JSON object.
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  // Return the converted JSON object.
  return convertedJSON;
}
