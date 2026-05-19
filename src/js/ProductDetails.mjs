import { setLocalStorage, getLocalStorage, getParam } from './utils.mjs'; // add getLocalStorage to retrieve existing items on the cart


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource
    }
    init() {

    }
    addProductToCart() {
        let cartItems = getLocalStorage('so-cart'); // create cartItems variable to hold the array of products on the cart
        if (cartItems === null) {
            // first time you run, cartItems is null so...
            cartItems = []; // ...it creates an Array to hold new products, it stops overwriting existing one on the cart
        }
        cartItems.push(this.product); // add the current product to the end of the array

        setLocalStorage('so-cart', cartItems); // saves the array to local storage
    }
    renderProductDetails() {

    }

}