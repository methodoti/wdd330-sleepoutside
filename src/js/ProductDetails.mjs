import { setLocalStorage, getLocalStorage } from './utils.mjs'; // add getLocalStorage to retrieve existing items on the cart


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource
    }
    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
        document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this));
        // document.getElementById('addToCart')
        // .addEventListener('click', this.addToCart.bind(this));
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
        // selecet the <main> element from my HTML
        const mainElement = document.querySelector('main');

        // inject the new HTML with the class data (this.product)
        const html = `
            <section class="product-detail">
                <h3>${this.product.Brand.Name}</h3>
                <h2 class="divider">${this.product.NameWithoutBrand}</h2>
                <img class="divider"
                    src="${this.product.Image}"
                    alt="${this.product.NameWithoutBrand}" />
                <p class="product-card__price">$${this.product.FinalPrice}</p>
                <p class="product__color">${this.product.Colors[0].ColorName}</p>
                <p class="product__description">
                    ${this.product.DescriptionHtmlSimple}
                </p>

                <div class="product-detail__add">
                    <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
                </div>
            </section>
        `

        // change the old HTML with the new HTML
        mainElement.innerHTML = html;
    }

}