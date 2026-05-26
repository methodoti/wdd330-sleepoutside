import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.productDetail = document.querySelector('.product-detail');
  }

  addToCart() {
    if (this.product?.Id) {
      this.addProductToCart(this.product);
    }
  }

  addProductToCart(product) {
    let cartItems = getLocalStorage('so-cart');
    if (cartItems === null) {
      cartItems = [];
    }
    cartItems.push(product);

    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    if (!this.product?.Id) {
      document.title = 'Sleep Outside | Product Not Found';
      this.productDetail.innerHTML = `
				<h2 class="divider">Product not found</h2>
				<p>We could not find the requested tent.</p>
			`;
      return;
    }

    // initialize variable for the visual indicator
    let discountIndicator = '';
    let suggestedRetailIndicator = '';

    // is there discount?
    if (this.product.FinalPrice < this.product.SuggestedRetailPrice) {
      // get suggested price
      const suggestedPrice = this.product.SuggestedRetailPrice;

      // suggested retail price
      suggestedRetailIndicator = `<p class="suggested__price"><del>$${this.product.SuggestedRetailPrice}</del></p>`;
    }

    document.title = `Sleep Outside | ${this.product.Name}`;
    this.productDetail.innerHTML = `
			<h3>${this.product.Brand?.Name ?? ''}</h3>
			<h2 class="divider">${this.product.NameWithoutBrand ?? this.product.Name}</h2>
			<img
				class="divider"
				src="${this.product.Image}"
				alt="${this.product.NameWithoutBrand ?? this.product.Name}"
			/>
			<p class="product-card__price">$${this.product.FinalPrice.toFixed(2)}</p>
			${suggestedRetailIndicator}
			<p class="product__color">${this.product.Colors?.[0]?.ColorName ?? ''}</p>
			<p class="product__description">${this.product.DescriptionHtmlSimple}</p>
			<div class="product-detail__add">
				<button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
			</div>
		`;
  }

  async init() {
    if (!this.productId) {
      this.renderProductDetails();
      return;
    }

    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    if (this.product?.Id) {
      document
        .getElementById('addToCart')
        .addEventListener('click', this.addToCart.bind(this));
    }
  }
}
